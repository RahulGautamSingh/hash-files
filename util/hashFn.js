import hasha from "hasha";

const options = {
  algorithm: "md5",
};

export async function getHash(manager, files, snapshots) {
  const hashes = [];
  for (const file of files) {
    const hash = await getFileHash(manager, file, "test");
    hashes.push(hash);
  }
  if (snapshots) {
    for (const snap of snapshots) {
      const hash = await getFileHash(manager, snap, "snap");
      hashes.push(hash);
    }
  }
  return hasha(hashes, options);
}

async function getFileHash(managerName, file, fileType) {
  try {
    let hash;
    if (fileType === "test")
      hash = await hasha.fromFile(
        `./lib/modules/manager/${managerName}/${file}.spec.js`,
        options
      );
    else
      hash = hash = await hasha.fromFile(
        `./lib/modules/manager/${managerName}/__snapshots__/${file}.spec.js.snap`,
        options
      );
    return hash;
  } catch (err) {
    return undefined;
  }
}
