// import libraries
import { readdir, readFile } from "fs";

function readFiles(dirPath, onFileContent, onError) {
  readdir(dirPath, (error, filenames) => {
    if (error) {
      onError(error);
      return;
    }

    filenames.forEach((filename) => {
      readFile(dirPath + filename, "utf-8", (error, content) => {
        if (error) {
          onError(error);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

function howToUse() {
  console.log("How to use i18n-sync");
}

// BEGIN I18N SYNCHRONIZATION
let params = process.argv;

// check if i18n directory is provided
if (params === undefined || params.length === 0) {
  howToUse();
  process.exit();
}

let dirPath = params[0];
let data = {};
readFiles(
  dirPath,
  (fileName, content) => {
    data[fileName] = content;
  },
  (error) => {
    throw error;
  }
);

// DEBUG: log all file contents
console.log("FILE CONTENTS", data);

// check if output directory already exists - if not, create it
if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}
