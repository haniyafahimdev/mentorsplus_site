# Mentor's Plus — setup guide

Static HTML/CSS/JS site, ready to deploy to Vercel. The booking form, contact
form, and admin panel are **built but stubbed** — the Firebase calls are
written and commented out in each file, waiting for your project keys.
Follow this guide top to bottom and you'll go from "stub" to "live."

## Files
- `index.html` — Homepage
- `courses.html` — Courses/services
- `tutors.html` — Tutor profiles (photos pulled from Cloudinary)
- `book.html` — Booking form → writes to the `bookings` Firestore collection
- `mock-tests.html` — Mock test offerings (links into `book.html`)
- `about.html` — About / story / map
- `contact.html` — Contact form → writes to the `inquiries` Firestore collection
- `admin.html` — Password-protected dashboard: **Bookings**, **Student
  Inquiries**, **Tutor Schedules** tabs
- `assets/config.js` — shared config (Firebase keys, Resend endpoint,
  Cloudinary cloud name). **Edit this first.**

## What the admin panel does right now vs. what's still manual

`admin.html` currently shows:
- **Bookings** — a live-looking table with Confirm/Decline buttons. Once
  Firebase is wired up (step 1 below), this reads from and writes back to
  the `bookings` collection — confirming or declining actually updates the
  student's booking status in Firestore.
- **Student Inquiries** — same idea, reading the `inquiries` collection.
- **Tutor Schedules** — this tab is currently a **hardcoded table**, not
  connected to Firestore. If you want tutors' weekly slots editable from
  the admin panel (instead of you hand-editing the HTML), let me know and
  I'll wire up a `schedules` collection the same way — it's not built yet.

Nothing above sends an email or persists anywhere until you complete step 1.

## 1. Firebase setup (bookings, inquiries, admin login)

1. Go to https://console.firebase.google.com → **Add project** (e.g.
   "mentorsplus-site").
2. In the project, go to **Build → Firestore Database** → **Create
   database** → start in **production mode** → pick a region close to the
   Philippines (e.g. `asia-southeast1`).
3. Go to **Build → Authentication** → **Get started** → enable the
   **Email/Password** sign-in method.
4. Still in Authentication, go to the **Users** tab → **Add user** → create
   the login the admin will use for `admin.html` (their real email +
   a password). This is the *only* account that will be able to log in.
5. Go to **Project settings** (gear icon, top left) → scroll to **Your
   apps** → click the `</>` (web) icon → register an app (any nickname) →
   copy the `firebaseConfig` object it shows you.
6. Open `assets/config.js` and replace the placeholder `firebaseConfig`
   object with the real one you just copied.

### Firestore security rules

