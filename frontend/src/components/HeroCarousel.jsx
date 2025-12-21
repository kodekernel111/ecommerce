import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';

import LazyImage from './LazyImage';

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);
    const [dynamicSlides, setDynamicSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const defaultSlides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
            title: 'Summer Sale',
            description: 'Up to 50% off on selected items.',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
            title: 'New Arrivals',
            description: 'Check out the latest trends.',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1472851294608-41552241e2cd?w=1200&q=80',
            title: 'Exclusive Deals',
            description: 'Limited time offers just for you.',
        },
    ];

    const activeSlides = dynamicSlides.length > 0 ? dynamicSlides : defaultSlides;

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // We use the public endpoint
                const response = await api.get('/public/homepage-config');
                if (response.data && response.data.heroSlides && response.data.heroSlides.length > 0) {
                    const mappedSlides = response.data.heroSlides.map(slide => ({
                        id: slide.id,
                        image: slide.imageUrl,
                        title: slide.heading,
                        description: slide.subtext,
                        buttonText: slide.buttonText
                    }));
                    setDynamicSlides(mappedSlides);
                }
            } catch (error) {
                console.error("Failed to fetch homepage config", error);
                // Fallback to default slides on error (or if 404)
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const prevSlide = () => {
        setCurrent(current === 0 ? activeSlides.length - 1 : current - 1);
    };

    const nextSlide = () => {
        setCurrent(current === activeSlides.length - 1 ? 0 : current + 1);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [current, activeSlides.length]);

    if (isLoading && dynamicSlides.length === 0) {
        // Optional: Show loading skeleton or just render default immediately
        // For better UX, we can just render the structure with defaults or a spinner
        // But since we have defaults, we might as well show them or wait
        // Let's just show defaults while loading for "instant" feel if we prefer,
        // or show nothing. Given it's a Hero, a spinner might be annoying.
        // Let's return the carousel structure but maybe with loading state if needed.
        // For now, we will let it fall through to render 'activeSlides' which defaults to 'defaultSlides' initially
        // actually activeSlides is defaultSlides initially so no white screen.
    }

    return (
        <div className="relative w-full h-64 sm:h-96 overflow-hidden bg-gray-900 rounded-lg shadow-xl">
            {activeSlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <LazyImage
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">{slide.title}</h2>
                        <p className="text-xl sm:text-2xl drop-shadow-md mb-6">{slide.description}</p>
                        {slide.buttonText && (
                            <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                {slide.buttonText}
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {activeSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full ${index === current ? 'bg-white' : 'bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
