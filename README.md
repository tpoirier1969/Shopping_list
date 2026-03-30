# Shared Shopping List v1.0.6

This build is for **GitHub Pages + Supabase**.

It uses:
- automatic **anonymous** Supabase sign-in
- one built-in shared household scope hardwired into the app
- no email/password form in the UI

## What changed in v1.0.6

- removed the email/password UI
- app auto-connects through Supabase anonymous auth
- removed householdId from config.js; the shared scope is hardwired for Tod + Donna
- renamed **Ours** to **Shopping**
- one **Parents** tab with **Poirier** and **Shafer** sections
- explicit **Done** buttons for Shopping and Menards
- removed leftover local/demo wording from the header
- improved canned-item guessing for items like crushed pineapple

## 1) Supabase setup

In Supabase:

1. Open your project.
2. Go to **Authentication → Providers → Anonymous**.
3. Turn **Anonymous sign-ins** ON.
4. Open the SQL editor.
5. Run `supabase_schema.sql`.

## 2) Edit config.js

Fill in the two Supabase values:

```js
window.APP_CONFIG = {
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-ANON-KEY',
};
```

The app now uses one built-in shared scope for you and Donna. There is no householdId to set.

## 3) Publish to GitHub Pages

Upload these files to your repo root or Pages folder:

- index.html
- styles.css
- app.js
- config.js
- icon.svg

## 4) Open the site

When the app loads correctly, the badge under the title should say:

- **Supabase shared mode**

Not local. Not sign in.

## Notes

This build is designed for convenience sharing, not fortress-grade secrecy. It keeps the app simple and removes the login friction, which fits a household shopping list much better.


## Startup behavior
This build is hard-wired for Supabase. There is no local fallback and no mode toggle. If setup fails, the app shows a visible startup error instead of leaving a blank page.
