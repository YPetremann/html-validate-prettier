# html-validate-prettier

Runs [Prettier](https://github.com/prettier/prettier) as a [Html-Validate](https://html-validate.org/) rule and reports differences as individual Html-Validate issues.

## Sample

Given the input file `index.html`:

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Document</title>
</head>
<body>
</body>
</html>
```

Running `npx html-validate style.css` shall output:

```
index.html
  3:1  error  Insert "··"                                                                                                                                                        prettier/prettier
  4:1  error  Replace "<meta·charset="UTF-8"" with "····<meta·charset="UTF-8"·"                                                                                                  prettier/prettier
  5:1  error  Replace "<meta·http-equiv="X-UA-Compatible"·content="IE=edge"" with "····<meta·http-equiv="X-UA-Compatible"·content="IE=edge"·"                                    prettier/prettier
  6:1  error  Replace "<meta·name="viewport"·content="width=device-width,·initial-scale=1.0"" with "····<meta·name="viewport"·content="width=device-width,·initial-scale=1.0"·"  prettier/prettier
  7:1  error  Insert "····"                                                                                                                                                      prettier/prettier
  8:1  error  Insert "··"                                                                                                                                                        prettier/prettier
  9:1  error  Replace "<body>⏎" with "··<body>"                                                                                                                                  prettier/prettier

✖ 7 problems (7 errors, 0 warnings)
```

## Installation

```sh
npm install --save-dev html-validate-prettier prettier
```

**_`html-validate-prettier` does not install Prettier or Html-Validate for you._** _You must install these yourself._

Then, in your `.htmlvalidate.json`:

```json
{
  "plugins": [
    "html-validate-prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
  }
}
```

## Recommended Configuration

This plugin works best if you disable all other Html-Validate rules relating to code formatting.
(If another active Html-Validate rule disagrees with `prettier` about how code should be formatted, it will be impossible to avoid lint errors.).

You can set Prettier's own options inside a `.prettierrc` file.

## Options

There is no additionnal options as _html-validate-prettier will honor your `.prettierrc` file by default_.

---

## Contributing

See [CONTRIBUTING.md](https://github.com/ypetremann/html-validate-prettier/blob/master/.github/CONTRIBUTING.md)

## Inspiration

The layout for this codebase and base configuration of prettier was taken from <https://github.com/prettier/eslint-plugin-prettier> and <https://github.com/prettier/stylelint-prettier>.
It was made in the idea to have prettier validation in html-validate in addition to eslint and stylelint
