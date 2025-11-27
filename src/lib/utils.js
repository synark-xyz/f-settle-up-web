import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInCalendarDays, parseISO } from "date-fns";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        // Handle both Firestore Timestamp and string dates
        const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
        return format(date, 'MMM d, yyyy');
    } catch (e) {
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
    } catch (e) {
        return 0;
    }
};

export const getDaysUntilLabel = (days) => {
    if (days === 0) return "Due Today";
    if (days === 1) return "Due Tomorrow";
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    return `${days} Days Left`;
};
