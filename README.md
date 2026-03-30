# Shared Shopping List v1.1.0

This build is for **GitHub Pages + Supabase**.

It uses:
- automatic **anonymous** Supabase sign-in
- one built-in shared household scope hardwired into the app
- no email/password form in the UI
- shared custom store tabs

## What changed in v1.1.0

- renamed **Shopping** to **Groceries**
- added a shared **+ Store** button to create new store tabs
- removed the cluttery count badges
- added tab alert dots for Groceries, Menards, custom stores, Parents, and Notes when something needs attention
- hid the Supabase badge and version flag on phones
- kept parent-tagged grocery items in the main grocery flow while also showing them in **Parents**

## 1) Supabase setup

In Supabase:

1. Open your project.
2. Go to **Authentication → Providers → Anonymous**.
3. Turn **Anonymous sign-ins** ON.
4. Open the SQL editor.
5. Run `supabase_schema.sql` again for this version.

## 2) config.js

Do not replace the whole file. Only update the two existing Supabase values already in it:

- `supabaseUrl`
- `supabaseAnonKey`

No mode line is needed.

## 3) Publish to GitHub Pages

Upload these files to your repo root or Pages folder:

- index.html
- styles.v1.1.0.css
- app.v1.1.0.js
- config.js
- icon.svg
- supabase_schema.sql (for your Supabase side, not for the site root)

## Startup behavior

This build is hard-wired for Supabase. There is no local fallback and no mode toggle. If setup fails, the app shows a visible startup error instead of leaving a blank page.
