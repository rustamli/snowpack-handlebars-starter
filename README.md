# snowpack-handlebars-starter
Snowpack starter with Handlebars templating and Tailwind CSS built-in. Great for simple static websites

## Highlights

- If you want a framework-less static site generation
- If you want to quickly turn data into webpages without complicated logic
- A simple way to start with Tailwind CSS
- [HTML over wire](https://hotwire.dev/) approach for page navigation (to be improved in upcoming versions)

## Features

- **Snowpack** for super fast builds and super fast :fire: Hot Module Replacement
- **Handlebars** plugin. With automatic registration of templates and partials
- Comes with **PostCSS** included
- **Tailwind CSS** built in with [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography) included
- **YAML headers** supported in Handlebars
- **[Handlebars helpers](https://github.com/helpers/handlebars-helpers)** integrated. Custom helpers are also supported
- **[Turbolinks](https://github.com/turbolinks/turbolinks)** enabled in the sample template (updates pages without reloading)
- **CSV** and **JSON** formats supported as inputs for your templates
- **Data transform scripts** let you shape your data input with custom logic

## Guides

### Install

```
yarn
```

### Start dev server

```
yarn start
```

### Build for production

```
yarn build
```

_Your output will be inside /build folder_

## About this project

This project is experimental at this stage. It is mainly used by me for building the next version of [candygen](https://github.com/rustamli/candygen) - static site generator I've built in the past.
Please reach out [on twitter](https://twitter.com/nehfy) if you have questions or issues using it, I am interested in any feedback you might have

## License

This project is licensed under the MIT License
