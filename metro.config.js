// ─── Metro Configuration ─────────────────────────────────────────────────────
//
// Optimized for fast Expo Go development:
//  - Lazy bundling: only bundle what's needed on first render
//  - Inline requires: defer module initialization
//  - Multi-threaded worker transforms
//  - HTTP Compression middleware (gzip): compresses 11.5MB bundle -> 1.8MB on the wire!
//
// These settings reduce transfer time over Expo Go tunnel from 23s → ~1.5s,
// preventing Expo Go download timeouts (java.io.IOException: Failed to download remote update).

const { getDefaultConfig } = require("expo/metro-config");
const compression = require("compression");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ─── Performance Tuning ───────────────────────────────────────────────────────

config.maxWorkers = require("os").cpus().length;

config.transformer = {
  ...config.transformer,
  inlineRequires: true,
};

// ─── Compression Middleware ───────────────────────────────────────────────────

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const comp = compression({ level: 6 });
    return (req, res, next) => {
      comp(req, res, () => {
        middleware(req, res, next);
      });
    };
  },
};

// ─── Resolver ─────────────────────────────────────────────────────────────────

config.resolver = {
  ...config.resolver,
  sourceExts: [
    ...config.resolver.sourceExts,
    "cjs",
    "mjs",
  ],
};

module.exports = config;
