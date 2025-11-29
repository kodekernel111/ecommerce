import React from 'react';
import HomeCategoryCard from './HomeCategoryCard';

const HomeCategorySection = () => {
    const sections = [
        {
            title: "Winter Essentials for You",
            linkText: "See all offers",
            items: [
                { label: "Men's Jackets", offer: "Min. 50% Off", image: "/images/categories/mens-jacket.png", link: "/category/Fashion" },
                { label: "Men's Tracksuits", offer: "Top Picks", image: "/images/categories/mens-tracksuit.png", link: "/category/Fashion" },
                { label: "Men's & Women's Socks", offer: "Min. 50% Off", image: "/images/categories/socks.png", link: "/category/Fashion" },
                { label: "Men's Sweatshirts", offer: "Special offer", image: "/images/categories/mens-sweatshirt.png", link: "/category/Fashion" }
            ]
        },
        {
            title: "Best Deals on Designer Furniture",
            linkText: "See all deals",
            items: [
                { label: "Shoe Rack", offer: "Min. 50% Off", image: "/images/categories/shoe-rack.png", link: "/category/Furniture" },
                { label: "Collapsible Wardrobes", offer: "Min. 50% Off", image: "/images/categories/collapsible-wardrobe.png", link: "/category/Furniture" },
                { label: "Home Temple", offer: "Min. 50% Off", image: "/images/categories/home-temple.png", link: "/category/Furniture" },
                { label: "Inflatable Sofas", offer: "Min. 50% Off", image: "/images/categories/sofa.webp", link: "/category/Furniture" }
            ]
        },
        {
            title: "Make your home stylish",
            linkText: "Explore all",
            items: [
                { label: "Water Bottles & Flasks", offer: "Min. 50% Off", image: "/images/categories/water-bottle.png", link: "/category/Home & Kitchen" },
                { label: "Wall Clocks", offer: "Special offer", image: "/images/categories/wall-clock.png", link: "/category/Home & Kitchen" },
                { label: "Blankets", offer: "Min. 50% Off", image: "/images/categories/blankets.png", link: "/category/Home & Kitchen" },
                { label: "Lunch Boxes", offer: "Best Deals", image: "/images/categories/lunch-box.png", link: "/category/Home & Kitchen" }
            ]
        },
        {
            title: "Appliances for your home",
            linkText: "See more",
            items: [
                { label: "Air Conditioners", offer: "Up to 40% Off", image: "/images/categories/air-conditioner.png", link: "/category/Electronics" },
                { label: "Refrigerators", offer: "Exchange Offers", image: "/images/categories/refrigerator.png", link: "/category/Electronics" },
                { label: "Microwaves", offer: "No Cost EMI", image: "/images/categories/microwave.png", link: "/category/Electronics" },
                { label: "Washing Machines", offer: "Min. 30% Off", image: "/images/categories/washing-machine.png", link: "/category/Electronics" }
            ]
        }
    ];

    return (
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
    );
};

export default HomeCategorySection;
