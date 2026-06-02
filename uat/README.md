# UAT Testing Reports Portal

A single-page hub that lists Cathy Parmley's monthly UAT testing reports and the
phase-duration baseline, branded to the J&J Insurance design system. The newest
report is featured as a hero; older reports sit in an archive that can be viewed
as **Cards**, a **List**, or a **Timeline**. Clicking any report opens it
embedded in the portal with a back button.

Everything is static HTML/CSS/JS — no build step, no dependencies. It runs by
opening `index.html` and hosts cleanly on **GitHub Pages**.

## File structure

```
index.html        ← the portal (open this)
reports/          ← one self-contained .html file per report
  june-2026.html
  may-2026.html
  april-2026.html
  phase-duration-baseline.html
assets/           ← logo + design tokens (don't need to touch)
```

## Adding a new month's report — two steps

1. **Drop the file.** Put the new report's `.html` into the `reports/` folder
   (e.g. `reports/july-2026.html`).

2. **Add one entry** to the `REPORTS` array near the bottom of `index.html`.
   Copy an existing block and edit the fields:

   ```js
   {
     id: "july-2026",                 // must be unique; used in the URL
     kind: "monthly",                 // "monthly" or "baseline"
     title: "July 2026",
     date: "2026-07-01",              // ISO date — controls ordering (newest first)
     period: "Current period · Jun 1 – Jul 1, 2026",
     file: "reports/july-2026.html",  // path to the file from step 1
     summary: "One- or two-sentence description shown on the card.",
     stats: [                         // 2–4 headline figures
       { value: "8", label: "Projects Tested" },
       { value: "12", label: "Total Tasks" },
       { value: "5.1", unit: "d", label: "Avg / Project" }
     ]
   },
   ```

   The portal automatically sorts by `date`, so the newest entry becomes the
   hero — you don't have to reorder anything.

## Hosting on GitHub Pages

1. Commit the whole folder to a repo.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**,
   select your branch and `/ (root)`.
3. The portal is served at `https://<user>.github.io/<repo>/`.

Deep links work: `…/#/view/may-2026` opens straight to a report.
