---
title: "Technical Updates: Sidebar, Footer & Table of Contents"
date: 2026-04-28
tags:
  - meta
  - design
  - quartz
---

# Technical Updates: Sidebar, Footer & Navigation

This document outlines the changes made to improve the site's layout, navigation, and overall user experience for the DhyanBodh project.

## 1. Sidebar (Explorer) Enhancements

The primary goal was to reduce clutter and make long page titles easier to distinguish.

### Vertical Spacing & Padding
- **File:** `quartz/components/styles/explorer.scss`
- **Change:** Increased the `margin-bottom` on both individual page links and folder containers.
- **Effect:** Each item now has "breathing room," preventing text from different articles from overlapping visually.

### Visual Arrow Indicators
- **Change:** Added a CSS pseudo-element `::before` using the chevron arrow (**›**) to all page links.
- **Effect:** Provides a clean navigational cue and helps distinguish separate articles.

---

## 2. Footer Simplification

We streamlined the footer to maintain a clean, focused aesthetic.

- **File:** `quartz.layout.ts` & `quartz/components/Footer.tsx`
- **Minimalist Design:** Removed the default Quartz version attribution and copyright year.
- **Curated Links:** The footer now only contains three essential links:
  - **About Us** (`/about`)
  - **Contact Us** (`/contact`)
  - **RSS Feed** (`/index.xml`)

---

## 3. Table of Contents (TOC) Optimization

Fixed issues where the TOC was not appearing and improved its behavior.

- **Frontmatter Support:** Added support for `showToc: true` in addition to the default `enableToc`.
- **Heading Depth:** Increased `maxDepth` to 6 to ensure `###` and deeper headings are captured.
- **Visibility:** Removed the `DesktopOnly` wrapper, making the TOC visible on mobile and tablet devices.
- **Threshold:** Set `minEntries: 0` so the TOC appears even on pages with only one or two headings.
- **Priority:** Moved the TOC to the top of the right sidebar (above the Graph) for better accessibility.

---

## 4. Typography & Theme

Updated the site's fonts to improve readability for both Hindi and English.

- **Font Family:** **Mukta**
  - Switched from Yatra One/Hind to **Mukta** for both headers and body.
  - Mukta is a modern, versatile font specifically designed for excellent legibility in both Devanagari (Hindi) and Latin (English) scripts. It provides a much cleaner and more comfortable reading experience.

---

## 5. UI/UX Redesign

- **Home Page (`index.md`):** Implemented a hero section with centered branding and categorized wisdom paths using Quartz callouts.
- **About Page (`about.md`):** Added visual storytelling with header images and structured the content to define the vision of DhyanBodh clearly.
