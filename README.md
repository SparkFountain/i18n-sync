# i18n-sync
This tiny tool synchronizes JSON properties for [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization).

If you have an i18n library that uses JSON files for different languages, you can simply synchronize their 
properties.

## Use Cases
If you have ever worked with internationalization (in short: _i18n_), you will have discovered a common problem: Inconsistency between different languages. Usually, you start developing your application in a default language (e. g. English) and at some point of time in the future, you take the English translation file, duplicate it and rename all properties' values by the correct strings of the new target language.

However, if your app is continuously developed, new language-specific strings will be introduced and some may be deleted. And now you are in trouble: If you don't want to maintain each and every i18n property for all languages at all times, sooner or later you'll have missing strings in some languages. To avoid this problem, many i18n libraries automatically replace missing strings by those defined in a default language (e. g. English).

Using fallback strings is technically a simple solution, but it causes confusion for users if some parts of the app are written in one language and other parts in another language. **To avoid this undesirable effect, i18n-sync helps you to easily organize your language strings at any point of time.**

## Features
- merge translation strings from different language files
- several merge strategies (combine, reduce, language-specific)
- write a custom string placeholder to inexistent properties
- automatically translate strings using [LibreTranslate](https://libretranslate.com/)

## Usage
Execute the following command to sync all JSON properties of different language files:

```
node i18n-sync.js <i18n-directory>
```

Replace `<i18n-directory>` with the directory name where your language definitions are saved.

You can configure the way _i18n-sync_ works using command line parameters. For instance, if you want to merge your language files using the _reduce_ strategy, execute the following:

```
node i18n-sync.js -r
```

A list of all available configuration options can be found in the following section.

### Configuration Options
| Option                   | Command Line Parameter | Explanation  |
| ------------------------ | ---------------------- | ------------ |
| Combine Strategy         | -c                     | Use all properties of all languages.             |
| Reduce Strategy          | -r                     | Use only properties that exist in all languages. |
| Fit To Language Strategy | -f <language-file>     | Use all properties of a specific language. Omit all properties of other languages that do not occur in the provided language. |
| Todo Placeholder         | -t                     | Write a "To Do" placeholder string into empty properties. |
| Property Placeholder     | -p                     | Write a placeholder string into empty properties that uses the name of the current property. |
| Individual Placeholder   | -i <placeholder>       | Write the provided placeholder string into empty properties. |
| Automatic Translation    | -a                     | Automatically translates empty property values. Uses the reference string of the first language where the property is provided. |
| Output Directory Name    | -o <output-dir-name>   | Define a custom output directory name.

## License
This tool uses the [MIT license](https://opensource.org/licenses/MIT). You can freely use and modify this software. Further information can be found in the `LICENSE` file.
