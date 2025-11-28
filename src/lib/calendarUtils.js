/**
 * Generate Google Calendar URL with pre-filled event details
 * @param {object} eventData - Event details
 * @param {string} eventData.title - Event title
 * @param {string} eventData.description - Event description
 * @param {Date} eventData.startTime - Start time
 * @param {Date} eventData.endTime - End time (optional)
 * @returns {string} Google Calendar URL
 */
export const generateGoogleCalendarUrl = (eventData) => {
    const { title, description, startTime, endTime } = eventData;

    // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
    const formatDateForGoogle = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const start = formatDateForGoogle(startTime);
    const end = endTime ? formatDateForGoogle(endTime) : formatDateForGoogle(new Date(startTime.getTime() + 60 * 60 * 1000)); // +1 hour default

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: description || '',
        dates: `${start}/${end}`
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate .ics file content for calendar import
 * @param {object} eventData - Event details
 * @param {string} eventData.title - Event title
 * @param {string} eventData.description - Event description
 * @param {Date} eventData.startTime - Start time
 * @param {Date} eventData.endTime - End time (optional)
 * @returns {string} ICS file content
 */
export const generateIcsFile = (eventData) => {
    const { title, description, startTime, endTime } = eventData;

    // Format dates for iCalendar (YYYYMMDDTHHmmssZ)
    const formatDateForIcs = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const start = formatDateForIcs(startTime);
    const end = endTime ? formatDateForIcs(endTime) : formatDateForIcs(new Date(startTime.getTime() + 60 * 60 * 1000));

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SettleUp//Credit Card Payment Reminder//EN',
        'BEGIN:VEVENT',
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description || ''}`,
        `UID:${Date.now()}@settleup.app`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${title}`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
};

/**
 * Download ICS file
 * @param {string} icsContent - ICS file content
 * @param {string} filename - File name
 */
export const downloadIcsFile = (icsContent, filename = 'payment-reminder.ics') => {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
