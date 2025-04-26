import { getRequestConfig } from "next-intl/server";
import { Locale, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./locales/${locale ?? "en"}.json`)).default,
    locale: locale ?? ("en" as Locale),
    timeZone: "Europe/Kiev",
  };
});

export { locales };
