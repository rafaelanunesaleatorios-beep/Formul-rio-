import { createApiApp } from "../server/_core/app";

// Vercel mounts this Express-compatible handler under /api/*.
export default createApiApp();
