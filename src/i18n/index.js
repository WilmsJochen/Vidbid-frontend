import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";

import nl from "./translations/nl";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: "nl",
        fallbackLng: process.env.NODE_ENV !== "production" ? "dev" : "nl",
        resources: {
            nl,
        },
        whitelist: [ "nl", "fr"],
        debug: process.env.NODE_ENV === "development",
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        }
    });

export default i18n;
