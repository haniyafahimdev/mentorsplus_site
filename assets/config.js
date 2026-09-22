/* ============================================================
   MENTOR'S PLUS — integration config
   Fill in your real project keys before deploying. Nothing here
   is a working credential — these are placeholders.
   ============================================================ */

// ---- Firebase (bookings, admin auth, contact form storage) ----
// 1. Create a project at https://console.firebase.google.com
// 2. Enable Firestore (bookings + inquiries) and Authentication (Email/Password, for admin.html)
// 3. Paste your web app config below
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ---- Resend (booking confirmation emails) ----
// Resend's API key must NEVER be called from the browser (it would be public).
// Create a small serverless function (e.g. /api/send-confirmation on Vercel)
// that holds the RESEND_API_KEY as an environment variable, and call that
// endpoint from book.html instead of Resend directly. Example function:
//
//   // api/send-confirmation.js  (Vercel serverless function)
//   import { Resend } from 'resend';
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   export default async function handler(req, res) {
//     const { to, name, course, date } = req.body;
//     await resend.emails.send({
//       from: "Mentor's Plus <bookings@mentorsplus.com>",
//       to,
//       subject: "Your session is booked!",
//       html: `<p>Hi ${name}, your ${course} session on ${date} is confirmed.</p>`
//     });
//     res.status(200).json({ ok: true });
//   }
const BOOKING_CONFIRMATION_ENDPOINT = "/api/send-confirmation";

// ---- Cloudinary (tutor photos, gallery) ----
// Replace with your Cloudinary cloud name; images referenced as:
// https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/tutors/name.jpg
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";
