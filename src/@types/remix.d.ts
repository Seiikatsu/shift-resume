import type {User} from '~/server/domain/user/dto/user';

declare module '@remix-run/server-runtime' {

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface AppLoadContext {
    user: User;
  }
}
