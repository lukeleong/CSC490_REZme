const fs = require("fs");
const path = require("path");

const runAllScripts = async () => {
  const scriptsDir = __dirname;

  const excludedFiles = ["testProgressUpdate.js"];

  const files = fs
    .readdirSync(scriptsDir)
    .filter(
      file =>
        file.endsWith(".js") &&
        file !== "runAll.js" &&
        !excludedFiles.includes(file)
    );

  for (const file of files) {
    const fullPath = path.join(scriptsDir, file);
    console.log(`\nRunning ${file}...`);

    try {
      await require(fullPath);
    } catch (err) {
      console.error(`Failed to run ${file}:`, err);
    }
  }
};

runAllScripts();
