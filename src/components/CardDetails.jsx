import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { formatCurrency, formatDate, getDaysUntilLabel } from '../lib/utils';
import { CreditCard, Calendar, Bell, Edit3, Trash2, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, getAppId } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const CardDetails = ({ card, isOpen, onClose, onDelete }) => {
    const { user } = useAuth();
    const [note, setNote] = useState(card?.notes || '');
    const [isEditingNote, setIsEditingNote] = useState(false);

    if (!card) return null;

    const handleSaveNote = async () => {
        if (!user) return;
        const appId = getAppId();
        const collectionPath = appId === 'default'
            ? `users/${user.uid}/creditCards`
            : `artifacts/${appId}/users/${user.uid}/creditCards`;

        try {
            await updateDoc(doc(db, collectionPath, card.id), {
                notes: note
            });
            setIsEditingNote(false);
        } catch (e) {
            console.error("Error updating note", e);
        }
    };

    const handleReminder = () => {
        // Simulation of push notification/email
        alert(`Reminder set! We'll notify you 3 days before ${formatDate(card.dueDate)}.`);
    };

    return (
        <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-white dark:bg-dark-surface flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none border-t border-gray-200 dark:border-gray-800">
                    <div className="p-4 bg-white dark:bg-dark-surface rounded-t-[10px] flex-1 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 mb-8" />

                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.name}</h2>
                                    <span className="inline-block px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {card.category || 'Personal'}
                                    </span>
                                </div>
                                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Card Visual */}
                            <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="flex justify-between items-start mb-8">
                                    <CreditCard size={32} />
                                    <div className="text-right">
                                        <span className="block font-mono text-lg tracking-widest">{card.cardNumber || `**** ${card.last4 || '0000'}`}</span>
                                        <span className="text-xs opacity-70">{card.name}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs opacity-70 uppercase mb-1">Balance</p>
                                        <p className="text-2xl font-bold font-mono">{formatCurrency(card.statementBalance)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs opacity-70 uppercase mb-1">Expires</p>
                                        <p className="text-sm font-medium">{card.expiryDate || 'MM/YY'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={handleReminder}
                                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                    <Bell size={18} />
                                    Set Reminder
                                </button>
                                <button
                                    onClick={() => onDelete(card.id)}
                                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    Delete Card
                                </button>
                            </div>

                            {/* Details List */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{getDaysUntilLabel(0)}</span> {/* Logic needs passing days */}
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500 dark:text-gray-400">Minimum Payment</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(card.minimumPayment)}</span>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Edit3 size={14} /> Notes
                                    </h3>
                                    {!isEditingNote && (
                                        <button onClick={() => setIsEditingNote(true)} className="text-xs text-brand-primary font-medium">Edit</button>
                                    )}
                                </div>
                                {isEditingNote ? (
                                    <div>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="w-full p-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-lg text-sm mb-2 outline-none focus:border-brand-primary"
                                            rows="3"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setIsEditingNote(false)} className="text-xs text-gray-500">Cancel</button>
                                            <button onClick={handleSaveNote} className="text-xs bg-brand-primary text-white px-3 py-1 rounded-md">Save</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                                        {note || "No notes added."}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

export default CardDetails;
