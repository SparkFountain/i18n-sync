# i18n-sync
This tiny tool synchronizes JSON properties for [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization).

If you have an i18n library that uses JSON files for different languages, you can simply synchronize their 
properties.

## Use Cases
If you have ever worked with internationalization (in short: _i18n_), you will have discovered a common problem: Inconsistency between different languages. Usually, you start developing your application in a default language (e. g. English), and at some point of time in the future, you take the English translation file, duplicate it and rename all properties' values by the correct strings of the new target language.

However, if your app is continuously developed, new language-specific strings will be introduced and some may be deleted. And now you are in trouble: If you don't want to maintain each and every i18n property for all languages at all times, sooner or later you'll have missing strings in some languages. To avoid this problem, many i18n libraries automatically replace missing strings by those defined in a default language (e. g. English).

Using fallback strings is technically a simple solution, but it causes confusion for users if some parts of the app are written in one language and other parts in another language. **To avoid this undesirable effect, i18n-sync helps you to easily organize your language strings at any point of time.**

## Features
- merge translation strings from different language files
- several merge strategies (combine, reduce, add properties etc.)
- write a custom string to inexistent properties
- automatically translate strings using 

## Usage
Use the following command to sync all JSON properties of different language files:

```
node i18n-sync.js <i18n-directory>
```

Replace `<i18n-directory>` with the directory name where your language definitions are saved.