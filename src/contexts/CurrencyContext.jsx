import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectCurrency } from '../lib/currencyUtils';
import { useFirebaseSettings } from '../hooks/useFirebaseSettings';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    // Use Firebase settings hook for persistence
    const [selectedCurrency, setSelectedCurrency] = useFirebaseSettings('currency_selected', 'USD');
    const [availableCurrencies, setAvailableCurrencies] = useFirebaseSettings('currency_available', ['USD']);

    const [detectedCurrency, setDetectedCurrency] = useState(null);
    const [isDetecting, setIsDetecting] = useState(true);

    // Detect currency on first load
    useEffect(() => {
        const initCurrency = async () => {
            // If we already have currencies loaded from Firebase/Local, skip detection logic
            // unless it's the very first run (which we can't easily distinguish without another flag)
            // For now, let's just detect and see if we need to add it.

            try {
                const detected = await detectCurrency();
                setDetectedCurrency(detected);

                // If detected currency is not in available list, add it
                if (!availableCurrencies.includes(detected)) {
                    // We don't auto-add here to avoid overwriting user preference sync
                    // But we could prompt or just leave it to user
                }

                // If no selected currency (shouldn't happen due to default), set it
                if (!selectedCurrency) {
                    setSelectedCurrency('USD');
                }
            } catch (error) {
                console.error('Currency detection failed:', error);
            } finally {
                setIsDetecting(false);
            }
        };

        initCurrency();
    }, []);

    const setCurrency = (currencyCode) => {
        setSelectedCurrency(currencyCode);
    };

    const addCurrency = (currencyCode) => {
        if (!availableCurrencies.includes(currencyCode)) {
            const updated = [...availableCurrencies, currencyCode];
            setAvailableCurrencies(updated);
        }
    };

    const removeCurrency = (currencyCode) => {
        // Cannot remove USD or currently selected currency
        if (currencyCode === 'USD' || currencyCode === selectedCurrency) {
            return;
        }

        const updated = availableCurrencies.filter(c => c !== currencyCode);
        setAvailableCurrencies(updated);
    };

    const value = {
        selectedCurrency,
        availableCurrencies,
        detectedCurrency,
        isDetecting,
        setCurrency,
        addCurrency,
        removeCurrency,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
