import hasha from "hasha";
import fs from "fs";

const options = {
  algorithm: "md5",
};

async function getFileHash(managerName, fileAddr) {
  try {
    const hash = await hasha.fromFile(
      `./lib/modules/manager/${managerName}/${fileAddr}`,
      options
    );
    return hash;
  } catch (err) {
    // logger.debug(`Couldn't resolve hash for ${managerName} -> ${fileName}`)
    return undefined;
  }
}

export async function getHash(manager) {
  let hashes = [];
  let files = fs.readdirSync(`./lib/modules/manager/${manager}`);

  if (files.includes("__snapshots__")) {
    const snapshots = fs.readdirSync(
      `./lib/modules/manager/${manager}/__snapshots__`
    );

    for (const snap of snapshots) {
      const hash = await getFileHash(manager, `__snapshots__/${snap}`);
      hashes.push(hash);
    }
  }

  files = files.filter((fileName) => RegExp(/.*(spec.js)/).test(fileName));
  for (const file of files) {
    const hash = getFileHash(manager, file);
    hashes.push(hash);
  }

  hashes = hashes.filter(Boolean);
  hashes = await Promise.all(hashes); //faster than using await in a for loop

  return hasha(hashes, options);
}
