const fs = require('fs');

function saveData(fileName, fileContent) {
  fs.writeFile(`./src/data/${fileName}.json`, JSON.stringify(fileContent), "utf8", (error, _) => {
    if (err) {
      console.error("[ERROR] localStorage/saveData", err);
    } else {
      console.log(`'${fileName}.json' created locally!`);
    };
  });
};

function readData(fileName) {
  try {
    const fileContent = fs.readFileSync(`./src/data/${fileName}.json`, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("[ERROR] localStorage/readData", err);
  };
};


module.exports = { saveData, readData };