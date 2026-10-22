# Chandan Sahaj JanSeva Kendra

Responsive static website starter with separate HTML, CSS and JavaScript files, plus Firebase Authentication and Firestore integration for the owner admin panel.

## Pages
- `index.html` — Home
- `services.html` — searchable/filterable services
- `about.html` — About the centre
- `contact.html` — contact details and WhatsApp enquiry form
- `admin.html` — owner service management dashboard

## Folder structure
- `css/style.css` — shared responsive styles
- `js/config.js` — contact details and Firebase web config
- `js/common.js` — navigation, WhatsApp, phone and footer utilities
- `js/home.js` — home page service cards
- `js/services.js` — service listing/search/filter
- `js/contact.js` — enquiry form to WhatsApp
- `js/admin.js` — Firebase owner login and service CRUD
- `firestore.rules` — owner-only writes and public reads for published services
- `vercel.json` — basic static hosting configuration

## Important before production
This is source code, not a deployed website. Firebase has not been connected because project-specific configuration is not available yet.

1. Create a Firebase project at https://console.firebase.google.com/
2. Register a Web App and copy its config into `js/config.js`.
3. Enable Authentication > Sign-in method > Email/Password.
4. In Authentication > Users, create the owner account for `adityasinghworks1612@gmail.com` and set the password privately in Firebase. Do not share the password in chat or put it in source code.
5. Verify that the owner email is verified. The Firestore rules require verified email.
6. Create Firestore database and deploy `firestore.rules` as its rules.
7. Configure Firestore database region carefully; it cannot easily be changed later.
8. Deploy the project folder to Vercel as a static site. No build command is needed; the project root is the folder containing `index.html`.
9. After deployment, test public pages, WhatsApp links, owner login, create/edit/publish/delete, and public visibility from another browser/device.

## Service data note
The public services page includes starter demo services. The admin panel is disabled until Firebase config is filled in. Once Firebase is connected, the admin panel reads/writes the Firestore `services` collection. Public services page currently reads browser-local demo edits, not Firestore records. To make Firebase-published services automatically appear to all visitors, a small public Firestore read integration still needs to be added to `js/services.js` and `js/home.js` after Firebase setup. Until that is completed, do not treat this starter as fully production-ready.

## Legal/operational note
This is an independent service-centre website, not an official government portal. Only advertise services the centre is authorized and actually able to provide. Do not collect Aadhaar numbers, OTPs, passwords or other sensitive details through the contact form.
