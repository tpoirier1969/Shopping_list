# Shared Shopping List v1.5.0

This build is for **GitHub Pages + Supabase**.

It uses:
- automatic **anonymous** Supabase sign-in
- one built-in shared household scope hardwired into the app
- no email/password form in the UI
- shared custom store tabs

## What changed in v1.5.0

- added a new **nifty shopping-cart icon**
- converted **Notes** into real note lists
- added **Notes**, **Donna Notes**, and **Tod Notes** sections inside the Notes tab
- added a checkbox on each note
- added a **Delete** button on each note
- migrates legacy shared note text into the new note list system

## Supabase setup

In Supabase:

1. Open your project.
2. Go to **Authentication → Providers → Anonymous**.
3. Turn **Anonymous sign-ins** ON.
4. Open the SQL editor.
5. Run `supabase_schema.sql` again for this version.

## GitHub Pages

Upload these files to your repo root or Pages folder:

- index.html
- styles.v1.5.0.css
- app.v1.5.0.js
- icon.svg

Keep your existing `config.js` in place. It is **not included** in this zip.

## Startup behavior

This build is hard-wired for Supabase. There is no local fallback and no mode toggle. If setup fails, the app shows a visible startup error instead of leaving a blank page.

## SQL note

Run the updated `supabase_schema.sql` for this build. It adds the `shopping_note_items` table used by Notes, Donna Notes, and Tod Notes.


## Speed changes in v1.5.0

- Groceries load first
- saved grocery list is shown while Supabase connects
- extra auth/session churn trimmed down
- schema adds an index for faster shopping item loads


## Live sync
This build uses Supabase Realtime Postgres Changes for live updates. After running the SQL, hard refresh the app on each device.


## v1.6.0 changes
- One Shopping tab with Master List, Walmart, Super One Negaunee, and Menards category filters.
- Added Trips & Packing checklist lanes.
- Added phone home-screen app icon support with manifest and Apple touch icon.
- Updated SQL lane constraint for Trips & Packing checklist lanes.
