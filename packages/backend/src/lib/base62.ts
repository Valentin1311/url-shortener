import base62 from "@sindresorhus/base62";

export const base62Encode: (n: bigint) => string = base62.encodeBigInt;
