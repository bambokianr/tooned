require('dotenv').config();
const AWS = require('aws-sdk');

async function saveData(fileName, fileContent) {
  try {
    const S3 = new AWS.S3({ region: process.env.AWS_REGION });

    const params = {
      Bucket: `${process.env.AWS_S3_BUCKET}/releases`,
      Key: `${fileName}.json`,
      Body: JSON.stringify(fileContent),
    };

    const data = await S3.upload(params).promise();

    console.log(`'${fileName}.json' created remotely!`);
    console.log(`URL: ${data.Location}`);

    return data.Location;
  } catch (err) {
    console.error("[ERROR] S3Storage/saveData", err);
  };
};

async function readData(fileName) {
  try {
    const filePath = fileName === "genres" ? "" : "/releases";

    const S3 = new AWS.S3();
    const params = {
      Bucket: `${process.env.AWS_S3_BUCKET}${filePath}`,
      Key: `${fileName}.json`,
    };

    const data = await S3.getObject(params).promise();
    const fileContent = data.Body.toString("utf-8");

    return JSON.parse(fileContent);
  } catch (err) {
    console.error("[ERROR] S3Storage/readData", err);
  };
};


module.exports = { saveData, readData };