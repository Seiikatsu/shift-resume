/* eslint-disable @typescript-eslint/consistent-type-definitions,@typescript-eslint/no-explicit-any */

/*
 * see: https://stackoverflow.com/a/65079383
 */
declare interface ObjectConstructor extends Omit<ObjectConstructor, 'keys' | 'entries'> {
  /**
   * Returns the names of the enumerable string properties and methods of an object.
   * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  keys<O extends any[]>(obj: O): (keyof O)[];
  keys<O extends Record<Readonly<string>, any>>(obj: O): (keyof O)[];
  keys(obj: object): string[];

  /**
   * Returns an array of key/values of the enumerable properties of an object
   * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  entries<T extends Record<Readonly<string>, any>>(obj: T): [keyof T, T[keyof T]][];
  entries<T extends object>(obj: Record<string, T> | ArrayLike<T>): [string, T[keyof T]][];
  entries<T>(obj: Record<string, T> | ArrayLike<T>): [string, T][];
  entries(obj: object): [string, any][];
}

declare let Object: ObjectConstructor;
