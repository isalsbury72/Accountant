# Accountant PWA (Local-First Tax Tool)

This repository contains a first-pass Progressive Web App that recreates the core workflow from your FileMaker tax database:

- Record expenses with supplier/category/sub-category/description/date/amount.
- Attach invoice files (PDF or photos).
- Maintain a supplier list.
- View a Profit & Loss style report grouped by category and sub-category, with financial-year filtering.
- Export/import JSON backup for migration and safety.

## Why this approach

- **Local-first today**: all data is saved in your browser using IndexedDB.
- **Server-ready later**: the app is static and can be hosted on shared hosting (like DreamIT) as plain files.
- **Phone-friendly**: responsive layout + installable PWA manifest and service worker.

## What to open (simple)

- **File Explorer**: only to find the project folder on disk.
- **CMD window**: to run `start-local.bat`.
- **Web browser (Chrome/Edge/Firefox)**: to open the app URL `http://127.0.0.1:4173`.

Think of it like this:
1. Find folder in **File Explorer**.
2. Start server in **CMD**.
3. Use app in **web browser**.

## If the folder is not on your PC yet

No problem — first download/copy the project to your computer, then run it.

### Option A: Download ZIP from GitHub (easiest)
1. Open your repo in GitHub.
2. Click **Code** → **Download ZIP**.
3. Extract it to: `C:\Users\visal\Desktop\Accountant`.
4. Open that folder in File Explorer.
5. In the address bar type `cmd` and press Enter.
6. Run `start-local.bat`.
7. Open `http://127.0.0.1:4173` in your browser.

### Option B: Clone with Git (optional)
Use this only if Git is installed. If CMD says `'git' is not recognized`, skip this and use **Option A (Download ZIP)**.

```bat
cd /d %USERPROFILE%\Desktop
git clone <your-repo-url> Accountant
cd /d %USERPROFILE%\Desktop\Accountant
start-local.bat
```

## If CMD says `'git' is not recognized`

That is OK. You do **not** need Git to run the app.

Use this path instead:
1. In GitHub, click **Code** → **Download ZIP**.
2. Extract ZIP to `C:\Users\visal\OneDrive\Desktop\Accountant` (or `Desktop\Accountant`).
3. Open that folder, type `cmd` in the address bar, press Enter.
4. Run `start-local.bat`.
5. Open `http://127.0.0.1:4173` in your browser.

Git is only needed for developer workflows (clone/push/PR), not for simply running the app.

## Private repo / branch protection (is that an issue?)

Short answer:
- **Private repo is not a problem.** It just means only invited users can view it.
- **Branch protection disabled is also not a blocker.** You can still push and merge normally.

What usually causes "I can’t see it":
1. You are logged into the wrong GitHub account.
2. Your branch was not pushed yet.
3. You are viewing `main` while changes are on another branch.

Quick checks:
```bash
git remote -v
git branch --show-current
git log --oneline -5
```

Then push and view the correct branch on GitHub:
```bash
git push -u origin <your-branch-name>
```

## If the ZIP only contains `.gitkeep`

That means GitHub currently has an almost-empty repo (no app files were pushed yet).

Use one of these methods to put the app files into GitHub:

### Method 1: Upload via GitHub website (no Git install)
1. Open your `Accountant` repo on GitHub.
2. Click **Add file** → **Upload files**.
3. Drag/drop these files from your local project folder:
   - `index.html`, `app.js`, `styles.css`, `manifest.json`, `sw.js`, `start-local.bat`, `convert-csv.bat`, `README.md`
   - `index.html`, `app.js`, `styles.css`, `manifest.json`, `sw.js`, `start-local.bat`, `README.md`
4. Click **Commit changes**.
5. Download ZIP again — it should now contain the real project files.

### Method 2: Push with Git (if installed)
```bash
git remote add origin <your-github-repo-url>
git push -u origin <your-branch-name>
```

## Why "Create PR" did not update GitHub files

Important: creating a PR message does **not** upload code by itself.

For GitHub to show new files, this order is required:
1. Commit changes locally.
2. Push the branch to GitHub.
3. Open/update PR on GitHub.

