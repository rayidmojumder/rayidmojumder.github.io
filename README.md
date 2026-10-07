# Research portfolio website

A single-page academic website built from scratch with only plain HTML, CSS, and JavaScript. 
## Previewing

Unzip the project and double-click **index.html**. For a local web server, run `python -m http.server 8000` from this directory and open `http://localhost:8000`.

## Publish or update GitHub Pages site

1. Unzip the download.
2. Open existing GitHub repository. Use **Add file > Upload files** to replace `index.html`, `styles.css`, `app.js`, and `content.js`, and upload all files in `assets`. Keep `index.html` at the repository root. Commit the update.
3. For branch-based publication, leave out `.github/workflows/pages.yml`. In **Settings > Pages**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. To use your preferred address `https://rayidmojumder.github.io/`, the repository must be named `rayidmojumder.github.io`. In the repository's **Settings > General**, rename `rayidmojumder` to `rayidmojumder.github.io`, or create that repository and upload the files there. If a repository already has that exact name, use it.
5. After deployment finishes, **Settings > Pages > Visit site** opens the published website.

Alternative: the included `.github/workflows/pages.yml` publishes through GitHub Actions. Upload that hidden folder, choose **GitHub Actions** as the Pages source, then run **Publish portfolio to GitHub Pages** from the repository's Actions tab. Use either the branch method or the custom workflow.

Official instructions:

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Editing content
Edit **content.js**, either locally in a text editor or using GitHub's file editor.

| What you want to change | Where in content.js |
| --- | --- |
| Name, bio, photo, affiliation, links | `profile` |
| News or activities | `news` |
| Research topics, descriptions, figures | `research` |
| Publication records, abstracts, PDF links, citations | `publications` |
| “Updated” date in footer | `updated` |

Keep the property names, quotes, brackets, and commas. Text containing a double quotation mark must escape it as `\"`. Do not delete the first `window.PORTFOLIO =` line or the final semicolon.

### Adding news item
Copy an existing object at the start of the `news` array, change its date and text, and keep a comma between entries. Items appear in the order you enter them. Use a year only when you do not know the month.

### Changeing photo
Put new photo in `assets`, then update `profile.photo`, for example `assets/my-headshot.jpg`. Update `profile.photoAlt` too. The layout currently frames the supplied public photo.

### Add research figures
Put the image in `assets` and add an object to a research area's `slides` array:

```javascript
{
  "src": "assets/my-research-figure.png",
  "alt": "A descriptive explanation of the figure",
  "caption": "A short figure caption.",
  "source": "https://doi.org/YOUR-DOI"
}
```

Each research area has its own slideshow. Previous and Next wrap only within the selected area. Click a thumbnail to select a figure, or click the large figure to open an enlarged view. Choose another research tab to change areas. The gallery has keyboard controls and does not auto-advance. 
To add another area, copy a complete object in `research`. Use a unique `id` and connect related publications by their exact `id` values in `publicationIds`.

### Adding publication
Copy an object in `publications`. Use a unique `id`, a numeric `year`, and a `type` of `Journal`, `Conference`, or `Preprint`. Add the full author list, venue, DOI, paper link, PDF link, abstract, and BibTeX. Unknown optional values can be empty strings. An absent abstract leaves the Abstract control disabled. PDF and DOI metadata are retained in the content file, while the publication menu contains only Paper, Abstract, BibTeX, and Citation. Publications automatically sort by descending year. Entries within a year follow the array's order. Year filters update automatically.

## Features
- Home with photo, short bio, interests, and recent news.
- Compact academic layout with a small photo beside the bio, reduced headings, and tighter section spacing.
- Research tabs with eight figures across three independent slideshows, clickable thumbnails, enlargement, captions, source links, and related publications.
- All 25 Rayid-authored records listed on the existing public publications page at the time of creation. Unrelated template/sample bibliography entries were excluded.
- Search by title, author, venue, DOI, or year; year and publication-type filters.
- Full author names and venue details; only Paper, Abstract, BibTeX, and Citation controls below each publication.
- Automatic Crossref citation counts with dated local snapshots, browser caching, and source details.
- Expandable abstracts, BibTeX dialog, citation copying, and downloads.
- Export all citations or just the filtered set.
- Font size from 90% to 200%; Day, Night, or device mode; preset and custom backgrounds; reset control.
- Appearance preferences saved in the visitor's own browser.
- Responsive mobile layout, keyboard navigation, skip link, reduced-motion support, and automatic foreground contrast for custom backgrounds.
- Relative asset paths work for both account and project GitHub Pages URLs.

## Citation counts
`Citation (15)`, for example, means 15 citations indexed by **Crossref**. Click Citation to see the source and date. These counts can differ from Google Scholar because the databases cover different works. This  includes verified counts for 22 publications; the three arXiv records have no Crossref count and display **Citation (N/A)**. 

On a visit, the page refreshes registered DOI counts older than 24 hours using Crossref's public API. It makes at most two requests at a time and caches successful results in the visitor's browser. If the service cannot be reached, the saved count remains visible with its original date. The site does not keep refreshing in the background after a visitor leaves.

The `citations` field inside each publication stores an optional verified snapshot. The top-level `citationSettings` controls refresh behavior. No need for an API key, an account, or a server. Internet access is needed for live updates; saved counts remain available offline. Source documentation: https://www.crossref.org/documentation/cited-by/


## Files

- `index.html`: page structure.
- `content.js`: all editable content.
- `styles.css`: colors, typography, spacing, and responsive layout.
- `app.js`: slideshow, filters, citations, and appearance controls.
- `assets/`: local photo and figures.
- `.nojekyll`: disables Jekyll processing for branch-based publication.
- `.github/workflows/pages.yml`: optional automatic deployment workflow.

The project includes no analytics, tracking scripts, or credentials. The only runtime service is the public Crossref API for citation updates; all profile content and scientific figures are local.
