import {SubmitOptions, useActionData, useNavigation, useSubmit} from '@remix-run/react';
import type {SerializeFrom} from '@remix-run/server-runtime';
import {useCallback, useEffect, useMemo} from 'react';

function deferred<T>() {
  let resolve: (value: T | PromiseLike<T>) => void = () => {};
  let reject: (reason?: any) => void = () => {};

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve,
    reject,
    promise
  };
}

type SubmitTarget =
  | HTMLFormElement
  | HTMLButtonElement
  | HTMLInputElement
  | FormData
  | URLSearchParams
  | {
  [name: string]: string;
}
  | null;

/**
 * @link https://github.com/remix-run/remix/discussions/5023
 */
export const useSubmitPromise = <
  T extends any,
  P = T extends (...args: any) => any ? Awaited<ReturnType<T>> : T,
>() => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<P>();
  const $deferred = useMemo(() => deferred<SerializeFrom<P>>(), []);

  useEffect(() => {
    if (navigation.state === 'idle' && actionData) {
      $deferred.resolve(actionData);
    }
  }, [$deferred, navigation.state, actionData]);

  return useCallback(
    (target: SubmitTarget, options: SubmitOptions = {}) => {
      submit(target, options);
      return $deferred.promise;
    },
    [$deferred.promise, submit]
  );
};
