/** Sitenin kanonik adresi; üretimde APP_URL ortam değişkeniyle verilir. */
export const SITE_URL = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
