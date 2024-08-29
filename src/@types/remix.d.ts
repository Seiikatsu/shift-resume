import type {User} from '~/server/domain/user/dto/user';

declare module '@remix-run/server-runtime' {

  export interface AppLoadContext {
    user: User;
  }
}
