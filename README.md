# Soham & Shraddha — Wedding invitation

An editorial wedding invitation built with React and Vite. The page includes the ceremony details, countdown, RSVP, scroll reveals, caricature placeholders, a guest photo area, and a later wedding album link.

## Run locally

```sh
npm install
npm run dev
```

## Connect the shared photo album

In `src/constants/wedding.js`, set `PHOTO_DROP_URL` to the shared upload folder guests should use. For a Google Drive folder, choose its sharing and upload permissions to suit your guests before publishing the link. Guests use the Drive upload page to add their photos; the site's multi-photo picker is a local preview only. There is no application-side file count limit.

After the wedding, set `WEDDING_ALBUM_URL` in the same file to the published album link. The guest-facing album link will appear automatically.

The three illustrated portrait panels in the caricature section are intentional placeholders for the couple's final artwork.
