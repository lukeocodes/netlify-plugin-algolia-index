# Netlify Algolia Index Plugin

> Based on the [Netlify Search Index Plugin](https://github.com/sw-yx/netlify-plugin-search-index) by [swyx](https://github.com/sw-yx), this simplifies and changes the format of the output for parsing by Algolia.

Generate a Search Index you can export to Algolia!

## Demo

- Demo site: https://netlify-plugin-algolia-index.netlify.app
- Demo JSON blob: https://netlify-plugin-algolia-index.netlify.app/searchIndex.json

## Usage

To install, add the plugin in your `netlify.toml`. No config is required but we show the default options here.

<details>
<summary><b>Generating the search index file.</b></summary>

```toml
[[plugins]]
  package = netlify-plugin-algolia-index
    # all inputs is optional, we just show you the defaults below
    # [plugins.inputs]
      # exclude = [] # don't index this file
      # publishDirJSONFileName = searchIndex
```
</details>

Default config will exclude nothing and generate a JSON file at `https://yoursite.netlify.com/searchIndex.json`

## More options

#### Exclude files

Your project probably contains some content files that you don't want your users to search. Pass an array of paths (or regex) to the files you don’t want to be indexed to dismiss them:

```yml
[[plugins]]
  package = netlify-plugin-algolia-index
    [plugins.inputs]
      exclude = ['/admin', '/404.html']
```