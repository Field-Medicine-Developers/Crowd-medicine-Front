import { createI18n } from 'vue-i18n';

function loadLocaleMessages() {
    const locales = require.context('@/locales', true, /\.json$/);
    const messages = {};
    locales.keys().forEach(key => {
        const locale = key.replace('./', '').replace('.json', '');
        messages[locale] = locales(key);
    });
    return messages;
}

// Function to determine text direction based on locale
function getTextDirection(locale) {
    const rtlLocales = ['ar', 'fa', 'he', 'ur']; // Add more RTL languages as needed
    return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

const i18n = createI18n({
    locale: 'ar', 
    fallbackLocale: 'en', 
    messages: loadLocaleMessages(),
    numberFormats: {
        'ar': {
            currency: {
                style: 'currency',
                currency: 'SAR'
            }
        },
        'en': {
            currency: {
                style: 'currency',
                currency: 'USD'
            }
        }
    },
    datetimeFormats: {
        'ar': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        },
        'en': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        }
    }
});

// Dynamically set document direction
function setDocumentDirection(locale) {
    const direction = getTextDirection(locale);
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
}

// Initial direction set
setDocumentDirection(i18n.global.locale);

// Watch for locale changes
i18n.global.onLanguageChange = (newLocale) => {
    setDocumentDirection(newLocale);
};

export default i18n;