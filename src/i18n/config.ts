export const defaultLocale = "vn" as const
export const locales = ["en", "vn"] as const

export type Locale = (typeof locales)[number]
