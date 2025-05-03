// i18n/config.js - Configuration for internationalization

export const LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    locale: "en-US",
    flag: "/src/assets/flags/us.svg",
  },
  es: {
    code: "es",
    name: "Español",
    locale: "es-ES",
    flag: "/src/assets/flags/es.svg",
  },
  fr: {
    code: "fr",
    name: "Français",
    locale: "fr-FR",
    flag: "/src/assets/flags/fr.svg",
  },
  de: {
    code: "de",
    name: "Deutsch",
    locale: "de-DE",
    flag: "/src/assets/flags/de.svg",
  },
  ja: {
    code: "ja",
    name: "日本語",
    locale: "ja-JP",
    flag: "/src/assets/flags/jp.svg",
  },
};

export const DEFAULT_LANGUAGE = "en";

// Map of fallback languages for when a translation is missing
export const FALLBACKS = {
  es: "en",
  fr: "en",
  de: "en",
  ja: "en",
};

// Date and number formatting configurations for each locale
export const FORMATTING_CONFIG = {
  "en-US": {
    currency: {
      style: "currency",
      currency: "USD",
    },
    date: {
      short: {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      },
      medium: {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
      long: {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      },
    },
  },
  "es-ES": {
    currency: {
      style: "currency",
      currency: "EUR",
    },
    date: {
      short: {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      },
      medium: {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
      long: {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    },
  },
  "fr-FR": {
    currency: {
      style: "currency",
      currency: "EUR",
    },
    date: {
      short: {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      },
      medium: {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
      long: {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    },
  },
  "de-DE": {
    currency: {
      style: "currency",
      currency: "EUR",
    },
    date: {
      short: {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      },
      medium: {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
      long: {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    },
  },
  "ja-JP": {
    currency: {
      style: "currency",
      currency: "JPY",
      currencyDisplay: "symbol",
    },
    date: {
      short: {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
      medium: {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
      long: {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      },
    },
  },
};
