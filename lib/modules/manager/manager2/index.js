import { getHash } from "../../../../util/hashFn.js";

export const fingerprint = await getHash(
  "manager2",
  ["extract", "update"],
  ["extract", "update"]
);
