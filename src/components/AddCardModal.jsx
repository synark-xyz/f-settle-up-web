import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, CreditCard } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useCurrency } from '../contexts/CurrencyContext';
import { getCurrencyInfo } from '../lib/currencyUtils';

const AddCardModal = ({ isOpen, onClose, onAdd }) => {
    const { selectedCurrency } = useCurrency();
    const currencyInfo = getCurrencyInfo(selectedCurrency);
    const [mode, setMode] = useState('manual'); // manual, scan, upload
    const [formData, setFormData] = useState({
        name: '',
        dueDate: '',
        minimumPayment: '',
        statementBalance: '',
        category: 'Personal', // Personal, Family
        notes: '',
        cardNumber: '',
        expiryDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [error, setError] = useState('');
    const [ocrConfidence, setOcrConfidence] = useState(null);
    const videoRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles?.length) {
            handleImageUpload(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    // Clear form data when modal is opened
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                dueDate: '',
                minimumPayment: '',
                statementBalance: '',
                category: 'Personal',
                notes: '',
                cardNumber: '',
                expiryDate: ''
            });
            setError('');
            setOcrConfidence(null);
            setMode('manual');
        }
    }, [isOpen]);
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // Handler for credit card scanner
    const handleCardScan = (data) => {
        if (data) {
            setFormData(prev => ({
                ...prev,
                cardNumber: data.cardNumber || prev.cardNumber,
                expiryDate: data.expiryDate || prev.expiryDate,
                name: data.cardHolder || prev.name
            }));
            setMode('manual');
        }
    };

    const handleImageUpload = async (file) => {
        setLoading(true);
        setError('');
        try {
            const { processImageWithGemini } = await import('../lib/gemini');
            const result = await processImageWithGemini(file);
            if (result.error) {
                setError(result.error);
            } else {
                setFormData(prev => ({
                    ...prev,
                    name: result.name || prev.name,
                    dueDate: result.dueDate || prev.dueDate,
                    minimumPayment: result.minimumPayment || prev.minimumPayment,
                    statementBalance: result.statementBalance || prev.statementBalance,
                    last4: result.last4 || prev.last4
                }));
                setMode('manual');
            }
        } catch (e) {
            console.error("Image processing error", e);
            setError("Failed to process image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.statementBalance) {
            setError("Name and Balance are required.");
            return;
        }
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-surface rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Add New Card</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 max-h-[80vh] overflow-y-auto">
                    {/* Mode Selection */}
                    {mode === 'manual' && (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                onClick={() => setMode('scan')}
                                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <CreditCard className="mb-2 text-brand-primary" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Scan Card</span>
                            </button>
                            <div {...getRootProps()} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border-2 border-dashed border-transparent hover:border-brand-secondary">
                                <input {...getInputProps()} />
                                <Upload className="mb-2 text-brand-secondary" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Upload Image</span>
                            </div>
                        </div>
                    )}

                    {mode === 'scan' && (
                        <div className="mb-4">
                            <CreditCardScanner
                                onScan={handleCardScan}
                                onError={() => setError('Failed to scan card. Try again.')}
                            />
                            <button
                                onClick={() => setMode('manual')}
                                className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg"
                            >
                                <X size={20} /> Cancel
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-8 text-brand-primary animate-pulse">
                            <Sparkles size={32} className="mb-2" />
                            <p className="text-sm font-medium">{loadingStep || 'Processing...'}</p>
                        </div>
                    )}

                    {ocrConfidence && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${ocrConfidence === 'high' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                            ocrConfidence === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                                'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                            }`}>
                            <strong>Scan Quality: {ocrConfidence.toUpperCase()}</strong> - Please verify all fields below
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Card Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                placeholder="e.g. Chase Sapphire"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                    placeholder="MM/YY"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Family">Family</option>
                                    <option value="Misc">Misc</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Min Payment (Opt)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400">{currencyInfo.symbol}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="minimumPayment"
                                        value={formData.minimumPayment}
                                        onChange={handleChange}
                                        className="w-full pl-8 p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Balance</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400">{currencyInfo.symbol}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="statementBalance"
                                        value={formData.statementBalance}
                                        onChange={handleChange}
                                        className="w-full pl-6 p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="2"
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white resize-none"
                                placeholder="Add a note..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-primary/30 transition-all active:scale-95 mt-2"
                        >
                            Add Card
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;
