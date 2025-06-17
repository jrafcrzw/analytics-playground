# 🧪 Analytics Playground

A minimal 3-page static website built as a **testing environment** for advanced web analytics and event-based tracking.

Hosted on Cloudflare Pages
[https://analytics-playground.stream/]

---

## 📦 Project Structure

- `/index.html` → **Home Page**  
  Includes a hero CTA, testimonial, and newsletter form.

- `/product.html` → **Product Page**  
  Mock digital product layout with an embedded checkout form (Google Forms).

- `/thank-you.html` → **Thank You Page**  
  Used for redirect-based conversion tracking.

- `/assets/product.png` → Product image used on the Product page.

---

## 🎯 Purpose

This site serves as a lightweight **analytics testing environment** designed to:

- Test and validate tracking setups using (client-side, server-side)
- Measure events like form submissions, button clicks, and page views
- Simulate a complete conversion funnel using embedded forms and thank-you redirects
- Test **pixel tracking setups** (e.g., Meta Pixel, TikTok Pixel) and experiment with event deduplication strategies
- Observe live behavior of GTM tag deployment and publishing latency

---

## 🚀 Deployment

Deployed with **Cloudflare Pages**.  
Connected to GitHub for auto-deploy on every push.

---

## ✅ GTM Integration

Google Tag Manager is **not embedded initially** to simulate a real-world analytics setup process.  
Tags will be added manually and tested live for proper loading, triggering, and debugging behavior.

---

## 🔧 Tech Stack

- HTML (vanilla, no framework)
- TailwindCSS (CDN)
- GTM & sGTM
- Stape.io
- Google Cloud Platform

---

## 💼 Use Cases

- Internal analytics sandbox for tracking and tag management
- Live testing of GTM, GA4, and **third-party pixels** (Meta, TikTok, etc.)
- Client-ready demo site for showcasing analytics workflows and GTM best practices
- Foundation for future testing of server-side tagging, consent mode, and CAPI (Conversion API) implementations

---

> Built and maintained by [@jrafcrzw](https://github.com/jrafcrzw)
