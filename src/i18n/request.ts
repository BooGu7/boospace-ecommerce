// import { getRequestConfig } from "next-intl/server"
// import { defaultLocale } from "./config"

// export default getRequestConfig(async () => {
//   const locale = defaultLocale

//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default,
//   }
// })
import {getRequestConfig} from "next-intl/server";
import {defaultLocale} from "./config";

export default getRequestConfig(async ({locale}) => {
  return {
    locale: locale ?? defaultLocale,
    messages: (await import(`../../messages/${locale ?? defaultLocale}.json`)).default
  };
});