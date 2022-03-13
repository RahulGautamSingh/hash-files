import fs from "fs/promises";

import { getHash } from "./util/hashFn.js";

const hashMap = "const hashMap = new Map();";
let hashes = [];
let final = [];
(async () => {
  try {
    //get manager-list
    let managerList = (
      await fs.readdir("./lib/modules/manager", { withFileTypes: true })
    )
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    //store hashes in hashMap {key->manager, value->hash}
    for (const manager of managerList) {
      const hash = getHash(manager);
      hashes.push(hash);
    }
    hashes = await Promise.all(hashes);
    for (let i = 0; i < managerList.length; i++) {
      final.push(`hashMap.set('${managerList[i]}', '${hashes[i]}');`);
    }
    //write hashMap in dist/
    await fs.writeFile(
      "./dist/lib/modules/manager/fingerprint.js",
      [hashMap, final.join("\n"), `export default hashMap;\n`].join("\n\n")
    );
    console.log("hello");
  } catch (err) {
    console.log("ERROR:", err);
  }
})();
