# Zoran Rusmir — Photography Portfolio & Blog

A personal photography portfolio and blog website with an admin panel for managing gallery photos and blog posts.

**Live Site:** [https://vlatkotrpkovski.github.io/ZoranRusmirPhotography/](https://vlatkotrpkovski.github.io/ZoranRusmirPhotography/)  
**Admin Panel:** [https://vlatkotrpkovski.github.io/ZoranRusmirPhotography/admin.html](https://vlatkotrpkovski.github.io/ZoranRusmirPhotography/admin.html)

---

## ✅ What Has Been Accomplished

### 1. Public Portfolio Website (`index.html`)
- **Hero Section** — Full-screen landing with name, tagline, and animated scroll indicator
- **About / CV Section** — Photo placeholder, bio, work experience (Freelance Photographer & Studio Photographer), and skills/tools tags
- **Portfolio Gallery** — 6 placeholder gallery items with category filters (All / Landscape / Portrait / Street), hover overlays, and a lightbox image viewer
- **Blog Section** — 3 placeholder blog post cards with hover animations
- **Contact Section** — Contact info + a demo contact form
- **Footer** — Copyright notice

### 2. Multi-Language Support (EN / DE-AT / SR)
- Language switcher in the navbar with three buttons: **EN**, **DE** (Austrian German), **SR** (Serbian Cyrillic)
- All text on the page is fully translated across all three languages
- Language preference is saved in `localStorage` and persists across visits

### 3. Admin Panel (`admin.html`)
- **Login screen** — Email/password authentication (Firebase Auth)
- **Gallery management tab** — Upload photos with title, category selection, drag & drop file picker, upload progress bar
- **Blog management tab** — Create blog posts with title, content, optional cover image
- **Delete functionality** — Remove any photo or blog post
- **Toast notifications** — Success/error feedback
- **Responsive design** — Works on mobile and desktop

### 4. Dynamic Content Loading
- The public site (`script.js`) automatically fetches photos and blog posts from Firebase Firestore
- If Firebase is not configured yet, the site gracefully falls back to the static placeholder content
- Gallery filters and lightbox work with both static and dynamic content

### 5. Design & UX
- Dark/moody theme with gold accent color (`#c9a96e`)
- Fully responsive (mobile hamburger menu, stacking grids)
- Scroll animations (fade-in on scroll via Intersection Observer)
- Active nav link highlighting on scroll
- Google Fonts (Playfair Display + Inter)

---

## 📁 Project Files

| File | Description |
|---|---|
| `index.html` | Public portfolio website |
| `styles.css` | Public site styling |
| `script.js` | Public site logic (i18n, filters, lightbox, Firebase dynamic loading) |
| `admin.html` | Admin login + dashboard page |
| `admin.css` | Admin panel styling |
| `admin.js` | Admin logic (auth, uploads, CRUD operations) |
| `firebase-config.js` | Firebase project configuration (⚠️ needs your keys) |

---

## 🔧 What You Still Need To Do

### Step 1: Create a Firebase Project
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it something like `zoran-rusmir-portfolio`
4. Disable Google Analytics (not needed) → **Create Project**

### Step 2: Register a Web App
1. In your Firebase project, click the **web icon (`</>`)** to add a web app
2. Give it a nickname (e.g., `portfolio`)
3. **Do NOT** check "Firebase Hosting" (you're using GitHub Pages)
4. Click **Register app**
5. You'll see a `firebaseConfig` object — **copy those values**

### Step 3: Update `firebase-config.js`
Open `firebase-config.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",           // ← your actual API key
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### Step 4: Enable Authentication
1. In Firebase Console → **Authentication** → **Get started**
2. Click **Email/Password** → **Enable** → **Save**
3. Go to **Users** tab → **Add user**
4. Enter your admin email and a strong password
5. This will be your only login for the admin panel

### Step 5: Enable Cloud Firestore
1. In Firebase Console → **Firestore Database** → **Create database**
2. Select either mode (test or production — it doesn't matter, you'll replace the rules immediately)
3. Choose a location closest to you (e.g., `europe-west1`)
4. Once created, go to the **Rules** tab and **replace everything** with these custom rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

### Step 6: Upload Updated Files to GitHub
Upload all 8 files from the `portfolio/` folder to your GitHub repo (`ZoranRusmirPhotography`), replacing the existing ones. The site will update within 1-2 minutes.

### Step 7: Test the Admin Panel
1. Go to `https://vlatkotrpkovski.github.io/ZoranRusmirPhotography/admin.html`
2. Log in with the email/password you created in Step 4
3. Upload a photo — it should appear on the public site
4. Create a blog post — it should appear on the public site

---

## 🔒 Security Notes

- **Firestore rules** allow anyone to **read** content (public portfolio) but only authenticated users can **write** (upload/delete)
- **Images are stored as Base64** directly in Firestore — no Firebase Storage or Blaze plan needed (completely free, no credit card)
- Images are automatically compressed to max 1200px width and JPEG quality 70% to stay within Firestore's 1MB document limit
- Only the single admin user you create in Firebase can log in and manage content
- The Firebase API key in `firebase-config.js` is safe to expose in client-side code — Firebase security rules protect your data, not the API key

---

## 🚀 Optional Future Enhancements

- [ ] Add real photos to replace placeholders
- [ ] Buy a custom domain (e.g., `rusmirphotography.com`) and configure in GitHub Pages settings
- [ ] Add multilingual support for dynamic content (blog posts in EN/DE/SR)
- [ ] Add image compression before upload in admin panel
- [ ] Add an "Edit" feature for existing blog posts
- [ ] Add SEO meta tags and Open Graph tags for social sharing
- [ ] Add a cookie consent banner (if required for your region)

