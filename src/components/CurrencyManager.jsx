import React, { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getAllCurrencies, getCurrencyInfo } from '../lib/currencyUtils';

const CurrencyManager = () => {
    const { availableCurrencies, selectedCurrency, addCurrency, removeCurrency } = useCurrency();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const allCurrencies = getAllCurrencies();
    const filteredCurrencies = allCurrencies.filter((code) => {
        const info = getCurrencyInfo(code);
        const search = searchTerm.toLowerCase();
        return (
            code.toLowerCase().includes(search) ||
            info.name.toLowerCase().includes(search)
        ) && !availableCurrencies.includes(code);
    });

    const handleAddCurrency = (code) => {
        addCurrency(code);
        setIsModalOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Your Currencies</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-gradient text-white text-xs font-medium rounded-lg hover:shadow-md transition-all"
                >
                    <Plus size={14} />
                    Add Currency
                </button>
            </div>

            <div className="space-y-2">
                {availableCurrencies.map((code) => {
                    const info = getCurrencyInfo(code);
                    const isSelected = code === selectedCurrency;
                    const canRemove = code !== 'USD' && code !== selectedCurrency;

                    return (
                        <div
                            key={code}
                            className={`flex items-center justify-between p-3 rounded-lg border ${isSelected
                                    ? 'bg-brand-primary/10 border-brand-primary/30 dark:bg-brand-primary/20'
                                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{info.symbol}</div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {code}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {info.name}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isSelected && (
                                    <span className="text-xs px-2 py-1 bg-brand-primary text-white rounded-full">
                                        Selected
                                    </span>
                                )}
                                {canRemove && (
                                    <button
                                        onClick={() => removeCurrency(code)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Remove currency"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Currency Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-surface rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Add Currency</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSearchTerm('');
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Search Input */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search currencies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                                    autoFocus
                                />
                            </div>

                            {/* Currency List */}
                            <div className="max-h-96 overflow-y-auto space-y-1">
                                {filteredCurrencies.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                                        {searchTerm ? 'No currencies found' : 'All available currencies added'}
                                    </p>
                                ) : (
                                    filteredCurrencies.map((code) => {
                                        const info = getCurrencyInfo(code);
                                        return (
                                            <button
                                                key={code}
                                                onClick={() => handleAddCurrency(code)}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                            >
                                                <div className="text-xl">{info.symbol}</div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {code}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {info.name}
                                                    </div>
                                                </div>
                                                <Plus size={18} className="text-brand-primary" />
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencyManager;