In Firestore → **Rules** tab, replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      // anyone can submit a new booking request
      allow create: if request.resource.data.status == 'pending';
      // only the logged-in admin can read the list or change status
      allow read, update, delete: if request.auth != null;
    }
    match /inquiries/{inquiryId} {
      // anyone can submit a contact-form inquiry
      allow create: if request.resource.data.status == 'new';
      // only the logged-in admin can read or manage inquiries
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

This means: any visitor can submit a booking or a contact inquiry (as long
as it starts with the right status), but only the logged-in admin can see
the list, confirm/decline bookings, or manage inquiries. Click **Publish**
after pasting.

### Turn on the code

The Firebase calls are already written in each file — they're just
commented out so the site doesn't error out with placeholder keys. Once
`assets/config.js` has your real `firebaseConfig`:

**In `book.html`**, uncomment these lines near the top of the `<script
type="module">` block:
```html
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```
and further down, inside the form's submit handler:
```html
await addDoc(collection(db, "bookings"), { ...booking, createdAt: serverTimestamp() });
```

**In `contact.html`**, uncomment the same `import`/`initializeApp`/`getFirestore`
lines, and inside the submit handler:
```html
await addDoc(collection(db, "inquiries"), { ...inquiry, createdAt: serverTimestamp() });
```

**In `admin.html`**, uncomment:
```html
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```
and inside the login handler:
```html
await signInWithEmailAndPassword(auth, email.value, password.value);
```
and inside the logout handler:
```html
signOut(auth);
```

> Until you do this, `admin.html`'s login form accepts **any** email and
> password — there's no real check yet. Don't share the deployed URL
> publicly until this step is done.

The Bookings/Inquiries tables in `admin.html` are also still hardcoded demo
rows. Once Firebase Auth is wired up, ask and I'll wire the tables to read
live from Firestore (`getDocs`/`onSnapshot` on the `bookings` and
`inquiries` collections) — that's a separate step from just turning on
login.

## 2. Cloudinary setup (tutor photos — no card required)

1. Create a free account at https://cloudinary.com/users/register/free —
   email/Google/GitHub signup, no credit card needed.
2. On the Dashboard home page, copy your **Cloud Name** (shown near the top,
   under your account name).
3. Open `assets/config.js` and set `CLOUDINARY_CLOUD_NAME` to that value.
4. Go to your Cloudinary **Media Library** → upload each tutor's photo.
5. Open `tutors.html` and replace each placeholder `<img src="https://res.
   cloudinary.com/demo/...">` with your real Cloudinary URL, e.g.:
   ```
   https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_300,h_300,c_fill,g_face/tutor-maria.jpg
   ```
   (the `w_300,h_300,c_fill,g_face` part auto-crops to a square face-focused
   thumbnail — keep it, just swap the filename).

## 3. Resend setup (booking confirmation emails)

1. Create an account at https://resend.com.
2. Go to **API Keys** → **Create API Key** → copy it (you'll only see it
   once).
3. (Optional but recommended) Go to **Domains** → add and verify a domain
   for Mentorsplus, so emails come from something like
   `bookings@mentorsplusreview.com` instead of Resend's shared test domain.
   Until that's done, Resend can only send to your own verified email — fine
   for testing, not for real student emails.
4. Resend's key can never be called from the browser (it would be public),
   so create a small serverless function to hold it. In your project folder,
   create `api/send-confirmation.js`:
   ```js
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);

   export default async function handler(req, res) {
     const { to, name, course, date } = req.body;
     await resend.emails.send({
       from: "Mentor's Plus <bookings@mentorsplusreview.com>",
       to,
       subject: "Your session is booked!",
       html: `<p>Hi ${name}, your ${course} session on ${date} is confirmed. We'll follow up within 24 hours to finalize details.</p>`
     });
     res.status(200).json({ ok: true });
   }
   ```
5. In `book.html`, uncomment this block inside the submit handler (right
   after the `addDoc` line from step 1):
   ```html
   await fetch(BOOKING_CONFIRMATION_ENDPOINT, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ to: booking.email, name: booking.name, course: booking.course, date: booking.date })
   });
   ```

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo, then import it at
   https://vercel.com/new — or install the Vercel CLI and run `vercel` from
   this folder.
2. Add environment variables (Project → Settings → Environment Variables,
   or `vercel env add`):
   - `RESEND_API_KEY` — from step 3.2 above
3. Deploy. Vercel automatically detects `api/send-confirmation.js` as a
   serverless function — no extra config needed. This is a static site
   otherwise, so there's no build step.
4. (Optional) Add the real domain under Project → Settings → Domains.

## 5. Try it out

- Visit `/book.html`, submit a test booking with your own email — you
  should see it land in Firestore under `bookings`, and (once step 3 is
  done) get a confirmation email.
- Visit `/contact.html`, submit a test message — it should land in
  Firestore under `inquiries`.
- Log into `/admin.html` with the account you created in step 1.4 — confirm
  that a *wrong* password is rejected (this only works after step 1's
  "Turn on the code" section is done).

## 6. First-time content setup (do this once after deploying)

1. Replace the placeholder team bios/photos in `tutors.html` with the real
   tutor roster (see step 2 above for photos).
2. Double check the hours on `about.html` — currently a placeholder
   (Monday–Saturday, 9am–7pm) pending your confirmation of the real
   weekly schedule.
3. Update the social links in the footer (`#` placeholders for Facebook,
   Instagram, TikTok) across every page.
4. Confirm the WhatsApp number in the floating button and Contact page
   (`wa.me/639055264102`) is correct and WhatsApp-enabled.

## Still placeholder / not wired up
- Tutor Schedules tab in `admin.html` (hardcoded, not Firestore-backed —
  see note in section "What the admin panel does" above)
- Live reading of the Bookings/Inquiries tables in `admin.html` (needs the
  `getDocs`/`onSnapshot` wiring mentioned in step 1)
