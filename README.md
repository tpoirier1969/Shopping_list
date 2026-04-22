# Shared Shopping List v1.6.1

This build is for **GitHub Pages + Supabase**.

It uses:
- automatic **anonymous** Supabase sign-in
- one built-in shared household scope hardwired into the app
- one **Shopping** tab with store filters
- shared note lists and **Trips & Packing** checklists

## What changed in v1.6.1

- moved the app to a project-specific Supabase table family: `shoppinglist_*`
- added a project-specific trigger function: `shoppinglist_set_updated_at()`
- SQL now migrates existing data from older `shopping_*` tables into the new `shoppinglist_*` tables when present
- added/kept Shopping filters for **Master List**, **Walmart**, **Super One Negaunee**, and **Menards**
- added **Trips & Packing** checklist lanes
- added phone home-screen app icon support with manifest and Apple touch icon
- seed store labels now match the current UI wording

## Important upgrade note

Run the new `supabase_schema.sql` before loading the app.

After this upgrade, the app reads and writes:
- `shoppinglist_items`
- `shoppinglist_rules`
- `shoppinglist_notes`
- `shoppinglist_stores`
- `shoppinglist_note_items`

It no longer uses the older `shopping_*` tables for live app data.

## Supabase setup

In Supabase:

1. Open your project.
2. Go to **Authentication → Providers → Anonymous**.
3. Turn **Anonymous sign-ins** ON.
4. Open the SQL editor.
5. Run `supabase_schema.sql` for this version.

## GitHub Pages

Upload these files to your repo root or Pages folder:

- index.html
- styles.v1.6.1.css
- app.v1.6.1.js
- icon.svg
- icon-192.png
- icon-512.png
- apple-touch-icon.png
- manifest.webmanifest

Keep your existing `config.js` in place. It is **not included** in this zip.

## Live sync

This build uses Supabase Realtime Postgres Changes for live updates. After running the SQL, hard refresh the app on each device.
