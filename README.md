# Netlify Algolia Index Plugin

Export your search index straight to Algolia!

## Demo

- Demo site: https://netlify-plugin-algolia-index.netlify.app

## Usage

To install, add the plugin in your `netlify.toml`. No config is required but we show the default options here.

```toml
[[plugins]]
  package = "netlify-plugin-algolia-index"
    # all inputs is optional, we just show you the defaults below
    # [plugins.inputs]
      # exclude = [] # don't index this file
```

***Add algolia config to your deploy environment variables.***

![Add algolia config to your deploy environment variables](https://user-images.githubusercontent.com/956290/85300382-63c66400-b49e-11ea-82a9-045ac58f26e5.png)

Set `ALGOLIA_APPLICATION_ID`, `AlGOLIA_ADMIN_KEY`, and `ALGOLIA_INDEX` using environment variables: https://docs.netlify.com/configure-builds/environment-variables

These values can be found on the Your API Keys page on your Algolia Dashboard.

![Algolia Dashboard showing Your API Keys](https://user-images.githubusercontent.com/956290/85300545-983a2000-b49e-11ea-9170-8818a66d7d9b.png)

## More options

### Exclude files

Your project probably contains some content files that you don't want your users to search. Pass an array of paths (or regex) to the files you don’t want to be indexed to dismiss them:

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