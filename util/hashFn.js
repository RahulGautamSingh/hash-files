import hasha from "hasha";

const options = {
  algorithm: "md5",
};

// obj = {
//   managerName:[file1, file2],
//   managerName:[file1, file3]
// }

export default async function getHash(obj) {
  const hashes = [];
  const managerList = Object.keys(obj);
  for (const manager of managerList) {
    const fileList = obj[manager];
    for (const file of fileList) {
      const hash = await getFileHash(manager, file);
      hashes.push(hash);
    }
  }
  return hasha(hashes, options);
}

async function getFileHash(managerName, fileName) {
  try {
    const hash = await hasha.fromFile(
      `./lib/manager/${managerName}/${fileName}.js`,
      options
    );
    return hash;
  } catch (err) {
    return undefined;
  }
}
