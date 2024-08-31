import * as fs from 'node:fs';

import {createRequestHandler, type RequestHandler} from '@remix-run/express';
import type {AppLoadContext, ServerBuild} from '@remix-run/node';
import {installGlobals} from '@remix-run/node';
import {ip as ipAddress} from 'address';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import sourceMapSupport from 'source-map-support';

import {env} from '~/common/env.server';
import {logger} from '~/common/logger.server';
import {mikroOrmMiddleware} from '~/express/middleware/mikroOrm';
import {connectToDb, disconnectDb} from '~/server/db/setup';
import {userService} from '~/server/domain/user';

const start = Date.now();

let viteVersion = '';
let remixVersion = '';
if (env.NODE_ENV !== 'production') {
  const getVersionFromPackageJson = (packageJson: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pkgJson = JSON.parse(
      fs.readFileSync(packageJson, 'utf-8')
    );

    if (typeof pkgJson !== 'object') {
      return 'NOT_FOUND';
    }

    if (pkgJson === null) {
      return 'NOT_FOUND';
    }

    if (!('version' in pkgJson)) {
      return 'NOT_FOUND';
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const prop: unknown = pkgJson.version;
    if (typeof prop !== 'string') {
      return 'NOT_FOUND';
    }

    return prop;
  };

  // get the vite version from the vite package.json
  viteVersion = getVersionFromPackageJson('node_modules/vite/package.json');
  remixVersion = getVersionFromPackageJson('node_modules/@remix-run/dev/package.json');
}

sourceMapSupport.install();
installGlobals();

/**
 * For development mode, we will use Vite to create the server
 * for better development experience and faster reloads.
 */
const viteDevServer =
  env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
      vite.createServer({
        server: {middlewareMode: true},
      })
    );

/**
 * Get the server build.
 * If we are in development mode, we will use the Vite server to load the server build.
 * Otherwise, we will import the server build from the build folder.
 *
 * @returns The server build
 */
const getBuild = async (): Promise<ServerBuild> => {
  if (viteDevServer) {
    return viteDevServer.ssrLoadModule(
      'virtual:remix/server-build'
    ) as Promise<ServerBuild>;
  }
  // @ts-expect-error (this file may or may not exist yet)
  // eslint-disable-next-line import-x/no-unresolved
  return import('./server/index.js') as Promise<ServerBuild>;
};

const BASE_PATH = '';

let didStartServer = false;

const ignorePathPatterns = [
  /\/public\/.*/,
  /\/favicon.*/,
  /\/health(\/.*)?/,
];

export async function getLoadContext(
  req: express.Request,
  _: express.Response
): Promise<AppLoadContext> {
  // We skip the authentication check for paths that match the ignorePathPatterns
  if (ignorePathPatterns.some((pattern) => pattern.test(req.path))) {
    return {} as AppLoadContext;
  }

  return {
    user: await userService.getCurrentUser(),
  };
}

/**
 * Start the Express server and give it a chance for the call-site
 * to setup hooks to our Express server before it starts.
 */
export async function startServerLifecycle() {
  if (didStartServer) {
    throw new Error(
      'The express server has already been started. You can only have one instance running.'
    );
  }

  didStartServer = true;

  const app = express();

  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by');

  // Define the health endpoint
  app.get(
    '/health',
    (_req, res) => {
      return res.json({
        status: 'up',
        environment: env.NODE_ENV,
        version: env.APP_VERSION,
      });
    }
  );

  // handle asset requests
  if (viteDevServer) {
    app.use(viteDevServer.middlewares);
  } else {
    // Vite fingerprints its assets so we can cache forever.
    app.use(
      `${BASE_PATH}/assets`,
      express.static('build/client/assets', {
        immutable: true,
        maxAge: '1y',
      })
    );
  }
  // Everything else (like favicon.ico) is cached for an hour.
  app.use(BASE_PATH, express.static('build/client', {maxAge: '1h'}));

  app.use(
    morgan('tiny', {
      skip: (req, res) => {
        return (
          req.url === '/favicon.ico' ||
          res.statusCode < 400 ||
          req.url === '/health'
        );
      },
    })
  );

  app.enable('trust proxy');

  async function getRequestHandler(): Promise<RequestHandler> {
    return createRequestHandler({
      build: env.NODE_ENV === 'development' ? getBuild : await getBuild(),
      mode: env.NODE_ENV,
      getLoadContext,
    });
  }


  app.use((req, res, next) => {
    if (ignorePathPatterns.some((pattern) => pattern.test(req.path))) {
      next();
      return;
    }
    mikroOrmMiddleware(req, res, next);
  });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.all('*', await getRequestHandler());

  // Listen to uncaught exceptions that are unrecoverable.
  process.on('uncaughtException', (error) => {
    logger.error({
      msg: 'UNCAUGHT_EXCEPTION',
      error,
    });
    process.exit(1);
  });

  // Listen for uncaught Promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error({
      msg: 'UNHANDLED_REJECTION',
      promise,
      reason,
    });
  });

  const port = 5173;

  // run startup hooks
  await Promise.all([connectToDb()]);

  const server = app.listen(port, () => {
    const localUrl = `http://localhost:${port}`;
    let lanUrl: string | null = null;
    const localIp = ipAddress() ?? '';
    // Check if the address is a private ip
    // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
    // https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
    if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
      lanUrl = `http://${localIp}:${port}`;
    }

    logger.info(
      `
  🚀  Application started!
  Local:            ${localUrl}
  ${lanUrl !== null ? `On Your Network:  ${lanUrl}` : ''}
  Press Ctrl+C to stop
      `.trim()
    );

    if (env.NODE_ENV !== 'production') {
      const elapsed = Date.now() - start;

      logger.info(
        `VITE v${viteVersion} Remix v${remixVersion} ready in ${elapsed} ms`
      );
    }
    logger.info(
      `Server started in ${env.NODE_ENV === 'production' ? 'PRODUCTION mode 🚀' : 'DEVELOPMENT mode 🖥️'}`
    );
  });

  process.once('SIGTERM', gracefulShutdown);
  process.once('SIGINT', gracefulShutdown);

  /** Gracefully shutdown by cleaning up resources and stopping background jobs  */
  function gracefulShutdown() {
    logger.info('Server will shutdown');

    new Promise<void>((resolve) => {
      server.close(() => {
        logger.info('Server cannot accept more connections');
        resolve();
      });
    })
      .then(() => disconnectDb())
      .then(() => process.exit(0))
      .catch((err: unknown) => {
        console.error(err);
        process.exit(-1);
      });
  }
}

await startServerLifecycle();
