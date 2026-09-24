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
  apiKey: "AIzaSyBYnHcCkxx46ZgPKhm4uiDtPF2mXpZvCPc",
  authDomain: "mentors-plus-hf.firebaseapp.com",
  projectId: "mentors-plus-hf",
  storageBucket: "mentors-plus-hf.firebasestorage.app",
  messagingSenderId: "571642442785",
  appId: "1:571642442785:web:5b47e40077e483f1761f60",
  measurementId: "G-M4KSZWSJL7"
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
// Cloud name used to build tutor photo URLs, e.g.:
// https://res.cloudinary.com/CLOUDINARY_CLOUD_NAME/image/upload/v1/tutors/name.jpg
const CLOUDINARY_CLOUD_NAME = "t1fmhszm";
// Unsigned upload preset — only needed if/when the admin panel gets a direct
// photo-upload feature (not built yet; photos are still added manually via
// the Cloudinary Media Library, per the README's step 2).
const CLOUDINARY_UPLOAD_PRESET = "okansgjk";
