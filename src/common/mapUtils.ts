export const computeIfAbsent = <K, V>(
  map: Map<K, V>,
  key: K,
  mappingFunction: (key: K) => V,
): V => {
  if (!map.has(key)) {
    const defaultValue = mappingFunction(key);
    map.set(key, defaultValue);
  }
  return map.get(key) as V;
};
