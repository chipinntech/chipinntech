# Chipinn Technologies Ltd — Unity Meters Web Application

The official web application and product showcase for **Chipinn Technologies Ltd**, featuring the flagship **Unity Meters** smart energy metering portfolio, **GridPulse™ AI** autonomous AMI, and solar net-metering infrastructure.

---

## 🚀 Quick Start (Development & Build)

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle (outputs to /dist)
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Hosting & Deployment Guide

This application is fully optimized and pre-configured for instant zero-configuration deployment to all major cloud hosting platforms:

### 1. Vercel (Recommended)
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select this repository and click **Deploy**.
> Pre-configured with [`vercel.json`](file:///c:/Users/silas/Desktop/chipinntech/vercel.json) for automatic SPA routing and asset edge-caching.

### 2. Netlify
- **Option A (Git)**: Import the repository on Netlify. Build command: `npm run build`, Publish directory: `dist`.
- **Option B (Drag & Drop)**: Run `npm run build`, then drag the generated `dist` folder into [app.netlify.com/drop](https://app.netlify.com/drop).
> Pre-configured with [`public/_redirects`](file:///c:/Users/silas/Desktop/chipinntech/public/_redirects).

### 3. Cloudflare Pages
1. Connect repository in the Cloudflare Dashboard under **Workers & Pages**.
2. Framework preset: **Vite**, Build command: `npm run build`, Output directory: `dist`.

### 4. cPanel / Apache / Traditional VPS
1. Run `npm run build`.
2. Upload all contents of the `dist/` directory into your `public_html` root folder.
> Pre-configured with [`.htaccess`](file:///c:/Users/silas/Desktop/chipinntech/public/.htaccess) for mod_rewrite SPA routing and cache headers.

---

## 🔍 Google Indexing & SEO Setup Checklist

All essential SEO assets and Google crawling configurations are pre-installed in the repository:

| Asset | File Location | Purpose |
| :--- | :--- | :--- |
| **Robots Rules** | [`public/robots.txt`](file:///c:/Users/silas/Desktop/chipinntech/public/robots.txt) | Explicitly instructs Googlebot & Bingbot to crawl the entire site and specifies sitemap location. |
| **XML Sitemap** | [`public/sitemap.xml`](file:///c:/Users/silas/Desktop/chipinntech/public/sitemap.xml) | Provides search engines with canonical URLs, image metadata, and priority tags. |
| **Structured Data** | [`index.html`](file:///c:/Users/silas/Desktop/chipinntech/index.html) | Rich `schema.org` JSON-LD data for **Organization**, **WebSite**, and **Product** rich snippets in Google SERPs. |
| **Open Graph & Twitter** | [`index.html`](file:///c:/Users/silas/Desktop/chipinntech/index.html) | High-resolution preview cards for LinkedIn, WhatsApp, Facebook, and X / Twitter. |
| **PWA Webmanifest** | [`public/site.webmanifest`](file:///c:/Users/silas/Desktop/chipinntech/public/site.webmanifest) | Enables mobile home-screen installability and Google mobile indexing. |

### Steps to Index on Google:
1. **Google Search Console**:
   - Go to [search.google.com/search-console](https://search.google.com/search-console).
   - Add your domain (`https://chipnntech.com`).
2. **Submit Sitemap**:
   - Under **Sitemaps**, enter `sitemap.xml` and click **Submit**.
3. **Request Immediate Indexing**:
   - In the top search bar ("Inspect any URL"), paste `https://chipnntech.com/`.
   - Click **"Test Live URL"** and then **"Request Indexing"**. Google will typically index the homepage within 24–48 hours.
4. **Verify Rich Snippets**:
   - Test your live URL on [search.google.com/test/rich-results](https://search.google.com/test/rich-results) to verify the structured data.
