import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate, getDaysUntilLabel, cn } from '../lib/utils';
import { detectCardType, getCardLogo, getCardGradient } from '../lib/cardUtils';
import { CreditCard, MoreVertical } from 'lucide-react';

const CardStack = ({ cards, onCardClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!cards || cards.length === 0) {
        return (
            <div className="h-48 flex flex-col items-center justify-center bg-dark-card rounded-2xl border-2 border-dashed border-gray-700 text-gray-500">
                <CreditCard size={40} className="mb-2 opacity-50" />
                <p className="text-sm">No cards added yet</p>
            </div>
        );
    }

    return (
        <div
            className="relative mb-8 perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered(!isHovered)} // Toggle on tap for mobile
        >
            <div className={cn("relative transition-all duration-500 ease-out", isHovered ? "h-auto" : "h-56")}>
                <AnimatePresence>
                    {cards.map((card, index) => {
                        const cardType = detectCardType(card.last4 || card.cardNumber);
                        const gradient = getCardGradient(cardType);
                        const logo = getCardLogo(cardType);

                        // Stack logic
                        const offset = isHovered ? index * 180 : index * 12;
                        const scale = isHovered ? 1 : 1 - index * 0.03;
                        const zIndex = cards.length - index;
                        const rotateX = isHovered ? 0 : 3;

                        return (
                            <motion.div
                                key={card.id}
                                layoutId={card.id}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent container click
                                    onCardClick(card);
                                }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{
                                    opacity: 1,
                                    y: offset,
                                    scale: scale,
                                    zIndex: zIndex,
                                    rotateX: rotateX,
                                }}
                                whileHover={{
                                    scale: isHovered ? 1.02 : 1,
                                    rotateX: isHovered ? 2 : 0,
                                    rotateY: isHovered ? 2 : 0,
                                    transition: { duration: 0.2 }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                className={cn(
                                    "absolute top-0 left-0 w-full h-52 rounded-2xl p-6 shadow-2xl cursor-pointer overflow-hidden border border-white/10 backdrop-blur-sm transform-gpu",
                                    "bg-gradient-to-br",
                                    gradient
                                )}
                                style={{ transformOrigin: "top center" }}
                            >
                                <div className="flex justify-between items-start text-white relative z-10">
                                    <div>
                                        <h3 className="font-bold text-lg tracking-wide drop-shadow-md">{card.name}</h3>
                                        <p className="text-xs opacity-90 font-mono mt-1">**** **** **** {card.last4 || '0000'}</p>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                                        <img src={logo} className={cn("w-10 h-6", cardType === 'visa' && "invert")} alt={cardType} />
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs opacity-80 uppercase tracking-wider mb-1">Balance</p>
                                            <p className="text-2xl font-bold font-mono drop-shadow-md">{formatCurrency(card.statementBalance)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs opacity-80 uppercase tracking-wider mb-1">Due</p>
                                            <p className="text-sm font-semibold">{formatDate(card.dueDate)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated shine effect */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-0 pointer-events-none"
                                    animate={isHovered ? { opacity: [0, 0.3, 0] } : { opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                />

                                {/* Static subtle shine */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CardStack;
