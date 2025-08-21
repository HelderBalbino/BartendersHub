# Cloudinary CLI Walkthrough (Internal Dev Doc)

This document summarizes the steps automated or to run manually when interacting
with Cloudinary via the CLI from VS Code.

## 1. Install CLI (one-time)

Option A (ephemeral, recommended for CI / avoiding global state):

```bash
npx cloudinary-cli --help
```

Option B (global install):

```bash
npm install -g cloudinary-cli
```

## 2. Configure Credentials

Obtain from Cloudinary Dashboard (Security > Account Details). Run:

```bash
cloudinary config --cloud_name <CLOUD_NAME> --api_key <API_KEY> --api_secret <API_SECRET>
```

This writes `~/.cloudinary` (INI). Do NOT commit.

Alternative (temp env var, leaves no file):

```bash
export CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
```

Unset when done:

```bash
unset CLOUDINARY_URL
```

## 3. Connectivity Ping

```bash
cloudinary api ping
```

Expect `{"status":"ok"}`.

## 4. Prepare Sample Image

Re-use project asset:

```bash
cp ../src/assets/images/logo.png /tmp/bh-logo.png
```

## 5. Upload Sample

```bash
cloudinary upload /tmp/bh-logo.png --folder=demo --tags=bh,test --use_filename=true --unique_filename=false
```

Key output fields: `public_id`, `secure_url`, `bytes`.

## 6. Fetch URL with Transformation (example)

```bash
cloudinary url bh-logo --type=upload --resource_type=image --transformation "w_400,c_fill"
```

## 7. Search Recent Assets in Folder

```bash
cloudinary search --expression "folder=demo" --max_results 5
```

## 8. Cleanup (Delete Asset)

```bash
cloudinary delete_assets demo/bh-logo
```

## 9. Security / Best Practices

-   Never expose API secret in frontend bundles.
-   Rotate keys if leaked.
-   Prefer unsigned uploads for direct-from-browser patterns (requires an
    unsigned preset) or sign on backend.
-   Avoid committing `~/.cloudinary`.
-   Use role separation: one key for production, one for staging.

## 10. Automation Idea

Add an npm script that pings Cloudinary before starting server (optional).
Example script (Node):

```bash
node scripts/cloudinaryPing.js
```

## 11. Troubleshooting

| Symptom        | Likely Cause             | Fix                                                |
| -------------- | ------------------------ | -------------------------------------------------- |
| auth error     | wrong key/secret         | re-run config                                      |
| ENOENT file    | wrong path               | `ls` the path first                                |
| upload blocked | unsigned preset required | create preset or use signed server route           |
| slow upload    | large original           | add resize transformation or eager transformations |

---

Internal doc; adjust as environment evolves.
