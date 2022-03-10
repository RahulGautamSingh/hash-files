import hasha from "hasha";

const options = {
  algorithm: "md5",
};

export async function getHash(manager, files, snapshots) {
  let hashes = [];
  for (const file of files) {
    const hash = getFileHash(manager, file, "test");
    hashes.push(hash);
  }
  if (snapshots) {
    for (const snap of snapshots) {
      const hash = getFileHash(manager, snap, "snap");
      hashes.push(hash);
    }
  }
  hashes = await Promise.all(hashes);
  return hasha(hashes, options);
}

async function getFileHash(managerName, fileName, fileType) {
  try {
    let hash;
    if (fileType === "test")
      hash = await hasha.fromFile(
        `./lib/modules/manager/${managerName}/${fileName}.spec.js`,
        options
      );
    else
      hash = hash = await hasha.fromFile(
        `./lib/modules/manager/${managerName}/__snapshots__/${fileName}.spec.js.snap`,
        options
      );
    return hash;
  } catch (err) {
    return undefined;
  }
}
