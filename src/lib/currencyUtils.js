// Currency data mapping currency codes to display information
export const CURRENCY_DATA = {
    USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
    JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    EUR: { symbol: '€', name: 'Euro', locale: 'de-DE' },
    GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
    INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    KRW: { symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
    BRL: { symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
    MXN: { symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK' },
    NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
    SEK: { symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
    NOK: { symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
    DKK: { symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
    PLN: { symbol: 'zł', name: 'Polish Złoty', locale: 'pl-PL' },
    THB: { symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
    ZAR: { symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
    BDT: { symbol: '৳', name: 'Bangladeshi Taka', locale: 'bn-BD' },
};

// Mapping of country codes to currency codes for auto-detection
export const COUNTRY_TO_CURRENCY = {
    US: 'USD',
    JP: 'JPY',
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    NL: 'EUR',
    BE: 'EUR',
    AT: 'EUR',
    PT: 'EUR',
    IE: 'EUR',
    GB: 'GBP',
    CA: 'CAD',
    AU: 'AUD',
    CN: 'CNY',
    IN: 'INR',
    KR: 'KRW',
    BR: 'BRL',
    MX: 'MXN',
    CH: 'CHF',
    SG: 'SGD',
    HK: 'HKD',
    NZ: 'NZD',
    SE: 'SEK',
    NO: 'NOK',
    DK: 'DKK',
    PL: 'PLN',
    TH: 'THB',
    ZA: 'ZAR',
    BD: 'BDT',
};

/**
 * Format a currency value for display
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (e.g., 'USD', 'JPY')
 * @returns {string} Formatted currency string
 */
export const formatCurrencyValue = (amount, currencyCode = 'USD') => {
    const currency = CURRENCY_DATA[currencyCode] || CURRENCY_DATA.USD;

    try {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
            maximumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
        }).format(amount);
    } catch {
        // Fallback if currency code is invalid
        return `${currency.symbol}${amount.toFixed(2)}`;
    }
};

/**
 * Get currency information
 * @param {string} currencyCode - The currency code
 * @returns {object} Currency info object with symbol, name, locale
 */
export const getCurrencyInfo = (currencyCode) => {
    return CURRENCY_DATA[currencyCode] || CURRENCY_DATA.USD;
};

/**
 * Get all available currency codes
 * @returns {string[]} Array of currency codes
 */
export const getAllCurrencies = () => {
    return Object.keys(CURRENCY_DATA);
};

/**
 * Detect country code from geolocation
 * @returns {Promise<string>} Country code (e.g., 'US', 'JP')
 */
export const detectCountryCode = async () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve('US'); // Default to US if geolocation not available
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Use reverse geocoding API to get country
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await response.json();
                    resolve(data.countryCode || 'US');
                } catch (error) {
                    console.error('Failed to detect country:', error);
                    resolve('US');
                }
            },
            () => {
                // Geolocation permission denied or error
                resolve('US');
            },
            { timeout: 5000 }
        );
    });
};

/**
 * Detect currency based on user's location
 * @returns {Promise<string>} Currency code (e.g., 'USD', 'JPY')
 */
export const detectCurrency = async () => {
    const countryCode = await detectCountryCode();
    return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
};
