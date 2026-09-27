const strings = {
  en: {
    subtitle: "Full-page articles",
    settings: "Settings",
    global: "Auto-redirect",
    sites: "Supported sites",
    enabled: "Enabled",
    disabled: "Disabled",
    unavailable: "Unavailable",
    error: "Unable to load settings.",
    back: "Back to Articleall",
    siteSettings: "Site settings",
  },
  id: {
    subtitle: "Artikel satu halaman",
    settings: "Pengaturan",
    global: "Pengalihan otomatis",
    sites: "Situs yang didukung",
    enabled: "Aktif",
    disabled: "Nonaktif",
    unavailable: "Tidak tersedia",
    error: "Tidak dapat memuat pengaturan.",
    back: "Kembali ke Articleall",
    siteSettings: "Pengaturan situs",
  },
};

export function getTranslations(locale = globalThis.navigator?.language) {
  return strings[locale?.toLowerCase().startsWith("id") ? "id" : "en"];
}
