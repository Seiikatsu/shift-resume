const KEY_SEPARATOR = '.';
const IS_NUMBER_REGEX = /^\d+$/;

const parse = (v: any) => {
  try {
    return JSON.parse(v);
  } catch (e) {
    return v;
  }
};

export const formDataToObject = (formData: FormData) => {
  const resultObject: any = {};
  for (let [key, value] of formData) {
    // let JSON.parse do the work for us - either we get typed values or not
    const data = parse(value);

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

  return resultObject;
};

export const createFormDataRecursive = (
  data: Record<string, any>,
  keyPrefix: string = '',
  formData: FormData = new FormData(),
): FormData => {
  if (!data) {
    return formData;
  }
  for (const [key, value] of Object.entries(data)) {
    const formDataKey = keyPrefix + key;

    if (value === undefined || value === null) {
      continue;
    }

    if (value instanceof FileList) {
      // for (let fileIndex = 0; fileIndex < value.length; fileIndex++) {
      //   const file = value[fileIndex];
      //   formData.append(formDataKey, file);
      // }
      for (let file of value) {
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
      createFormDataRecursive(value, formDataKey + KEY_SEPARATOR, formData);
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
