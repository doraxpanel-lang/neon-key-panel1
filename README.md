# NEON KEY PANEL — static starter

This is a mobile-friendly visual prototype for a digital-key reseller dashboard.

## Deploy on GitHub + Render (Android-friendly)
1. Create a GitHub account at https://github.com/
2. Create a new **public** repository named `neon-key-panel`.
3. Upload `index.html` from this folder using **Add file → Upload files**.
4. Open https://render.com/ and sign up, preferably using GitHub.
5. In Render choose **New + → Static Site** and connect `neon-key-panel`.
6. Build command: leave blank. Publish directory: `.` (a single dot).
7. Click **Create Static Site**. Render will provide a public `onrender.com` URL.

## Important limitations
This is a frontend demo only. It does NOT implement real login, database storage, payment verification, key delivery, admin permissions, or supplier API calls. Do not accept real payments or store real activation codes until a secure backend is added. Provider API secrets must never be placed in browser JavaScript or public repository files.
