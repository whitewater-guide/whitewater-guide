const rawBase = process.env.EXPO_PUBLIC_STATIC_CONTENT_URL_BASE ?? '';

export const STATIC_CONTENT_URL_BASE = rawBase.replace(/\/$/, '');
