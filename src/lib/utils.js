import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInCalendarDays } from "date-fns";
import { formatCurrencyValue } from './currencyUtils';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency with selected currency from context
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Optional currency code, defaults to USD for backward compatibility
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currencyCode = 'USD') {
    return formatCurrencyValue(amount, currencyCode);
}

export const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        // Handle both Firestore Timestamp and string dates
        const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
        return format(date, 'MMM d, yyyy');
    } catch {
        return dateString;
    }
};

export const getDaysUntil = (dateString) => {
    if (!dateString) return 0;
    try {
        const today = new Date();
        const targetDate = dateString.toDate ? dateString.toDate() : new Date(dateString);
        // Reset hours to compare calendar days only
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        return differenceInCalendarDays(targetDate, today);
    } catch {
        return 0;
    }
};

export const getDaysUntilLabel = (days) => {
    if (days === 0) return "Due Today";
    if (days === 1) return "Due Tomorrow";
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    return `${days} Days Left`;
};
