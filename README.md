# Playwright (JavaScript) Automation Example

Ye project `Playwright` ko `JavaScript` ke saath shuru karne ke liye basic scaffold hai.

**Quick setup (PowerShell)**

```powershell
cd "D:\testing printools\playwright-js"
npm init -y
npm i -D @playwright/test
npx playwright install
npm test
```

- `npm test` : runs all Playwright tests (`tests` folder).
- `npm run test:headed` : runs tests in headed (non-headless) browser.
- `npm run show-report` : opens the HTML report generated in `playwright-report`.

**Files**
- `package.json` : scripts and devDependency.
- `playwright.config.js` : Playwright test config.
- `tests/example.spec.js` : sample test that verifies `example.com` title.

Agar chaho toh main abhi `npm install` karke tests run kar doon. Karoonga?

**CI / GitHub Integration**

- `workflow`: I added a GitHub Actions workflow at `.github/workflows/playwright.yml` that runs on `push` and `pull_request` to `main`, installs Node, caches dependencies, installs Playwright browsers, runs `npm test`, and uploads the `playwright-report` folder as an artifact.

- To create a remote GitHub repo and push the project (recommended steps):

```powershell
cd "D:\testing printools\playwright-js"
git init
git branch -M main
git add .
git commit -m "Initial Playwright scaffold + CI"
# If you have GitHub CLI (gh) configured:
gh repo create YOUR_USERNAME/playwright-js-example --public --source=. --remote=origin --push
# Otherwise create a repo on GitHub via the web UI and then run:
# git remote add origin https://github.com/<your-username>/<repo-name>.git
# git push -u origin main
```

After pushing, GitHub Actions will automatically run the workflow on the default branch. You can inspect the run under the repository's "Actions" tab and download the `playwright-report` artifact.

If you want, I can initialize git locally and attempt to create the GitHub repo for you using `gh` now.
