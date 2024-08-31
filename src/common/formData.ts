/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */
import type {z} from 'zod';

const KEY_SEPARATOR = '.';
const IS_NUMBER_REGEX = /^\d+$/;

const tryParse = (v: unknown) => {
  try {
    if (typeof v === 'string') {
      return JSON.parse(v);
    }
  } catch {
    return v;
  }
  return v;
};

export const formDataToObject = <T extends object>(formData: FormData, schema: z.Schema<T>): T | null => {
  const resultObject: any = {};
  for (const [key, value] of formData) {
    const data = tryParse(value);

    const keyParts = key.split(KEY_SEPARATOR);

    let obj = resultObject;
    for (let keyIdx = 0; keyIdx < keyParts.length - 1; keyIdx++) {
      const keyPart = keyParts[keyIdx];

      if (!obj[keyPart]) {
        obj[keyPart] = IS_NUMBER_REGEX.test(keyParts[keyIdx + 1]) ? [] : {};
      }
      obj = obj[keyPart];
    }

    const lastKeyPart = keyParts[keyParts.length - 1];
    const lastKeyPartIsArray = /\[\d*\]$|\[\]$/.test(lastKeyPart);

    if (lastKeyPartIsArray) {
      const key = lastKeyPart.replace(/\[\d*\]$|\[\]$/, '');
      if (!obj[key]) {
        obj[key] = [];
      }

      obj[key].push(data);
    }

    if (!lastKeyPartIsArray) {
      if (IS_NUMBER_REGEX.test(lastKeyPart)) {
        obj.push(data);
      } else {
        obj[lastKeyPart] = data;
      }
    }
  }

  const result = schema.safeParse(resultObject);
  if (result.success) {
    return result.data;
  }
  return null;
};

export const createFormDataRecursive = (
  data?: Record<string, unknown>,
  keyPrefix = '',
  formData: FormData = new FormData(),
): FormData => {
  if (data === undefined) {
    return formData;
  }
  for (const [key, value] of Object.entries(data)) {
    const formDataKey = keyPrefix + key;

    if (value === undefined || value === null) {
      continue;
    }

    if (value instanceof FileList) {
      for (const file of value) {
        formData.append(formDataKey, file);
      }
      continue;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(formDataKey, value);
      continue;
    }

    if (value instanceof Date) {
      formData.append(formDataKey, value.toISOString());
      continue;
    }

    if (typeof value === 'object') {
      createFormDataRecursive(value as Record<string, unknown>, formDataKey + KEY_SEPARATOR, formData);
      continue;
    }

    if (typeof value === 'string') {
      formData.append(formDataKey, value);
      continue;
    }

    if (typeof value === 'number') {
      formData.append(formDataKey, value.toString());
      continue;
    }

    if (typeof value === 'boolean') {
      formData.append(formDataKey, value ? 'true' : 'false');
      continue;
    }

    console.warn(`Unsupported value type for key ${key}: ${typeof value} - will be ignored`);
  }

  return formData;
};
