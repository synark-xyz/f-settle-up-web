import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getCurrencyInfo } from '../lib/currencyUtils';

const CurrencySelector = () => {
    const { selectedCurrency, availableCurrencies, setCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);

    const currentInfo = getCurrencyInfo(selectedCurrency);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-900 dark:text-white"
            >
                <span>{currentInfo.symbol} {selectedCurrency}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                        {availableCurrencies.map((code) => {
                            const info = getCurrencyInfo(code);
                            const isSelected = code === selectedCurrency;

                            return (
                                <button
                                    key={code}
                                    onClick={() => {
                                        setCurrency(code);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${isSelected ? 'bg-brand-primary/10 dark:bg-brand-primary/20' : ''
                                        }`}
                                >
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {info.symbol} {code}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {info.name}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-brand-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default CurrencySelector;
