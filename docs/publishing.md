# Publishing your website

[← Back to the README](../README.md)

**Export website** gives you a ZIP containing a complete static website. It runs on any static host. These steps use
GitHub Pages, which is free.

## 1. Put the files on GitHub

1. Create a repository on github.com:
   - Name it **`<your-user>.github.io`** for your main site (e.g. `royborkin.github.io`), or anything else for a site at
     `https://<your-user>.github.io/<name>/`.
   - Set it to **Public**. Free GitHub Pages needs public repositories.
2. Unzip the export.
3. Upload the files using **one** of these:
   - **GitHub Desktop (easiest and reliable):**
     1. **File → Clone repository**.
     2. Copy all the unzipped files into the cloned folder, including the hidden `.github` folder. On Windows, turn on
        **View → Show → Hidden items** to see it.
     3. **Commit to main** → **Push origin**.
   - **Website:** **Add file → Upload files**, then drag in the folder's contents → **Commit changes**.
     Browsers sometimes skip folders that start with a dot. If `.github/workflows/publish.yml` is missing afterwards:
     1. Click **Add file → Create new file** and type the name `.github/workflows/publish.yml`.
     2. Paste the file's contents and commit.
   - **Command line:** `git add -A && git commit -m "Site" && git push`.

**Replacing an older site:** delete the old files first (or overwrite them), so leftover pages don't linger.

## 2. Turn on GitHub Pages

**Settings → Pages → Build and deployment → Source** gives two choices:

| Your export… | Choose |
|---|---|
| includes `.github/workflows/publish.yml` (Instagram or LinkedIn set to Automatic) | **GitHub Actions** |
| has no workflow | **Deploy from a branch** → `main` → `/ (root)` → **Save** |

**GitHub Actions** works in both cases if your export has the workflow.

## 3. Wait a minute, then open your site

- Main site: `https://<your-user>.github.io/`
- Other repository: `https://<your-user>.github.io/<repository>/`

**Actions** shows the progress. A green check means it's live. If you see the old version, refresh with Ctrl+F5.

## Updating the site

1. Open Portfolio Studio and open your project. Use **Open** with `project.portfolio.json`, which is included in every
   export, or just keep working in the same browser.
2. Make your changes, then **Export website**.
3. Upload the new files over the old ones and commit. GitHub republishes within a minute.

If Instagram or LinkedIn sync is on, the workflow commits posts to the repository by itself. Before uploading from
GitHub Desktop, click **Fetch origin / Pull** so you start from the latest version.

## Use your own domain

1. In **Settings → Pages → Custom domain**, enter your domain (e.g. `roy.design`) → **Save**.
   GitHub adds a `CNAME` file to the repository.
2. At your domain registrar, add DNS records:
   - **Apex domain** (`roy.design`): four `A` records pointing to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`.
   - **Subdomain** (`www.roy.design`): a `CNAME` record pointing to `<your-user>.github.io`.
3. After DNS updates (minutes to hours), tick **Enforce HTTPS**.

When you upload a new export later, keep the `CNAME` file.

## Other hosts

- **Netlify:** drag the unzipped folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel / Cloudflare Pages:** create a project from the GitHub repository, with no build command and the root as
  the output folder.

The hourly Instagram / LinkedIn sync is a GitHub workflow, so on other hosts it only runs if the site's repository is
on GitHub.

## Checklist before you share the link

- [ ] Google Drive files (résumé, portfolios) are shared as *Anyone with the link → Viewer*.
- [ ] Instagram and LinkedIn links point to single, public posts.
- [ ] Contact details are correct, and anything you don't want public is hidden.
- [ ] You checked the site on a phone, in portrait and landscape.
- [ ] **Project → Website details** (in the app) has the site title and description used by search engines and link previews.

---

© 2026 Roy Borkin. All rights reserved. See [LICENSE](../LICENSE).
