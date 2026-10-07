# Open MMORPG documentation

The documentation for [Open MMORPG](https://github.com/open-mmorpg/OpenMMORPG), published at
**https://open-mmorpg.github.io/documentation/**.

The pages are plain Markdown in [`src/content/docs`](src/content/docs), so you can read them
right here on GitHub as well. The site is built with [Starlight](https://starlight.astro.build)
and deployed to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
on every push to `main`.

## Working on the docs

You need [Node.js](https://nodejs.org) 22 or newer.

```sh
npm install
npm run dev      # live preview at http://localhost:4321/documentation/
npm run build    # the full build, including the link check that CI runs
```

A pull request runs the same build, so a broken internal link fails the check before it can
be merged.

## Where things go

```
src/content/docs/
  index.md                    the landing page
  guide/                      one folder per sidebar section
    getting-started.md        one file per page
    images/
      getting-started/        each page's images, in a folder named after the page
```

The sidebar is generated from the folders. Order the pages in a section with
`sidebar.order` in each page's front matter.

## Writing guidelines

- **Every page is checked against the kit's code.** These docs cover the same ground as the
  original MMORPG Kit documentation, but they are written from scratch for Open MMORPG. Field
  names, menu paths and behaviour come from the Open MMORPG source and the demo, not from older
  docs. If the code and a page disagree, the page is wrong.
- **Write plain Markdown that also reads well on GitHub:**
  - Link to other pages with relative `.md` paths, for example `[Game Database](./game-database.md)`.
    The build rewrites them to site URLs.
  - Reference images with relative paths, for example `![...](./images/game-database/database-window.png)`.
  - Don't use Starlight-only syntax such as `:::note` asides or MDX components, which show up
    as raw text on GitHub. For a warning, use a blockquote that opens with a bold sentence.
- **Give every image alt text** that says what it shows.
- **Name things as the editor does.** Menu paths in bold with arrows
  (**Open MMORPG → Develop → Game Database**), and field names as the Inspector shows them
  (**Override Exe Path**).

## Screenshots

All screenshots come from Open MMORPG and its demo. None are taken from the original kit's
documentation, which is not licensed for reuse.

- **Editor screenshots** are PNG, captured from the Unity editor at 150% UI scale. Highlights
  are 3 px rounded rectangles in `#ff4d4f`.
- **Gameplay screenshots** are JPEG, captured at 1920×1080 and saved at 1280×720.

[`tools/screenshots`](tools/screenshots) has the scripts used to capture and annotate them.

## Licence

The documentation is released under the [MIT License](LICENSE), like Open MMORPG itself.
