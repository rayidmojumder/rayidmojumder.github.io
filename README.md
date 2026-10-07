# Academic Portfolio Website

A single-page portfolio built with plain HTML, CSS, and JavaScript. It includes a profile, recent news, research spotlights, and a searchable publication list. No framework, database, package installation, or build step is required.

## Features

- Profile photo, biography, affiliation, interests, and external links.
- News and activity updates.
- Research areas with independent figure slideshows, thumbnails, enlarged views, captions, and related publications.
- Publication search and filters for year and publication type.
- Paper, Abstract, BibTeX, and Citation controls for each publication.
- Citation copying, downloads, and export of the full or filtered publication list.
- Optional automatic Crossref citation counts with browser caching.
- Adjustable font size from 90% to 200%.
- Day, Night, and device-based themes, plus preset and custom backgrounds.
- Appearance preferences saved in each visitor's browser.
- Responsive layout, keyboard navigation, and reduced-motion support.
- Self-hosted Soria typography with fallback fonts.

## Preview locally

Extract the project and open `index.html` in a browser. To preview through a local web server, run this command from the project directory if Python is installed:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Live citation updates require internet access.

## Publish on GitHub Pages

Choose a repository name based on the address you want:

| Site type | Repository name | Website address |
| --- | --- | --- |
| Account site | `USERNAME.github.io` | `https://USERNAME.github.io/` |
| Project site | `REPOSITORY` | `https://USERNAME.github.io/REPOSITORY/` |

Replace `USERNAME` with your GitHub username and `REPOSITORY` with your repository name.

### Publish from a branch

1. Create or open a GitHub repository. With GitHub Free, use a public repository for GitHub Pages.
2. Upload `index.html`, `styles.css`, `app.js`, `content.js`, and the complete `assets` directory. Keep `index.html` at the repository root and include `.nojekyll`.
3. Commit the files to the `main` branch.
4. Open **Settings > Pages**. Under **Source**, select **Deploy from a branch**.
5. Select the `main` branch and **/ (root)**, then save.
6. When deployment finishes, use **Visit site** in the Pages settings.

The project uses relative asset paths, so it supports both account and project sites. For this method, omit the optional `.github/workflows/pages.yml` custom workflow.

### Publish with GitHub Actions

Alternatively, upload the included `.github/workflows/pages.yml` file with the project, select **GitHub Actions** as the source in **Settings > Pages**, and run the supplied deployment workflow from the **Actions** tab. Use one publishing method.

Official documentation:

- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Edit the content

Most updates belong in `content.js`. Edit it locally or with GitHub's file editor, preview the result, and commit the change.

| Content | Property in `content.js` |
| --- | --- |
| Name, biography, photo, affiliation, and links | `profile` |
| News and activities | `news` |
| Research descriptions, figures, and related papers | `research` |
| Publication records, abstracts, links, and BibTeX | `publications` |
| Footer update date | `updated` |
| Automatic citation refresh settings | `citationSettings` |

Keep the property names, quotation marks, brackets, and commas intact. Escape double quotation marks inside a quoted string as `\"`. Keep the `window.PORTFOLIO =` assignment and final semicolon.

### Profile and links

Update the fields in `profile` with your information. Place a photo in `assets`, set `profile.photo` to its relative path, and add meaningful alternative text in `profile.photoAlt`.

Add professional profiles, a CV, or other links to `profile.links`. Local paths and HTTP/HTTPS URLs are supported. For example, a CV can use `assets/cv.pdf`. The current link handler does not support `mailto:` links; use plain email text or an HTTPS contact page.

### News

Copy an existing object in the `news` array and change its date and text. Separate entries with commas. News appears in the order entered, so place the most recent items first.

### Research areas and figures

Each object in `research` defines an area. Give each area a unique `id`, a label, a title, a description, and a `slides` array.

Place figures in `assets` and add slide entries such as:

```javascript
{
  "src": "assets/research-figure.png",
  "alt": "A description of the figure's main content",
  "caption": "A short caption explaining the result.",
  "source": "https://doi.org/EXAMPLE-DOI"
}
```

Replace the example path and DOI with your own. The source link is optional. Include attribution where required.

Each research area has its own slideshow. Previous and Next wrap within that area, thumbnails select a figure, and the main image opens an enlarged view. Slides do not advance automatically.

Connect related publications by placing their exact publication `id` values in the area's `publicationIds` array.

### Publications

Copy an existing object in `publications` and update its fields. Use a unique `id`, a numeric `year`, and a supported `type`: `Journal`, `Conference`, or `Preprint`.

Supply the title, authors, venue, and available paper links, DOI, abstract, and BibTeX. Optional text fields can use empty strings when information is unavailable. Without an abstract, the Abstract control is disabled.

Publications sort by descending year. Entries within the same year follow their order in the array, and year filters update from the publication data. The visible menu contains Paper, Abstract, BibTeX, and Citation.

## Citation counts

Citation counts come from Crossref and may differ from Google Scholar because the services have different coverage. The Citation control displays the count when available and opens details about its source and retrieval date. Unavailable counts display `N/A`.

Each publication can include a saved snapshot in its `citations` field. The top-level `citationSettings` object controls automatic refreshing:

```javascript
"citationSettings": {
  "enabled": true,
  "refreshAfterHours": 24
}
```

When enabled, a visit triggers updates for registered DOI counts older than the configured interval. The page makes at most two requests at a time and caches successful results in the visitor's browser. If a request fails, an existing saved count retains its original date.

No API key or backend server is required. Refreshing happens while the page is open; it is not a scheduled update to the repository. Counts are not refreshed after the visitor leaves.

See [Crossref's Cited-by documentation](https://www.crossref.org/documentation/cited-by/) for information about citation coverage.

## Typography and appearance

The website uses the Soria serif font by By Dani for page text, headings, and controls. BibTeX and code use a monospace font.

The original font is stored at `assets/fonts/soria-font.ttf`. Upload the complete `assets/fonts` directory, including its notices. The font uses preloading and `font-display: swap`; Georgia is the fallback if it cannot load.

The font package includes `assets/fonts/OFL.txt`. Its original metadata also contains an attribution/no-derivatives notice. Keep the font unmodified and retain the included designer credit and notices.

Edit `styles.css` to change typography, colors, spacing, and layout. Visitors can adjust font size, theme, and background through the appearance menu without changing the source files.

## Project files

| File or directory | Purpose |
| --- | --- |
| `index.html` | Page structure and metadata |
| `content.js` | Editable profile, research, news, and publication data |
| `styles.css` | Typography, colors, spacing, and responsive layout |
| `app.js` | Slideshow, filters, citations, and appearance controls |
| `assets/` | Photos, research figures, and other local files |
| `assets/fonts/` | Soria font and accompanying notices |
| `.nojekyll` | Disables Jekyll processing for branch publication |
| `.github/workflows/pages.yml` | Optional GitHub Actions deployment workflow |

## Check before publishing

- Replace the supplied profile, news, figures, and publication records with your own content.
- Update the page title, description, navigation branding, and other relevant text in `index.html`.
- Review name-matching logic in `app.js` if author highlighting is specific to the supplied example content.
- Check image paths, alternative text, captions, external links, abstracts, and BibTeX.
- Preview the layout on desktop and mobile, including enlarged font sizes and both themes.
- Test publication search, filters, slideshow controls, citation export, and live citation updates.
- Retain required credits and licenses for fonts, images, and other reused assets.

The website includes no analytics or tracking scripts. Its citation-refresh feature contacts Crossref's public API, and appearance preferences and citation caches are stored in the visitor's browser.
