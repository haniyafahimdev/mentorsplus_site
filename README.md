# Mentor's Plus — site

Static HTML/CSS/JS site, ready to deploy to Vercel. Backend integrations
(Firebase, Resend, Cloudinary) are stubbed with clear TODOs — see below.

## Pages
- `index.html` — Homepage
- `courses.html` — Courses/services
- `tutors.html` — Tutor profiles
- `book.html` — Booking flow
- `mock-tests.html` — Mock test offerings
- `about.html` — About / story / map
- `contact.html` — Contact form, map, WhatsApp
- `admin.html` — Admin panel (bookings, inquiries, tutor schedules)

## Before you deploy

### 1. Firebase (bookings, admin auth, contact form storage)
1. Create a project at https://console.firebase.google.com
2. Enable **Firestore** and **Authentication → Email/Password**
3. Paste your web app config into `assets/config.js` (`firebaseConfig`)
4. Uncomment the Firebase `import`/`initializeApp` lines in `book.html`,
   `contact.html`, and `admin.html`, and uncomment the `addDoc(...)` /
   `signInWithEmailAndPassword(...)` calls
5. Create an admin user in Firebase Authentication for `admin.html` access,
   and lock down Firestore security rules so only that admin can read/write
   `bookings` and `inquiries`

### 2. Resend (booking confirmation emails)
Resend's API key can't be called from the browser safely. Create a Vercel
serverless function to hold it:

```
/api/send-confirmation.js
```
(full example code is in `assets/config.js`). Add `RESEND_API_KEY` as an
environment variable in your Vercel project settings, then uncomment the
`fetch(BOOKING_CONFIRMATION_ENDPOINT, ...)` call in `book.html`.

### 3. Cloudinary (tutor photos, gallery)
Set `CLOUDINARY_CLOUD_NAME` in `assets/config.js`, upload tutor photos to
your Cloudinary media library, and swap the placeholder `<img src>` values
in `tutors.html` for your real Cloudinary URLs.

### 4. Deploy to Vercel
```
npm i -g vercel
vercel
```
Or connect the GitHub repo to Vercel from vercel.com/new — no build step
needed, it's a static site.

## Notes
- Placeholder content: phone number, email, address, and team bios are
  placeholders — search for "Katipunan" and "8123 4567" to find and replace.
- The WhatsApp button links to `wa.me/639171234567` — update to the real number.
- The Google Maps embed uses a generic Katipunan Avenue query — swap in your
  exact address or a proper embed link from Google Maps' "Share → Embed a map".
