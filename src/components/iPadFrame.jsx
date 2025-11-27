import React, { useState, useEffect } from 'react';

const iPadFrame = ({ children }) => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkIsDesktop();
        window.addEventListener('resize', checkIsDesktop);

        return () => window.removeEventListener('resize', checkIsDesktop);
    }, []);

    if (!isDesktop) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <div className="relative w-[768px] h-[1024px] bg-black rounded-[40px] shadow-2xl border-[12px] border-gray-800 overflow-hidden ring-4 ring-gray-900/50">
                {/* Camera Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-800 ml-4"></div>
                </div>

                {/* Screen Content */}
                <div className="w-full h-full bg-white dark:bg-dark-bg overflow-y-auto scrollbar-hide">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
            </div>
        </div>
    );
};

export default iPadFrame;
