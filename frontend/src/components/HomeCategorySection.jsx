import React, { useState, useEffect } from 'react';
import HomeCategoryCard from './HomeCategoryCard';
import api from '../api/axios';

const HomeCategorySection = () => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/public/homepage-config');
                if (res.data && res.data.featuredSections) {
                    const mappedSections = res.data.featuredSections
                        .filter(sec => sec.active)
                        .map(sec => ({
                            title: sec.title,
                            linkText: "See all", // You might want to make this dynamic too later if added to backend
                            items: sec.cards.map(card => ({
                                label: card.displayTitle,
                                offer: card.offer,
                                image: card.imageUrl || 'https://via.placeholder.com/150',
                                link: card.subCategoryId ? `/category/${card.subCategoryId}` : '/'
                            }))
                        }));
                    setSections(mappedSections);
                }
            } catch (error) {
                console.error("Failed to load homepage config", error);
            }
        };
        fetchConfig();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sections.map((section, index) => (
                    <HomeCategoryCard
                        key={index}
                        title={section.title}
                        items={section.items}
                        linkText={section.linkText}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomeCategorySection;
