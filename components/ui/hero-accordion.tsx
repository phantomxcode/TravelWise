import React, { useState } from 'react';

// --- Travel-themed accordion data ---
const accordionItems = [
    {
        id: 1,
        title: 'Beach Paradise',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
    },
    {
        id: 2,
        title: 'Mountain Adventures',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 3,
        title: 'City Exploration',
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 4,
        title: 'Cultural Journey',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 5,
        title: 'Nature Escapes',
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop',
    },
];

interface AccordionItemData {
    id: number;
    title: string;
    imageUrl: string;
}

interface AccordionItemProps {
    item: AccordionItemData;
    isActive: boolean;
    onMouseEnter: () => void;
}

// --- Accordion Item Component ---
const AccordionItem: React.FC<AccordionItemProps> = ({ item, isActive, onMouseEnter }) => {
    return (
        <div
            className={`
        relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-full md:w-[350px]' : 'w-[80px] md:w-[60px]'}
      `}
            onMouseEnter={onMouseEnter}
        >
            {/* Background Image */}
            <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image';
                }}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Caption Text */}
            <span
                className={`
          absolute text-white text-base md:text-lg font-semibold whitespace-nowrap
          transition-all duration-500 ease-in-out drop-shadow-lg
          ${isActive
                        ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0 opacity-100'
                        : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 -rotate-90 opacity-80'
                    }
        `}
            >
                {item.title}
            </span>
        </div>
    );
};


interface HeroAccordionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
}

// --- Main Hero Accordion Component ---
export const HeroAccordion: React.FC<HeroAccordionProps> = ({
    title = "Your Next Adventure Starts Here",
    subtitle = "AI-Powered Travel Planning",
    description = "Create stunning itineraries, analyze your budget with AI, and discover new destinations — all in one beautiful app.",
    ctaText = "Start Planning",
    ctaLink = "/create"
}) => {
    const [activeIndex, setActiveIndex] = useState(2);

    const handleItemHover = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="bg-gradient-to-b from-slate-50 to-white">
            <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Side: Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            {subtitle}
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight fugaz-one-regular">
                            {title}
                        </h1>

                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                            {description}
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href={ctaLink}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105"
                            >
                                {ctaText}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <a
                                href="/trips"
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-8 py-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                            >
                                View My Trips
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Image Accordion */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-row items-center justify-center gap-2 md:gap-3 overflow-x-auto p-4">
                            {accordionItems.map((item, index) => (
                                <AccordionItem
                                    key={item.id}
                                    item={item}
                                    isActive={index === activeIndex}
                                    onMouseEnter={() => handleItemHover(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroAccordion;
