import { getHash } from "../../../util/hashFn.js";

export const fingerprint = await getHash("manager1", ["extract"], ["extract"]);
