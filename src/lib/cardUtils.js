// Detect card type from card number
export const detectCardType = (cardNumber) => {
    if (!cardNumber) return 'unknown';

    const number = cardNumber.toString().replace(/\s/g, '');

    // Visa: starts with 4
    if (/^4/.test(number)) {
        return 'visa';
    }

    // Mastercard: starts with 51-55 or 2221-2720
    if (/^5[1-5]/.test(number) || /^2(2(2[1-9]|[3-9][0-9])|[3-6][0-9]{2}|7([01][0-9]|20))/.test(number)) {
        return 'mastercard';
    }

    // American Express: starts with 34 or 37
    if (/^3[47]/.test(number)) {
        return 'amex';
    }

    // Discover: starts with 6011, 622126-622925, 644-649, or 65
    if (/^6(011|5|4[4-9]|22(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))/.test(number)) {
        return 'discover';
    }

    // JCB: starts with 2131, 1800, or 35
    if (/^(2131|1800|35)/.test(number)) {
        return 'jcb';
    }

    // Diners Club: starts with 300-305, 36, or 38
    if (/^3(0[0-5]|[68])/.test(number)) {
        return 'diners';
    }

    return 'unknown';
};

// Get card type logo URL
export const getCardLogo = (cardType) => {
    const logos = {
        visa: 'https://www.svgrepo.com/show/362011/visa.svg',
        mastercard: 'https://www.svgrepo.com/show/362010/mastercard.svg',
        amex: 'https://www.svgrepo.com/show/266068/american-express.svg',
        discover: 'https://www.svgrepo.com/show/362337/discover.svg',
        jcb: 'https://www.svgrepo.com/show/266062/jcb.svg',
        diners: 'https://www.svgrepo.com/show/266069/diners-club.svg',
        unknown: 'https://www.svgrepo.com/show/508699/credit-card-alt-1.svg'
    };

    return logos[cardType] || logos.unknown;
};

// Get card gradient based on category
export const getCardGradient = (category) => {
    const gradients = {
        'Personal': 'from-emerald-600 to-teal-700', // Green
        'Family': 'from-amber-500 to-orange-600',   // Yellow/Orange
        'Other': 'from-rose-600 to-red-700',         // Red
        'default': 'from-blue-600 to-indigo-700'     // Default Blue
    };

    return gradients[category] || gradients.default;
};
