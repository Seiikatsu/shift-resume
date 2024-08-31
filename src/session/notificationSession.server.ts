import {createCookieSessionStorage} from '@remix-run/node';

import {env} from '~/common/env.server';

type SessionFlashData = {
  notification?: {
    messageId: string;
    type?: 'error';
  };
};

export const notificationSessionStorage = createCookieSessionStorage<undefined, SessionFlashData>({
  cookie: {
    name: '__notifications',
    secrets: [env.SESSION_STORAGE_SECRET], // should be a process.env.MY_SECRET
    sameSite: 'lax',
  },
});
