// scripts/runAll.js
const fs = require("fs");
const path = require("path");

const runAllScripts = async () => {
  const scriptsDir = __dirname;

  const files = fs
    .readdirSync(scriptsDir)
    .filter(file => file.endsWith(".js") && file !== "runAll.js");

  for (const file of files) {
    const fullPath = path.join(scriptsDir, file);
    console.log(`\n🔹 Running ${file}...`);

    try {
      await require(fullPath); // assuming each script is self-invoking
    } catch (err) {
      console.error(`❌ Failed to run ${file}:`, err);
    }
  }
};

runAllScripts();
