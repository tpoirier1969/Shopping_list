# Shared Shopping List v1.0.0

Compact shared shopping list app for GitHub Pages + Supabase.

## What this build does

- Compact, list-first layout
- Tabs: Ours, Menards, Poirier, Schaffer, Notes, Recently Removed
- Auto-categorizes items into:
  - Produce
  - Deli
  - Vegan
  - Meat
  - Frozen
  - Gluten Free
  - Condiments
  - Canned
  - Dry Goods
  - Snacks
  - Bakery
  - Beverages
  - Dairy / Eggs
  - Cleaning
  - Paper Products
  - Pet Supplies
  - Medicine
  - Other
- Empty category headings stay hidden
- Add-item floating modal
- Unknown category prompts for manual choice and learns it for future use
- Main shopping checkboxes fade items instead of removing them immediately
- `Shopped` clears checked items from Ours / Menards
- Parent-tagged items leave the Ours tab after `Shopped`, but stay in Poirier / Schaffer until `Delivered`
- Recently Removed tab with Restore button
- Shared Notes tab
- Visible version flag
- Included icon

## Important architecture note

This starter uses **Supabase Auth** for the safer static-site setup.

Simplest way to make it shared:
- create one shared account in Supabase Auth
- sign in with the same email/password on both devices

That is not elegant, but it is clean, secure enough for a grocery app, and avoids exposing open write access from GitHub Pages.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `icon.svg`
- `supabase_schema.sql`

## Supabase setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase_schema.sql`.
3. In Authentication, enable Email/Password sign-in.
4. In `config.js`, paste:
   - your project URL
   - your anon key
5. Change `mode` from `local` to `supabase`.

Example:

```js
window.APP_CONFIG = {
  mode: 'supabase',
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-ANON-KEY',
};
```

## GitHub Pages deployment

1. Put these files in your repo root.
2. Commit and push.
3. In GitHub repo settings, enable Pages from the branch/root you want.
4. Once published, open the site and sign in.

## Known limitations in this starter

- Parent tag is single-choice: Poirier or Schaffer, not both
- Menards is its own store tab, but not yet split into subcategories beyond the same category set
- No drag/drop category reordering yet
- No additional future store tabs yet
- No invite system or separate household accounts yet

## Good next build targets

1. On-the-fly category reordering
2. Additional store tabs with custom category order per store
3. Better icon/theme options
4. Invite-based sharing with separate logins
5. Per-item quantity and note fields
