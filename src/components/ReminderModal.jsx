import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Download } from 'lucide-react';
import { generateGoogleCalendarUrl, generateIcsFile, downloadIcsFile } from '../lib/calendarUtils';
import { formatCurrency, formatDate } from '../lib/utils';

const ReminderModal = ({ card, isOpen, onClose }) => {
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('10:00');

    // Set default reminder date to 1 day before due date
    React.useEffect(() => {
        if (isOpen && card && card.dueDate) {
            const dueDate = card.dueDate.toDate ? card.dueDate.toDate() : new Date(card.dueDate);
            const reminderDate = new Date(dueDate);
            reminderDate.setDate(reminderDate.getDate() - 1);
            setReminderDate(reminderDate.toISOString().split('T')[0]);
        }
    }, [card, isOpen]);

    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-surface rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Set Payment Reminder</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Card Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">{card.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Due: {formatDate(card.dueDate)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Amount: {formatCurrency(card.statementBalance)}
                        </p>
                    </div>

                    {/* Date & Time Picker */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reminder Date
                            </label>
                            <input
                                type="date"
                                value={reminderDate}
                                onChange={(e) => setReminderDate(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reminder Time
                            </label>
                            <input
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleAddToGoogleCalendar}
                            disabled={!reminderDate}
                            className="w-full flex items-center justify-center gap-2 bg-brand-gradient text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-brand-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CalendarIcon size={20} />
                            Add to Google Calendar
                        </button>

                        <button
                            onClick={handleDownloadIcs}
                            disabled={!reminderDate}
                            className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={20} />
                            Download .ics File
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Reminder will be set for 1 day before the due date by default
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReminderModal;
