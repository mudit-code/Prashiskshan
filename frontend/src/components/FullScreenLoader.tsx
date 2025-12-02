import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FullScreenLoader = () => {
    const messages = [
        "Fetching your data...",
        "Preparing your dashboard...",
        "Almost there..."
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentMessageIndex((prev) => {
                if (prev >= messages.length - 1) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            <div className="relative flex flex-col items-center">
                {/* Animated Spinner/Pulse */}
                <div className="relative w-24 h-24 mb-8">
                    <motion.div
                        className="absolute inset-0 border-4 border-primary-200 rounded-full"
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                        className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Text Carousel */}
                <div className="h-8 relative w-full text-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentMessageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="text-lg font-medium text-gray-700 absolute w-full"
                        >
                            {messages[currentMessageIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FullScreenLoader;