### Quick diagnosis commands
```bash
git status
git remote -v
git branch --show-current
git log --oneline -5
```

If `git remote -v` is empty, connect remote first:
```bash
git remote add origin <your-github-repo-url>
```

Then push your current branch:
```bash
git push -u origin <your-branch-name>
```

## If you do not see changes on GitHub

That means the code is only local right now and has not been pushed to your GitHub repo yet.

### Check what branch you are on
```bash
git branch --show-current
```

### Connect this folder to your GitHub repo (one time)
```bash
git remote add origin <your-github-repo-url>
```

### Push your branch to GitHub
```bash
git push -u origin <your-branch-name>
```

After push:
1. Refresh GitHub repo page.
2. Make sure you are viewing the same branch (`main` vs your feature branch).
3. If needed, open a Pull Request to merge into `main`.

## Where is the project folder (Windows File Explorer)?

Look for a folder named **`Accountant`** that contains these files:
- `README.md`
- `index.html`
- `app.js`
- `start-local.bat`

Most likely locations:
- `C:\Users\visal\Desktop\Accountant`
- `C:\Users\visal\Downloads\Accountant`
- `C:\Users\visal\Documents\Accountant`

Quick way to find it:
1. Open **File Explorer**.
2. Click **This PC**.
3. In the search box (top-right), type: `start-local.bat`
4. Open the folder where that file is found.

Once you are in that folder:
- Click the address bar, type `cmd`, press Enter.
- In CMD, run: `start-local.bat`
- Then open: `http://127.0.0.1:4173`

## Run locally

Because service workers require HTTP(S), run a local server from this project folder.

### Windows (CMD) — exact steps

Your error happened because `C:\path\to\Accountant` is a placeholder, not a real folder.

1) In **File Explorer**, find the folder that contains this project files (`README.md`, `index.html`, `start-local.bat`).

2) Click the folder path bar, type `cmd`, and press Enter.
   - This opens CMD already in the correct folder.

3) Run:

```bat
start-local.bat
```

4) Open in browser:

- `http://127.0.0.1:4173`

### Windows (if you need to clone first)

If you do not have the files on your PC yet:

```bat
cd /d %USERPROFILE%\Desktop
git clone <your-repo-url> Accountant
cd /d %USERPROFILE%\Desktop\Accountant
start-local.bat
```

### If CMD says `'start-local.bat' is not recognized`

You are not in the project folder. Run:

```bat
dir
```

You should see `start-local.bat` in the list. If you do not, `cd` into the correct folder first.

### Mac / Linux terminal

```bash
cd /path/to/Accountant
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

- `http://127.0.0.1:4173`

If `127.0.0.1` does not load, try `http://localhost:4173`.

## Import your 2 CSV files (suppliers + invoices)

Best path: convert both CSV files into the app's JSON backup format, then use **Import JSON** in the app.

### 1) Prepare CSV headers
The converter accepts common header names automatically:
- Suppliers CSV: `name`/`supplier_name`, optional `address`, `phone`, `category`, `subcategory`
- Invoices CSV: `date`, `supplier`/`supplier_name`, `amount`, optional `category`, `subcategory`, `description`

### 2) Run converter
```bash
python3 csv_to_accountant_json.py \
  --suppliers suppliers.csv \
  --invoices invoices.csv \
  --out accountant-import.json
```

### Windows PowerShell (recommended commands)
Use **one command on one line** (do not include literal `\n` text):

```powershell
py .\csv_to_accountant_json.py --suppliers .\suppliers.csv --invoices .\invoices.csv --out .\accountant-import.json
```

