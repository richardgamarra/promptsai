import { defineConfig } from "@/lib/config";

// Set to true to use clone branding (hide prompts.chat repo branding)
const useCloneBranding = true;

export default defineConfig({
  // Branding - customize for white-label
  branding: {
    name: "PromptsAI",
    logo: "/logo.svg",
    logoDark: "/logo-dark.svg",
    favicon: "/logo.svg",
    description: "A curated library of AI prompts you can copy, adapt and put to work today.",
  },

  // Theme - design system configuration
  theme: {
    // Border radius: "none" | "sm" | "md" | "lg"
    radius: "sm",
    // UI style: "flat" | "default" | "brutal"
    variant: "default",
    // Spacing density: "compact" | "default" | "comfortable"
    density: "default",
    // Colors (hex or oklch)
    colors: {
      primary: "#22d3ee", // Cian de Infoplay
    },
  },

  // Authentication plugins
  auth: {
    // Available: "credentials" | "google" | "azure" | "github" | "apple" | "oidc" | "oauth" | custom
    // Use `providers` array to enable multiple auth providers
    providers: ["github", "google", "apple"],
    // Allow public registration (only applies to credentials provider)
    allowRegistration: false,
  },

  // Internationalization
  i18n: {
    locales: ["en", "tr", "es", "zh", "ja", "ar", "pt", "fr", "it", "de", "nl", "ko", "ru", "he", "el", "az", "fa"],
    defaultLocale: "en",
  },

  // Features
  features: {
    // Allow users to create private prompts
    privatePrompts: true,
    // Enable change request system for versioning
    changeRequests: true,
    // Enable categories
    categories: true,
    // Enable tags
    tags: true,
    // Enable AI-powered semantic search (requires OPENAI_API_KEY)
    aiSearch: true,
    // Enable AI-powered generation features (requires OPENAI_API_KEY)
    aiGeneration: true,
    // Enable MCP (Model Context Protocol) features including API key generation
    mcp: true,
    // Enable comments on prompts
    comments: true,
  },

  // Homepage customization
  homepage: {
    // Set to true to hide prompts.chat repo branding and use your own branding
    useCloneBranding,
    achievements: {
      enabled: !useCloneBranding,
    },
    sponsors: {
      enabled: !useCloneBranding,
      // Vaciado a proposito: los patrocinadores de arriba eran los del
      // proyecto original y sus enlaces llevaban utm_source=prompts.chat.
      items: [],
    },
  },
});
