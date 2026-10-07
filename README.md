# Rayid Mojumder's research portfolio

A single-page academic website built from scratch with plain HTML, CSS, and JavaScript. No framework, paid service, database, package installation, or build step is needed.

## Preview it

Unzip the project and double-click **index.html**. The entire website works locally, including the content, filters, figures, and downloads. For a local web server, run `python -m http.server 8000` from this directory and open `http://localhost:8000`.

## Publish to GitHub Pages

For a first review, create a separate public repository called `portfolio-preview`. This leaves your existing website available while you review the new design.

1. Unzip the download.
2. Create the public repository in your GitHub account.
3. Choose **Add file > Upload files**. Upload the **contents** of the `rayid-portfolio` folder, so `index.html` is at the repository root. Include the `assets` folder. Commit the files to `main`.
4. Open **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
5. Wait for the Pages deployment to finish. **Settings > Pages > Visit site** opens the published website.

With a repository named `portfolio-preview`, the URL will be `https://YOUR-USERNAME.github.io/portfolio-preview/`. For a website at `https://YOUR-USERNAME.github.io/`, the repository must be named `YOUR-USERNAME.github.io`. Your existing public profile appears to use `rayid-mojumder.github.io`. Review this new project before replacing any existing repository files.

Alternative: the included `.github/workflows/pages.yml` publishes with GitHub Actions. To use it, upload that hidden folder as well, choose **GitHub Actions** as the Pages source, then run **Publish portfolio to GitHub Pages** from the repository's Actions tab. Use either the branch method or the included custom workflow. With the branch method, leave out `.github/workflows/pages.yml` to avoid duplicate deployment attempts. GitHub's web upload may omit hidden folders; that does not affect the simpler branch method.

Official instructions:

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Edit your content

Edit **content.js**, either locally in a text editor or using GitHub's file editor. Make a small change, preview it, and commit it. GitHub Pages republishes committed updates.

| What you want to change | Where in content.js |
| --- | --- |
| Name, bio, photo, affiliation, links | `profile` |
| News or activities | `news` |
| Research topics, descriptions, figures | `research` |
| Publication records, abstracts, PDF links, citations | `publications` |
| “Updated” date in footer | `updated` |

Keep the property names, quotes, brackets, and commas. Text containing a double quotation mark must escape it as `\"`. Do not delete the first `window.PORTFOLIO =` line or the final semicolon.

### Add a news item

Copy an existing object at the start of the `news` array, change its date and text, and keep a comma between entries. Items appear in the order you enter them. Use a year only when you do not know the month.

### Change the photo

Put your new photo in `assets`, then update `profile.photo`, for example `assets/my-headshot.jpg`. Update `profile.photoAlt` too. The layout currently frames the supplied public photo; a close-up portrait works best.

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

Previous and Next walk through all figures and research areas. With two figures in one area, the slideshow shows 1 / 2 and 2 / 2 before moving to the next area. It is manually controlled and does not auto-advance.

To add another area, copy a complete object in `research`. Use a unique `id` and connect related publications by their exact `id` values in `publicationIds`.

### Add a publication

Copy an object in `publications`. Use a unique `id`, a numeric `year`, and a `type` of `Journal`, `Conference`, or `Preprint`. Add the full author list, venue, DOI, paper link, PDF link, abstract, and BibTeX. Unknown optional values can be empty strings. Empty abstracts or links are not displayed. Publications automatically sort by descending year. Entries within a year follow the array's order. Year filters update automatically.

### Optional links

Add a CV or contact link to `profile.links`, for example a CV at `assets/cv.pdf`. HTTP and HTTPS links and local files are supported. Email contact can be placed as plain text in a bio; use an HTTPS contact page for a linked contact option. No email address or CV was guessed.

## Features

- Home with photo, short bio, interests, and recent news.
- Research tabs, figure slideshow, captions, source links, and related publications.
- All 25 Rayid-authored records listed on the existing public publications page at the time of creation. Unrelated template/sample bibliography entries were excluded.
- Search by title, author, venue, DOI, or year; year and publication-type filters.
- Full author names and venue details, available paper/PDF/DOI links, expandable abstracts, BibTeX dialog, citation copying, and downloads.
- Export all citations or just the filtered set.
- Font size from 90% to 200%; Day, Night, or device mode; preset and custom backgrounds; reset control.
- Appearance preferences saved in the visitor's own browser.
- Responsive mobile layout, keyboard navigation, skip link, reduced-motion support, and automatic foreground contrast for custom backgrounds.
- Relative asset paths work for both account and project GitHub Pages URLs.

## Content sources and review

Bio, publication metadata, author lists, abstracts, citations, external links, and existing research figures were drawn from the user's public pages:

- https://rayid-mojumder.github.io/
- https://rayid-mojumder.github.io/publications/

The figure captions credit their source publications. The chapter-approval news and current research framing also use details supplied in our conversation. This website is a fresh implementation; the previous site's theme and code were not copied. The complete publication list reflects those public records, rather than an independent assertion that no newer publications exist. External publisher PDFs may require institutional access.

## Verification

JavaScript syntax, local asset references, and HTML structure were checked. DOM-level checks passed for publication rendering, search, filters, empty results, abstracts, citation dialogs, copying and export, slideshow navigation, day/night modes, font limits, custom background contrast, reset, and preference persistence. A browser executable was unavailable in the creation environment, so desktop/mobile visual rendering still needs review in your browser.

## Files

- `index.html`: page structure.
- `content.js`: all editable content.
- `styles.css`: colors, typography, spacing, and responsive layout.
- `app.js`: slideshow, filters, citations, and appearance controls.
- `assets/`: local photo and figures.
- `.nojekyll`: disables Jekyll processing for branch-based publication.
- `.github/workflows/pages.yml`: optional automatic deployment workflow.

The project includes no analytics, tracking scripts, credentials, or runtime external dependencies.
