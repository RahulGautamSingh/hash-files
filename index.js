import fs from "fs/promises";
import hasha from "hasha";
import minimatch from "minimatch";

const options = {
  algorithm: "sha256",
};

/**
 * @param {string} managerName
 * @param {string} fileAddr
 * @returns {Promise<string|undefined>}
 */
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
/**
 *
 * @param {string} manager
 * @returns {Promise<string|undefined>}
 */
export async function getHash(manager) {
  try {
    let hashes = [];
    let files = await fs.readdir(`./lib/modules/manager/${manager}`);

    if (files.includes("__snapshots__")) {
      const snapshots = await fs.readdir(
        `./lib/modules/manager/${manager}/__snapshots__`
      );

      for (const snap of snapshots) {
        const hash = getFileHash(manager, `__snapshots__/${snap}`);
        hashes.push(hash);
      }
    }

    files = files.filter((fileName) => minimatch(fileName, "*.spec.ts"));
    for (const file of files) {
      const hash = getFileHash(manager, file);
      hashes.push(hash);
    }

    hashes = (await Promise.all(hashes))
      .map((hash) => (hash ? hash : ""))
      .filter(Boolean);

    if (hashes.length) {
      return hasha(hashes, options);
    } else {
      throw new Error(`Couldn't generate hash for ${manager}`);
    }
  } catch (err) {
    console.log("ERROR:", err.message);
    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const hashMap = "export const hashMap = new Map();";
    let hashes = [];
    //get manager-list
    const managerList = (
      await fs.readdir("./lib/modules/manager", { withFileTypes: true })
    )
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    //store hashes in hashMap {key->manager, value->hash}
    for (const manager of managerList) {
      const hash = getHash(manager);
      hashes.push(hash);
    }
    hashes = (await Promise.all(hashes)).map(
      (hash, index) => `hashMap.set('${managerList[index]}', '${hash}');`
    );

    //write hashMap in dist/
    await fs.writeFile(
      "./dist/modules/manager/fingerprint.js",
      [hashMap, hashes.join("\n")].join("\n\n")
    );
  } catch (err) {
    console.log("ERROR:", err.message);
    process.exit(1); //unsure about exiting
  }
})();
