// import libraries
const fs = require("fs");
const https = require("https");

function readFiles(dirPath, onFileContent, onError) {
  fs.readdir(dirPath, (error, filenames) => {
    if (error) {
      onError(error);
      return;
    }

    filenames.forEach((fileName) => {
      fs.readFile(`${dirPath}/${fileName}`, "utf-8", (error, content) => {
        if (error) {
          onError(error);
          return;
        }
        onFileContent(fileName, content);
      });
    });
  });
}

async function translateAutomatically(
  translateString,
  sourceLanguage,
  targetLanguage
) {
  const data = JSON.stringify({
    q: translateString,
    source: sourceLanguage,
    target: targetLanguage
  });

  const options = {
    hostname: "translate.argosopentech.com",
    port: 443,
    path: "/translate",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

function howToUse() {
  console.log("\x1b[35m\x1b[47m");
  console.log(`
  |   |                     |                                 _) _ |   _ )                                          
  |   |   _ \\ \\ \\  \\   /    __|   _ \\     |   |   __|   _ \\    |   |   _ \\   __ \\           __|  |   |  __ \\    __| 
  ___ |  (   | \\ \\  \\ /     |    (   |    |   | \\__ \\   __/    |   |  (   |  |   | _____| \\__ \\  |   |  |   |  (    
 _|  _| \\___/   \\_/\\_/     \\__| \\___/    \\__,_| ____/ \\___|   _|  _| \\___/  _|  _|        ____/ \\__, | _|  _| \\___| 
                                                                                                ____/               `);
  console.log("\x1b[0m");

  console.log("\033[1m\n☛ Usage\033[0m\n");
  console.log(
    "Execute the following command to sync all JSON properties of different language files:\n"
  );
  console.log(
    "  \x1b[32m> \x1b[0m\x1b[33mnode i18n-sync.js <i18n-directory> [parameters]\x1b[0m\n"
  );
  console.log(
    "Replace \x1b[33m<i18n-directory>\x1b[0m with the directory name where your language definitions are saved.\n"
  );
  console.log(
    "You can configure the way \x1b[35mi18n-sync\x1b[0m works using (optional) command line parameters.\n\n"
  );

  console.log("\033[1m☛ Command line parameters\n\033[0m");
  console.log(
    "\x1b[33m  -c\x1b[0m                   ➤ Use all properties of all languages."
  );
  console.log(
    "\x1b[33m  -r\x1b[0m                   ➤ Use only properties that exist in all languages."
  );
  console.log(
    "\x1b[33m  -f <language-file>\x1b[0m   ➤ Use all properties of a specific language and omit all other languages' properties."
  );
  console.log(
    '\x1b[33m  -t\x1b[0m                   ➤ Write a "To Do" placeholder string into empty properties.'
  );
  console.log(
    "\x1b[33m  -p\x1b[0m                   ➤ Write a placeholder string into empty properties that uses the name of the current property."
  );
  console.log(
    "\x1b[33m  -i <placeholder>\x1b[0m     ➤ Write the provided placeholder string into empty properties."
  );
  console.log(
    "\x1b[33m  -a\x1b[0m                   ➤ Automatically translates empty property values using LibreTranslate."
  );
  console.log(
    "\x1b[33m  -o <output-dir-name>\x1b[0m ➤ Define a custom output directory name.\n"
  );

  console.log(
    "\x1b[4mYou can only provide one parameter of each set:\x1b[0m\n"
  );
  console.log(
    "\x1b[32mSTRATEGY:\x1b[0m     EITHER  \x1b[33m-c\x1b[0m  OR  \x1b[33m-r\x1b[0m  OR  \x1b[33m-f <language-file>\x1b[0m"
  );
  console.log(
    "\x1b[32mPLACEHOLDER:\x1b[0m  EITHER  \x1b[33m-t\x1b[0m  OR  \x1b[33m-p\x1b[0m  OR  \x1b[33m-i <placeholder>\x1b[0m\n"
  );
}

// BEGIN I18N SYNCHRONIZATION
let params = process.argv; // 1st param: "node"; 2nd param: "i18n-sync.js"

// check if i18n directory is provided
if (params === undefined || params.length < 3) {
  howToUse();
  process.exit();
}

let dirPath = params[2];
let data = {};
readFiles(
  `./${dirPath}`,
  (fileName, content) => {
    console.log("CONTENT:", content);
    data[fileName] = content;
  },
  (error) => {
    throw error;
  }
);

// DEBUG: log all file contents
// console.log("FILE CONTENTS", data);

// check if output directory already exists
if (!fs.existsSync("./output")) {
  // output directory does not exist, so create it
  fs.mkdirSync("./output");
} else {
  // check for old files and remove them
  readFiles(
    "./output",
    (fileName, content) => {
      fs.rmSync("./output/fileName", { force: true });
    },
    (error) => {
      throw error;
    }
  );
}

// translate automatically
// TODO: only trigger if command line parameter is set
// translateAutomatically(
//   "The quick brown fox jumps over the lazy cat",
//   "en",
//   "de"
// );
