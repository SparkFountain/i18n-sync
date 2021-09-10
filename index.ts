#!/usr/bin/env node

// import libraries
import * as http from 'http';

const fs = require('fs');
const https = require('https');

// define command line colors
const color = {
  fg: {
    default: '\x1b[0m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    gray: '\x1b[100m',
    brightRed: '\x1b[101m',
    brightGreen: '\x1b[102m',
    brightYellow: '\x1b[103m',
    brightBlue: '\x1b[104m',
    brightMagenta: '\x1b[105m',
    brightCyan: '\x1b[106m',
    brightWhite: '\x1b[107m',
  },
};

// define bold and default command line styles
const fontStyle = {
  default: '\u{1b}[0m',
  bold: '\u{1b}[1m',
};

// combine strategy
function combineStrategy() {}

// reduce strategy
function reduceStrategy() {}

// fit to language strategy
function fitToLanguageStrategy() {}

async function translateAutomatically(
  translateString: string,
  sourceLanguage: string,
  targetLanguage: string,
) {
  const data = JSON.stringify({
    q: translateString,
    source: sourceLanguage,
    target: targetLanguage,
  });

  const options = {
    hostname: 'translate.argosopentech.com',
    port: 443,
    path: '/translate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const request = https.request(options, (response: http.ServerResponse) => {
    console.log(`statusCode: ${response.statusCode}`);

    response.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  request.on('error', (error: http.RequestListener) => {
    console.error(error);
  });

  request.write(data);
  request.end();
}

function howToUse() {
  console.log(`${color.fg.magenta}
  |   |                     |                                 _) _ |   _ )                                          
  |   |   _ \\ \\ \\  \\   /    __|   _ \\     |   |   __|   _ \\    |   |   _ \\   __ \\           __|  |   |  __ \\    __| 
  ___ |  (   | \\ \\  \\ /     |    (   |    |   | \\__ \\   __/    |   |  (   |  |   | _____| \\__ \\  |   |  |   |  (    
 _|  _| \\___/   \\_/\\_/     \\__| \\___/    \\__,_| ____/ \\___|   _|  _| \\___/  _|  _|        ____/ \\__, | _|  _| \\___| 
                                                                                                ____/               `);
  console.log(`${color.fg.white}`);

  console.log(`${fontStyle.bold}\n☛  Usage${fontStyle.default}\n`);
  console.log(
    `Execute the following command to sync all JSON properties of different language files:\n`,
  );
  console.log(
    `  ${color.fg.green}> ${color.fg.default}${color.fg.yellow}node i18n-sync.js <i18n-directory> [parameters]${color.fg.default}\n`,
  );
  console.log(
    `Replace ${color.fg.yellow}<i18n-directory>${color.fg.default} with the directory name where your language definitions are saved.\n`,
  );
  console.log(
    `You can configure the way ${color.fg.magenta}i18n-sync${color.fg.default} works using (optional) command line parameters.\n\n`,
  );

  console.log(
    `${fontStyle.bold}☛  Command line parameters\n${fontStyle.default}`,
  );
  console.log(
    `${color.fg.yellow}  -c${color.fg.default}                   ➤  Use all properties of all languages.`,
  );
  console.log(
    `${color.fg.yellow}  -r${color.fg.default}                   ➤  Use only properties that exist in all languages.`,
  );
  console.log(
    `${color.fg.yellow}  -f <language-file>${color.fg.default}   ➤  Use all properties of a specific language and omit all other language' properties.`,
  );
  console.log(
    `${color.fg.yellow}  -t${color.fg.default}                   ➤  Write a "To Do" placeholder string into empty properties.`,
  );
  console.log(
    `${color.fg.yellow}  -p${color.fg.default}                   ➤  Write a placeholder string into empty properties that uses the name of the current property.`,
  );
  console.log(
    `${color.fg.yellow}  -i <placeholder>${color.fg.default}     ➤  Write the provided placeholder string into empty properties.`,
  );
  console.log(
    `${color.fg.yellow}  -a${color.fg.default}                   ➤  Automatically translates empty property values using LibreTranslate.`,
  );
  console.log(
    `${color.fg.yellow}  -o <output-dir-name>${color.fg.default} ➤  Define a custom output directory name.\n`,
  );

  console.log(
    `\x1b[4mYou can only provide one parameter of each set:${color.fg.default}\n`,
  );
  console.log(
    `${color.fg.green}STRATEGY:${color.fg.default}     EITHER  ${color.fg.yellow}-c${color.fg.default}  OR  ${color.fg.yellow}-r${color.fg.default}  OR  ${color.fg.yellow}-f <language-file>${color.fg.default}`,
  );
  console.log(
    `${color.fg.green}PLACEHOLDER:${color.fg.default}  EITHER  ${color.fg.yellow}-t${color.fg.default}  OR  ${color.fg.yellow}-p${color.fg.default}  OR  ${color.fg.yellow}-i <placeholder>${color.fg.default}\n`,
  );
}

function exitWithError(message: string) {
  console.error(`\n${color.fg.red}${message}${color.fg.default}`);
  seeHelp();
  process.exit();
}

function seeHelp() {
  console.error(
    `\n${color.fg.magenta}For help, execute:\n${color.fg.green}> ${color.fg.yellow}node i18n-sync.js -h${color.fg.default}`,
  );
}

// PERFORM I18N SYNCHRONIZATION
function i18nSync() {
  let params = process.argv; // 1st param: 'node'; 2nd param: 'i18n-sync.js'

  // check if i18n directory is provided
  if (params === undefined || params.length < 3) {
    howToUse();
    process.exit();
  }

  // get directory path
  let dirPath = params[2];

  // get command line parameters
  let strategy = 'combine';
  let parsedStrategy = false;

  let placeholder = 'todo';
  let parsedPlaceholder = false;

  let autoTranslate = false;

  let outputDirName = 'output';

  if (params.length > 3) {
    let cmdLineParseState = 'parameterName';
    for (let i = 3; i < params.length; i++) {
      if (cmdLineParseState === 'parameterName') {
        // get parameter
        switch (params[i]) {
          case '-h':
            howToUse();
            process.exit();
          case '-c':
            if (parsedStrategy) {
              exitWithError('You cannot define more than one strategy.');
            }
            strategy = 'combine';
            parsedStrategy = true;
            break;
          case '-r':
            if (parsedStrategy) {
              exitWithError('You cannot define more than one strategy.');
            }
            strategy = 'reduce';
            parsedStrategy = true;
            break;
          case '-f':
            if (parsedStrategy) {
              exitWithError('You cannot define more than one strategy.');
            }
            cmdLineParseState = 'fitToLanguage';
            parsedStrategy = true;
            break;
          case '-t':
            if (parsedPlaceholder) {
              exitWithError('You cannot define more than one placeholder.');
            }
            placeholder = 'todo';
            break;
          case '-p':
            if (parsedPlaceholder) {
              exitWithError('You cannot define more than one placeholder.');
            }
            placeholder = 'property';
            break;
          case '-i':
            if (parsedPlaceholder) {
              exitWithError('You cannot define more than one placeholder.');
            }
            cmdLineParseState = 'individualPlaceholder';
            break;
          case '-a':
            autoTranslate = true;
            break;
          case '-o':
            cmdLineParseState = 'outputDirectoryName';
            break;
          default:
            console.error(`Invalid parameter "${params[i]}"`);
            process.exit();
        }
      } else if (cmdLineParseState === 'fitToLanguage') {
        // parse language file name
        strategy = params[i];
        cmdLineParseState = 'parameterName';
      } else if (cmdLineParseState === 'individualPlaceholder') {
        // parse individual placeholder string
        placeholder = params[i];
        cmdLineParseState = 'parameterName';
      } else if (cmdLineParseState === 'outputDirectoryName') {
        // parse output directory name
        outputDirName = params[i];
        cmdLineParseState = 'parameterName';
      }
    }

    if (cmdLineParseState !== 'parameterName') {
      exitWithError(`Missing argument for parameter '${cmdLineParseState}'`);
    }
  }

  // TODO: remove debug logs
  console.log('[STRATEGY]', strategy);
  console.log('[PLACEHOLDER]', placeholder);
  console.log('[AUTO TRANSLATE]', autoTranslate);
  console.log('[OUTPUT DIR NAME]', outputDirName);
  console.log();

  let data: any = {};

  // get all JSON files from i18n directory
  const fileNames = fs.readdirSync(`./${dirPath}`);

  fileNames.forEach((fileName: string) => {
    let properties = fs.readFileSync(`${dirPath}/${fileName}`, 'utf-8');

    // format empty files to fit JSON standard
    if (properties.trim() === '') {
      properties = '{}';
    }

    // add properties to data object
    data[fileName] = JSON.parse(properties);
  });

  console.log('[ALL PROPERTIES]', data);

  if (fs.existsSync(`./${outputDirName}`)) {
    // output directory already exists, so delete it
    fs.rmSync(`./${outputDirName}`, { recursive: true });
  }

  // create output directory
  fs.mkdirSync(`./${outputDirName}`);

  // translate automatically
  // TODO: only trigger if command line parameter is set
  // translateAutomatically(
  //   "The quick brown fox jumps over the lazy cat",
  //   "en",
  //   "de"
  // );
}

// export i18nSync function
module.exports = { i18nSync };
