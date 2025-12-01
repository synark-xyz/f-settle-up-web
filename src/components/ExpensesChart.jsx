import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../lib/utils';

const COLORS = ['#10b981', '#14b8a6', '#22d3ee', '#2dd4bf', '#0e7490', '#34d399', '#6ee7b7', '#064e3b', '#047857']; // Distinct green/teal shades

const ExpensesChart = ({ cards }) => {
    // Aggregate data by category
    const data = cards.reduce((acc, card) => {
        const category = card.category || 'Personal';
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.value += parseFloat(card.statementBalance) || 0;
        } else {
            acc.push({ name: category, value: parseFloat(card.statementBalance) || 0 });
        }
        return acc;
    }, []);

    // If no data, show placeholder
    if (data.length === 0 || data.every(d => d.value === 0)) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                No expense data available
            </div>
        );
    }

    return (
        <div className="h-72 w-full min-h-[288px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={288}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpensesChart;
