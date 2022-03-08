import { hashElement } from "folder-hash";

export default async function getHash(managerName) {
  const options = {
    files: { include: ["extract.js"] },
  };
  const hash = await hashElement(`./lib/manager/${managerName}`, options);
  return hash;
}
