import hasha from "hasha";
export default async function getHash(managerName) {
  const options = {
    algorithm: "md5",
  };
  const hash = await hasha.fromFile(`./lib/manager/${managerName}/extract.js`, options);
  return hash;
}
