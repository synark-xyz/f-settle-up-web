import { describe, it, expect } from 'vitest';
import { parseStatement } from './StatementParser';

describe('StatementParser', () => {
    it('should correctly parse a valid string', () => {
        const input = "Name: Chase | Due Date: 2025-12-15 | Min: 50 | Balance: 1200";
        const result = parseStatement(input);

        expect(result).toEqual({
            name: 'Chase',
            dueDate: '2025-12-15',
            minimumPayment: '50',
            statementBalance: '1200'
        });
    });

    it('should return error for empty input', () => {
        const result = parseStatement('');
        expect(result.error).toBeDefined();
    });

    it('should return error for missing fields', () => {
        const input = "Name: Chase | Due Date: 2025-12-15";
        const result = parseStatement(input);
        expect(result.error).toBeDefined();
    });

    it('should handle case insensitivity and extra spaces', () => {
        const input = " name : Citi  | due date : 2025-01-01 | MIN : 25.50 | balance : 500.00 ";
        const result = parseStatement(input);

        expect(result).toEqual({
            name: 'Citi',
            dueDate: '2025-01-01',
            minimumPayment: '25.50',
            statementBalance: '500.00'
        });
    });
});
