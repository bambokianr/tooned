const fs = require('fs');
const path = require('path');

function saveData(fileName, fileContent) {
  const filePath = path.join(__dirname, "/data", `/${fileName}.json`);

  fs.writeFile(filePath, JSON.stringify(fileContent), "utf8", (error, _) => {
    if (error) {
      console.error("[ERROR] localStorage/saveData", error);
    } else {
      console.log(`'${fileName}.json' created locally!`);
    };
  });
};

function readData(fileName) {
  try {
    const filePath = path.join(__dirname, "/data", `/${fileName}.json`);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("[ERROR] localStorage/readData", err);
  };
};


module.exports = { saveData, readData };