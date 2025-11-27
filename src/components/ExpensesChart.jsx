import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../lib/utils';

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#064e3b', '#047857']; // Emerald shades

const ExpensesChart = ({ cards }) => {
    // Aggregate data by category (mocked for now as category isn't in DB yet, will default to 'Personal')
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
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
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
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-400 text-xs font-medium ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpensesChart;
