import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * ReminderDialog - A common dialog/modal for setting reminders using Google Calendar.
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {function} onClose - Function to close the dialog
 * @param {object} payment - Payment object with title, dueDate, description
 */
const ReminderDialog = ({ isOpen, onClose, payment }) => {
  React.useEffect(() => {
    if (isOpen) {
      console.log('ReminderDialog opened', payment);
    }
  }, [isOpen, payment]);

  if (!isOpen) return null;

  // Fallback payment object
  const safePayment = payment || { title: 'Payment Due', dueDate: '', description: 'Upcoming payment reminder from SettleUp' };

  // Google Calendar event creation URL
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(safePayment.title);
    const details = encodeURIComponent(safePayment.description);
    const startDate = safePayment.dueDate
      ? new Date(safePayment.dueDate).toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, 15)
      : '';
    // All-day event
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startDate}/${startDate}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-dark-card rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/10 relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-emerald-400 p-2 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-white mb-2">Set Reminder</h2>
          <p className="text-sm text-gray-400 mb-6">
            Add a reminder for <span className="text-emerald-400 font-semibold">{safePayment.title}</span> due on <span className="text-emerald-400 font-semibold">{safePayment.dueDate || 'N/A'}</span>.
          </p>
          {!safePayment.dueDate && (
            <div className="text-red-400 text-xs mb-4">No due date found for this payment. Please check the card data.</div>
          )}
          <button
            onClick={() => {
              window.open(getGoogleCalendarUrl(), '_blank', 'noopener,noreferrer');
            }}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all"
          >
            Add to Google Calendar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReminderDialog;
