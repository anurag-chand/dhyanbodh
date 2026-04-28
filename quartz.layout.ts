import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// ─────────────────────────────────────────────────────────────────────────────
// DhyanBodh — ध्यानबोध | Awakening Through Meditation
// Quartz v4 Layout Configuration
// ─────────────────────────────────────────────────────────────────────────────

// Components shared across ALL pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "About Us": "/about",
      "Contact Us": "/contact",
      "RSS Feed": "/index.xml",
    },
  }),
}

// Components for pages that display a single note / article
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({
        spacerSymbol: "॰",
        rootName: "DhyanBodh",
        resolveFrontmatterTitle: true,
        hideOnRoot: true,
        showCurrentPage: true,
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({
      showReadingTime: true,
      showComma: true,
    }),
    Component.TagList(),
  ],

  left: [
    // 🪷 Site logo + name (configure pageTitle in quartz.config.ts)
    Component.PageTitle(),

    Component.MobileOnly(Component.Spacer()),

    // Search + Darkmode + Reader mode row
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),

    // Folder / note tree explorer
    Component.Explorer({
      title: "🪷 Explore",
      folderClickBehavior: "collapse",
      folderDefaultState: "collapsed",
      useSavedState: true,
    }),
  ],

  right: [
    // Table of contents — for long dharma texts
    Component.TableOfContents(),

    // Knowledge graph — connections between spiritual concepts
    Component.Graph(),

    // Backlinks — other notes referencing this page
    Component.Backlinks(),

    // Recent notes — latest additions to the digital ashram
    Component.RecentNotes({
      title: "Recently Added",
      limit: 5,
      showTags: true,
    }),
  ],
}

// Components for pages that display lists (e.g. tags, folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      spacerSymbol: "॰",
      rootName: "DhyanBodh",
      hideOnRoot: true,
      showCurrentPage: true,
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],

  left: [
    Component.PageTitle(),

    Component.MobileOnly(Component.Spacer()),

    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),

    Component.Explorer({
      title: "🪷 Explore",
      folderClickBehavior: "collapse",
      folderDefaultState: "collapsed",
      useSavedState: true,
    }),
  ],

  right: [],
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP NOTES — add these to quartz.config.ts
// ─────────────────────────────────────────────────────────────────────────────
//
//   pageTitle: "🪷 DhyanBodh",
//   pageTitleSuffix: " — ध्यानबोध",
//
// Recommended Google Fonts (theme → typography):
//   header : "Mukta"          ← Clean, highly readable bilingual font
//   body   : "Mukta"          ← Bilingual Hindi/Latin body font
//   code   : "JetBrains Mono"
//
// Recommended colors (theme → colors):
//   lightMode → light: "#FAF7F2", secondary: "#7B5E3C", tertiary: "#C8832A"
//   darkMode  → light: "#1A1208", secondary: "#D4A050", tertiary: "#E8720C"
