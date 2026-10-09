# 🍽️ Tapas Platters — A World & India Vegetarian Guide
231 vegetarian tapas-style platters (36 Indian states/UTs + 195 countries). Each has a drink, bread, 2 snacks, a main, 2 dips and a dessert.

Features: search by place, dish or ingredient · serving scaler · favourites · shopping list · random "surprise me" · offline-friendly static site.

## Photos & exports
Dish photos load live from Wikipedia (cached in the browser; icons are the fallback). "Export saved recipes" downloads a Markdown file with full recipes; "Backup/Import list" saves and restores your favourites as JSON.

## Publish on GitHub Pages (easiest, no hidden files needed)
1. Create a repo and upload all the visible files (`index.html`, `app.js`, `style.css`, `data.js`).
2. Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)` → Save.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

## Optional: auto-deploy with GitHub Actions
`pages-workflow.yml` is a visible copy of the workflow. On GitHub use Add file → Create new file, type the name `.github/workflows/pages.yml`, paste its contents, then set Pages Source to **GitHub Actions**.

Open `index.html` locally to preview.
