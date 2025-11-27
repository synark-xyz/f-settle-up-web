export const parseStatement = (text) => {
    // Format: Name: Card Name | Due Date: YYYY-MM-DD | Min: 123.45 | Balance: 987.65
    const result = {
        name: '',
        dueDate: '',
        minimumPayment: '',
        statementBalance: ''
    };

    if (!text) return { error: "Empty input" };

    try {
        const parts = text.split('|').map(p => p.trim());

        parts.forEach(part => {
            const [key, value] = part.split(':').map(s => s.trim());

            if (key.toLowerCase().includes('name')) {
                result.name = value;
            } else if (key.toLowerCase().includes('due date')) {
                result.dueDate = value;
            } else if (key.toLowerCase().includes('min')) {
                result.minimumPayment = value;
            } else if (key.toLowerCase().includes('balance')) {
                result.statementBalance = value;
            }
        });

        // Basic validation
        if (!result.name || !result.dueDate || !result.minimumPayment || !result.statementBalance) {
            return { error: "Missing required fields. Format: Name: ... | Due Date: ... | Min: ... | Balance: ..." };
        }

        return result;

    } catch (e) {
        return { error: "Parsing error. Ensure format matches: Name: ... | Due Date: ... | Min: ... | Balance: ..." };
    }
};
