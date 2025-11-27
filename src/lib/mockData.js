// Mock data for development mode
export const getMockCards = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);

    return [
        {
            id: 'mock-card-1',
            name: 'Chase Sapphire Reserve',
            last4: '8234',
            statementBalance: 2847.50,
            minimumPayment: 125.00,
            dueDate: nextWeek,
            category: 'Personal',
            notes: 'Primary card for travel rewards',
            createdAt: new Date()
        },
        {
            id: 'mock-card-2',
            name: 'American Express Gold',
            last4: '4567',
            statementBalance: 1234.75,
            minimumPayment: 50.00,
            dueDate: twoWeeks,
            category: 'Personal',
            notes: 'Used for dining and groceries',
            createdAt: new Date()
        },
        {
            id: 'mock-card-3',
            name: 'Citi Double Cash',
            last4: '9012',
            statementBalance: 567.00,
            minimumPayment: 25.00,
            dueDate: nextMonth,
            category: 'Family',
            notes: 'Shared family expenses',
            createdAt: new Date()
        }
    ];
};

export const MOCK_USER = {
    // uid: 'dev-mock-user', // Don't override UID to ensure Firestore permissions work
    email: 'john@settleup.com',
    displayName: 'John Doe',
    photoURL: null,
    isAnonymous: true
};
