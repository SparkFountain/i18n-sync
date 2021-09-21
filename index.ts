#!/usr/bin/env node

// import libraries
import * as http from 'http';
import { LanguageProperties } from './src/interface/language-properties.interface';
import { Stack } from './src/interface/stack.interface';

const fs = require('fs');
const https = require('https');
const _ = require('lodash');

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

// store language properties in a data object
let data: LanguageProperties = {};

// store configuration parameters
let strategy = 'combine';
let parsedStrategy = false;

let placeholder = 'todo';
let parsedPlaceholder = false;

let autoTranslate = false;

let outputDirName = 'output';

function assignProperties(
  sourceObject: LanguageProperties,
  targetObject: LanguageProperties,
) {
  for (let property in targetObject) {
    if (sourceObject.hasOwnProperty(property)) {
      if (typeof sourceObject[property] === 'object') {
        // recursively assign object properties
        assignProperties(
          sourceObject[property] as LanguageProperties,
          targetObject[property] as LanguageProperties,
        );
      } else {
        // use source object value
        // console.log(`[${property}] ${sourceObject[property]}`);
      }
    } else {
      // fill placeholder value
      // console.log(`[FILL PLACEHOLDER FOR] ${property}`);
    }
  }

  // console.log('[ASSIGN PROPERTIES]', sourceObject, targetObject);
}

// combine strategy
function combineStrategy(): LanguageProperties {
  let combinedProperties: LanguageProperties = {};
  let finalProperties: LanguageProperties = {};

  // combine all languages' properties
  for (const [languageName, languageProperties] of Object.entries(data)) {
    // TODO: does not work for sub-levels
    combinedProperties = _.merge(combinedProperties, languageProperties);
  }

  console.log('[_ MERGE]', combinedProperties);

  // for each language, iterate over all combined properties
  for (let languageName in data) {
    console.log('[LANGUAGE NAME]', languageName);
  }

  console.log('[COMBINED PROPERTIES]', combinedProperties);
  return finalProperties;
}

// reduce strategy
function reduceStrategy() {
  let finalProperties: LanguageProperties = {};

  return finalProperties;
}

// fit to language strategy
function fitToLanguageStrategy(): LanguageProperties {
  // check if given language exists
  if (!data.hasOwnProperty(strategy)) {
    exitWithError(`The language file '${strategy}' does not exist`);
  }

  let originalProperties: LanguageProperties = data[
    strategy
  ] as LanguageProperties;
  let finalProperties: LanguageProperties = {};
  let innerStack: Stack = {
    properties: [],
    size: 0,
  };

  let languageKeys = Object.keys(data);
  languageKeys.forEach(
    (languageKey: string) =>
      (finalProperties[languageKey] = _.cloneDeepWith(
        originalProperties,
        (value: string, key: string | undefined, object: any, stack: any) => {
          if (stack !== undefined) {
            let stackData = stack['__data__'];
            if (Number(stackData.size) > innerStack.size) {
              innerStack.properties.push(key as string);
              innerStack.size++;
            } else if (Number(stackData.size) < innerStack.size) {
              innerStack.properties.pop();
              innerStack.size--;
            }

            if (!_.isObject(value)) {
              // use correct language string
              let currentObject: any = data[languageKey];
              innerStack.properties.forEach((property: string) => {
                console.log('[FOR EACH]', property);

                if (currentObject.hasOwnProperty(property)) {
                  currentObject = currentObject[property];
                } else {
                  // use placeholder
                  if (placeholder === 'todo') {
                    currentObject = 'todo';
                    return;
                  } else if (placeholder === 'property') {
                    currentObject = property;
                    return;
                  } else {
                    currentObject = translateAutomatically(
                      (data[languageKey] as LanguageProperties)[
                        innerStack.properties.join('.')
                      ] as string,
                      strategy,
                      languageKey,
                    );
                    return;
                  }
                }
              });

              console.log('[CURRENT PROPERTY]', currentObject);
              return currentObject;
            }
          }
        },
      )),
  );

  console.log('[FINAL PROPERTIES]', finalProperties);
  return finalProperties;
}

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
    `  ${color.fg.green}> ${color.fg.default}${color.fg.yellow}i18n-sync <i18n-directory> [parameters]${color.fg.default}\n`,
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

/**
 * PERFORM I18N SYNCHRONIZATION
 */
function i18nSync() {
  let params = process.argv;

  // remove first (unnecessary) parameters
  if (params[0].endsWith('node')) {
    params.shift(); // node call
    params.shift(); // path to node file
  } else if (params[0] === 'i18n-sync') {
    params.shift(); // i18n-sync call
  }

  // check if i18n directory is provided
  if (params === undefined || params.length === 0 || params[0] === '-h') {
    howToUse();
    process.exit();
  }

  // get directory path
  const dirPath = params.shift();

  // get command line parameters
  if (params.length > 0) {
    let cmdLineParseState = 'parameterName';
    for (let i = 0; i < params.length; i++) {
      if (cmdLineParseState === 'parameterName') {
        // get parameter
        switch (params[i]) {
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
  console.log('[OUTPUT DIR NAME]\n\n', outputDirName);

  // get all JSON files from i18n directory
  const fileNames = fs.readdirSync(`./${dirPath}`);

  // read all file contents
  fileNames.forEach((fileName: string) => {
    let properties: string = fs.readFileSync(`${dirPath}/${fileName}`, 'utf-8');

    // format empty files to fit JSON standard
    if (properties.trim() === '') {
      properties = '{}';
    }

    // add properties to data object
    data[fileName] = JSON.parse(properties);
  });

  // console.log('[ALL PROPERTIES]', data);

  // delete specified output directory in case it already exists
  if (fs.existsSync(`./${outputDirName}`)) {
    fs.rmSync(`./${outputDirName}`, { recursive: true });
  }

  // create output directory
  fs.mkdirSync(`./${outputDirName}`);

  // apply merge strategy
  let resultData: LanguageProperties;
  if (strategy === 'combine') {
    resultData = combineStrategy();
  } else if (strategy === 'reduce') {
    resultData = reduceStrategy();
  } else {
    resultData = fitToLanguageStrategy();
  }

  // translate automatically
  // TODO: only trigger if command line parameter is set
  // translateAutomatically(
  //   "The quick brown fox jumps over the lazy cat",
  //   "en",
  //   "de"
  // );
}

// Execute the synchronization function
i18nSync();
