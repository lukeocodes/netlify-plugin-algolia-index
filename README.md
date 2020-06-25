![](https://img.shields.io/badge/main-not%20master-green)
![](https://img.shields.io/badge/made%20with-%E2%9D%A4-red)
![](https://img.shields.io/npm/v/netlify-plugin-algolia-index)
![](https://img.shields.io/github/contributors/lukeocodes/netlify-plugin-algolia-index)
![](https://img.shields.io/github/issues/lukeocodes/netlify-plugin-algolia-index)

# Netlify Algolia Index Plugin [No Longer Maintained]

Netlify plugin to build a Algolia search index file to import manually. This package is no longer maintained, instead replaced by [netlify-plugin-algolia-export](https://github.com/lukeocodes/netlify-plugin-algolia-export) which exports directly to Algolia.

## Demo

- Demo site: https://netlify-plugins-by-lukeocodes.netlify.app

## Usage

To install, add the plugin in your `netlify.toml` or use the Netlify plugin directory. No config is required but we show the default options below.

```toml
[[plugins]]
  package = "netlify-plugin-algolia-index"
```

***Add algolia config to your deploy environment variables.***

![Add algolia config to your deploy environment variables](https://user-images.githubusercontent.com/956290/85300382-63c66400-b49e-11ea-82a9-045ac58f26e5.png)

Set `ALGOLIA_APPLICATION_ID`, `AlGOLIA_ADMIN_KEY`, and `ALGOLIA_INDEX` using environment variables: https://docs.netlify.com/configure-builds/environment-variables

These values can be found on the Your API Keys page on your Algolia Dashboard.

![Algolia Dashboard showing Your API Keys](https://user-images.githubusercontent.com/956290/85300545-983a2000-b49e-11ea-9170-8818a66d7d9b.png)

## Options

The available options.

| plugins.inputs  | type  | required  | default  | description  |
|---|---|---|---|---|
| exclude | Array | false | `[]` | An array of paths to exclude from the build. e.g. `['/admin', '/404.html']` |
| indexName | String | false | `searchIndex.json` | The name of the file to be saved to. You'll need to configure your metadata to point to this file. |
| textLength | Number | false | `7000` | The length the body of the page content will be truncated to. This is due to indexing limitations on community versions of Algolia, which we assume is the default. |
| stopwords | Array | false | `[]` | Additional stopwords. @see [stopword](https://github.com/fergiemcdowall/stopword) |

## Examples

### Exclude files

Your project probably contains some content files that you don't want your users to search. Pass an array of paths (or regex) to the files you don’t want to be indexed.

```toml
[[plugins]]
  package = "netlify-plugin-algolia-index"
    [plugins.inputs]
      exclude = ['''^\/admin.*''', '''^\/search.*''', '/404.html']
```

### Exclude Everything BUT Blog Posts

Advanced Regex Alert! This will exclude all files that DON'T match the regex for URLs like `/blog/(year)/(month)/(day)/(slug)/index.html`.

```toml
[[plugins]]
  package = "netlify-plugin-algolia-index"
    [plugins.inputs]
      exclude = ['''^\/(?!blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/(?!index.html)).*''']
```

## Credit

Based on the [Netlify Search Index Plugin](https://github.com/sw-yx/netlify-plugin-search-index) by [swyx](https://github.com/sw-yx) for fetching and parsing the content into something we can index.
