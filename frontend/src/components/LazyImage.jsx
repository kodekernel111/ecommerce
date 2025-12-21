import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className = "", ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            });
        }, {
            rootMargin: '50px', // Trigger slightly before element enters viewport
            threshold: 0.01
        });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    return (
        <img
            ref={imgRef}
            src={isInView ? src : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
            alt={alt}
            className={`${className} transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => {
                if (isInView && src) setIsLoaded(true);
            }}
            {...props}
        />
    );
};

export default LazyImage;