If you prefer multiple lines in PowerShell, use the backtick character (`` ` ``), **not** `\`:

```powershell
py .\csv_to_accountant_json.py `
  --suppliers .\suppliers.csv `
  --invoices .\invoices.csv `
  --out .\accountant-import.json
```

If `python3` is not found on Windows, that is normal. Try `py` first.

### Windows easiest option (no flags)
You can also run the helper batch file:

```bat
convert-csv.bat suppliers.csv invoices.csv accountant-import.json
```

### Can I run this converter in GitHub Codespaces?
Yes.

In Codespaces Terminal, run from the repo root:

```bash
python3 csv_to_accountant_json.py \
  --suppliers suppliers.csv \
  --invoices invoices.csv \
  --out accountant-import.json
```

Then either:
- download `accountant-import.json` from Codespaces to your computer and import in the app, or
- if running the app inside Codespaces, use that file directly with **Import JSON**.

If your CSV files are on your PC, upload them into the Codespace first (drag/drop into the file tree).

### If you get `FileNotFoundError` in Codespaces
This means Python cannot see one of the CSV files from your current folder.

Run these checks first:
```bash
pwd
ls -la
```

If files are missing locally, pull latest from GitHub:
```bash
git pull
```

Then run with full paths (most reliable):
```bash
python3 csv_to_accountant_json.py \
  --suppliers /workspaces/Accountant/suppliers.csv \
  --invoices /workspaces/Accountant/invoices.csv \
  --out /workspaces/Accountant/accountant-import.json
```

### 3) Import into the app
1. Open the app.
2. Click **Import JSON**.
3. Select `accountant-import.json`.

Notes:
- This imports suppliers + expenses.
- Invoice files/photos are not imported from CSV (CSV does not contain binary file data).

### What to do right after CSV import (recommended)
1. **Export a backup immediately**
   - Click **Export JSON** and save the file somewhere safe (for rollback).
2. **Check supplier cleanup**
   - Open the **Suppliers** section and look for duplicate names (e.g., `Officeworks` vs `Office Works`).
   - Keep one canonical name and re-import cleaned CSV later if needed.
3. **Check totals match your source**
   - Compare the app total in **P&L Report** with your CSV/accounting export total for the same date range.
4. **Set your financial-year range**
   - Confirm **From** / **To** dates match your tax year before reviewing totals.
5. **Attach invoices progressively**
   - CSV import brings text rows only; attach PDF/photo files as you work through records.
6. **Do a restore test once**
   - Import your exported JSON into a fresh browser profile/device to confirm your backup works.

### Common data quality fixes after import
- If categories are messy, clean category/sub-category values in CSV and re-run the converter.
- If amounts are wrong, ensure source CSV uses plain numeric values (the converter strips `$` and commas).
- If dates are blank, verify invoice CSV has a `date` column (or alias like `invoice_date`).

## Can I run this over the web from GitHub?

Yes — this app is static, so it can be hosted with **GitHub Pages**.

### Important notes first
- It works well on GitHub Pages because there is no backend server required.
- Data is still local to each browser/device (IndexedDB), so phone and laptop do not auto-sync.
- If your repo is private, GitHub Pages availability depends on your GitHub plan/org settings.

### Quick publish steps (GitHub Pages)
1. Push the project files to your GitHub repo.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your branch), folder `/ (root)`
4. Save, wait for deploy, then open the Pages URL shown there.

### If Pages is not available
- Make the repo public, or
- Use your DreamIT static hosting (upload the same files), or
- Keep running locally via `start-local.bat`.

## Data model (MVP)

### suppliers store
- `id`
- `name`
- `address`
- `phone`
- `defaultCategory`
- `defaultSubCategory`

### expenses store
- `id`
- `date` (`YYYY-MM-DD`)
- `supplierId`
- `supplierName` (snapshot)
- `category`
- `subCategory`
- `amount`
- `description`
- `invoiceFileId` (optional)

### files store
- `id`
- `name`
- `type`
- `size`
- `data` (`ArrayBuffer`)

## Migration from FileMaker (recommended path)

1. Export **Suppliers** to CSV.
2. Export **Invoices/Transactions** to CSV, including date, supplier, category, sub-category, amount, description.
3. Export containers/invoice files into a folder with a stable naming strategy.
4. Build a one-time import script to map CSV rows + files into this schema.

## Next steps I recommend

1. Add CSV importer with field mapping UI.
2. Add dedupe logic (hash on date + supplier + amount + description).
3. Add optional cloud sync layer (Supabase/Firebase or your server API) while keeping IndexedDB offline-first.
4. Add OCR capture pipeline for photo receipts.
5. Add financial-year presets for Australian tax years and GST handling if needed.
