(async () => {
  const fs = require("fs");
  const path = require("path");

  if (
    !fs.existsSync(path.join(__dirname, "Configuration.txt")) ||
    !fs.lstatSync(path.join(__dirname, "Configuration.txt")).isFile()
  )
    return console.log(`[⛔] File Configuration.txt does not exist.`);

  let config;
  try {
    config = JSON.parse(
      fs
        .readFileSync(path.join(__dirname, "Configuration.txt"))
        .toString()
        .replace(/\\/g, "/")
    );
  } catch (_) {
    console.log(
      "[⛔] Structure for file Configuration.txt has been edited and cannot be parsed."
    );
  }
  if (!config) return;

  const { DirectoryPath, Mode, OverWriteExisting } = config;

  if (!DirectoryPath)
    return console.log("[⚠️] DirectoryPath has not been provided.");
  if (!Mode) return console.log("[⚠️] Mode has not been provided.");

  if (!["Packing", "Unpacking"].includes(Mode))
    return console.log(
      `[⚠️] "Mode" can only be set to "Packing" or "Unpacking"`
    );

  const startingTime = new Date();

  console.log(`[▶️] Starting ${Mode}..`);

  if (Mode === "Packing") {
    if (!fs.existsSync(path.join(DirectoryPath)))
      return console.log(
        `[⚠️] Could not find directory with path: ${path.join(DirectoryPath)}`
      );
    if (!fs.lstatSync(path.join(DirectoryPath)).isDirectory())
      return console.log(
        `[⚠️] Item at path "${path.join(DirectoryPath)}" is not a directory.`
      );

    const dirTree = [[], []];
    await pack(path.join(DirectoryPath));
    async function pack(itemPath) {
      return new Promise(async (resolve) => {
        const pathStats = fs.lstatSync(itemPath);
        if (pathStats.isDirectory()) {
          const baseName = itemPath.replace(path.join(DirectoryPath), "");
          if (baseName !== "") {
            dirTree[0].push(baseName);
          }
          for (const item of fs.readdirSync(itemPath))
            await pack(path.join(`${itemPath}/${item}`));
        }
        if (pathStats.isFile()) {
          const relativePath = itemPath.replace(path.join(DirectoryPath), "");
          const fileContents = fs.readFileSync(itemPath);
          dirTree[1].push(
            JSON.parse(
              `{ ${JSON.stringify(relativePath)}: "${encodeURIComponent(
                fileContents
              )}" }`
            )
          );
        }
        resolve();
      });
    }
    fs.writeFileSync(
      path.join(__dirname, "Packet.json"),
      `${JSON.stringify(dirTree)}`
    );
    console.log(
      `[📦] Directory successfully packed to "Packet.json" located at path: ${path.join(
        __dirname,
        "Packet.json"
      )}`
    );
  }

  if (Mode === "Unpacking") {
    if (
      !fs.existsSync(path.join(__dirname, "Packet.json")) ||
      !fs.lstatSync(path.join(__dirname, "Packet.json")).isFile()
    )
      return console.log(
        `[🗃️❌] Packet does not exist!\nMake sure there is a Packet.json file at path: ${__dirname}`
      );

    let packet;
    try {
      packet = require(path.join(__dirname, "Packet.json"));
    } catch (_) {
      console.log(`[⛔] Packet is corrupted..`);
    }
    if (!packet) return;

    if (!fs.existsSync(path.join(DirectoryPath)))
      fs.mkdirSync(path.join(DirectoryPath));

    for (const directory of packet[0]) {
      const exists = fs.existsSync(path.join(`${DirectoryPath}/${directory}`));
      if (!OverWriteExisting && exists) {
        console.log(
          `[📁] Directory "..${directory}" already exists, skipping.`
        );
        continue;
      }
      if (exists) fs.rmdirSync(path.join(`${DirectoryPath}/${directory}`));
      fs.mkdirSync(path.join(`${DirectoryPath}/${directory}`));
    }
    console.log(
      `[🗂️] Successfully unpacked all directories!\n[🕒] Time Elapsed: ${
        (Date.now() - startingTime) / 1000
      }s`
    );

    for (const fileData of packet[1]) {
      const exists = fs.existsSync(
        path.join(`${DirectoryPath}/${Object.keys(fileData)}`)
      );
      if (!OverWriteExisting && exists) {
        console.log(
          `[📄] File "..${Object.keys(fileData)}" already exists, skipping.`
        );
      }
      if (exists)
        fs.unlinkSync(path.join(`${DirectoryPath}/${Object.keys(fileData)}`));
      fs.writeFileSync(
        path.join(`${DirectoryPath}/${Object.keys(fileData)}`),
        decodeURIComponent(Object.values(fileData))
      );
    }
    console.log(
      `[📝] Successfully unpacked all files!\n[🕒] Time Elapsed: ${
        (Date.now() - startingTime) / 1000
      }s`
    );
    console.log(
      `[📤] Successfully unpacked all contents to: ${path.join(
        `${DirectoryPath}`
      )}`
    );
  }

  console.log(
    `[⏱️] Total time elapsed: ${(Date.now() - startingTime) / 1000}s`
  );
})();
