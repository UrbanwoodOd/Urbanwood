import { getRequestConfig, RequestConfig } from "next-intl/server";

export const locales = ["en", "uk", "ru"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./locales/${locale}.json`)).default,
    locale: locale as Locale,
  } satisfies RequestConfig;
});
