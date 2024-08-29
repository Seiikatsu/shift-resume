import {countries} from 'countries-list';
import {z} from 'zod';

/*
 * see: https://github.com/colinhacks/zod/discussions/2790#discussioncomment-7096060
 */
function unionOfLiterals<T extends string | number>(constants: readonly T[]) {
  const literals = constants.map(
    x => z.literal(x)
  ) as unknown as readonly [z.ZodLiteral<T>, z.ZodLiteral<T>, ...z.ZodLiteral<T>[]];
  return z.union(literals);
}

export const countriesUnion = unionOfLiterals(Object.keys(countries));
