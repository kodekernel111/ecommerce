import React, { useState, useEffect, useRef } from 'react';
import { Save, Layout, Image, Type, Eye, Layers, Upload, Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import api from '../../api/axios';

const SellerHomepageControls = () => {
    const fileInputRef = useRef(null);
    const [uploadTarget, setUploadTarget] = useState(null); // { type: 'hero'|'new_section'|'existing_section', sectionIndex?, cardIndex?, field }
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // Hero Config (Multiple Slides)
    const [heroSlides, setHeroSlides] = useState([
        { heading: '', subtext: '', buttonText: '', imageUrl: '' }
    ]);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    // Visibility Config
    const [sectionsVisibility, setSectionsVisibility] = useState([
        { id: 'trending', label: 'Trending Products', enabled: true },
        { id: 'bestsellers', label: 'Best Sellers', enabled: true },
        { id: 'topdeals', label: 'Top Deals', enabled: true },
        { id: 'newarrivals', label: 'New Arrivals', enabled: false },
        { id: 'featured', label: 'Featured Collections', enabled: true }
    ]);

    // Existing Featured Sections
    const [existingSections, setExistingSections] = useState([]);
    const [openSectionIndex, setOpenSectionIndex] = useState(null);

    // New Section Form
    const defaultCard = { subCategoryId: '', displayTitle: '', image: '', offer: '', active: true };
    const [newSection, setNewSection] = useState({
        title: '',
        mainCategoryId: '',
        active: true,
        cards: Array(4).fill({ ...defaultCard })
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, configRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/seller/homepage-config')
                ]);

                setCategories(catsRes.data);

                const config = configRes.data;
                if (config && config.id) {

                    // Load Hero Slides
                    if (config.heroSlides && config.heroSlides.length > 0) {
                        setHeroSlides(config.heroSlides.map(s => ({
                            id: s.id, // Preserve ID
                            heading: s.heading || '',
                            subtext: s.subtext || '',
                            buttonText: s.buttonText || '',
                            imageUrl: s.imageUrl || ''
                        })));
                    } else if (config.heroHeading) {
                        // Fallback for legacy database rows if any
                        setHeroSlides([{
                            heading: config.heroHeading || '',
                            subtext: config.heroSubtext || '',
                            buttonText: config.heroButtonText || '',
                            imageUrl: config.heroImageUrl || ''
                        }]);
                    }

                    setSectionsVisibility([
                        { id: 'trending', label: 'Trending Products', enabled: config.showTrending },
                        { id: 'bestsellers', label: 'Best Sellers', enabled: config.showBestsellers },
                        { id: 'topdeals', label: 'Top Deals', enabled: config.showTopDeals },
                        { id: 'newarrivals', label: 'New Arrivals', enabled: config.showNewArrivals },
                        { id: 'featured', label: 'Featured Collections', enabled: config.showFeatured }
                    ]);

                    if (config.featuredSections) {
                        setExistingSections(config.featuredSections.map(sec => ({
                            id: sec.id,
                            title: sec.title,
                            mainCategoryId: sec.mainCategoryId,
                            active: sec.active !== undefined ? sec.active : true,
                            cards: ensureFourCards(sec.cards)
                        })));
                    }
                }
            } catch (error) {
                console.error("Error loading homepage config", error);
            }
        };
        fetchData();
    }, []);

    const ensureFourCards = (cards) => {
        const filled = cards ? [...cards] : [];
        while (filled.length < 4) {
            filled.push({ ...defaultCard });
        }
        return filled.map(c => ({
            id: c.id, // Preserve ID
            subCategoryId: c.subCategoryId || '',
            displayTitle: c.displayTitle || '',
            image: c.imageUrl || c.image || '', // Handle backend field name mismatch if any
            offer: c.offer || '',
            active: c.active !== undefined ? c.active : true
        }));
    };

    const triggerUpload = (target) => {
        setUploadTarget(target);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const res = await api.post('/seller/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.url;

            if (uploadTarget.type === 'hero') {
                setHeroSlides(prev => {
                    const slides = [...prev];
                    slides[activeSlideIndex] = { ...slides[activeSlideIndex], imageUrl: url };
                    return slides;
                });
            } else if (uploadTarget.type === 'new_section') {
                setNewSection(prev => {
                    const cards = [...prev.cards];
                    cards[uploadTarget.cardIndex] = { ...cards[uploadTarget.cardIndex], image: url };
                    return { ...prev, cards };
                });
            } else if (uploadTarget.type === 'existing_section') {
                setExistingSections(prev => {
                    const sections = [...prev];
                    const section = { ...sections[uploadTarget.sectionIndex] };
                    const cards = [...section.cards];
                    cards[uploadTarget.cardIndex] = { ...cards[uploadTarget.cardIndex], image: url };
                    section.cards = cards;
                    sections[uploadTarget.sectionIndex] = section;
                    return sections;
                });
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setLoading(false);
            e.target.value = null;
        }
    };

    const handleHeroChange = (field, value) => {
        setHeroSlides(prev => {
            const slides = [...prev];
            slides[activeSlideIndex] = { ...slides[activeSlideIndex], [field]: value };
            return slides;
        });
    };

    const addHeroSlide = () => {
        if (heroSlides.length < 4) {
            setHeroSlides([...heroSlides, { heading: '', subtext: '', buttonText: '', imageUrl: '' }]);
            setActiveSlideIndex(heroSlides.length);
        }
    };

    const removeHeroSlide = (index, e) => {
        e.stopPropagation();
        if (heroSlides.length > 1) {
            const newSlides = heroSlides.filter((_, i) => i !== index);
            setHeroSlides(newSlides);
            if (activeSlideIndex >= newSlides.length) {
                setActiveSlideIndex(newSlides.length - 1);
            }
        }
    };

    const toggleSectionVisibility = (id) => {
        setSectionsVisibility(prev => prev.map(section =>
            section.id === id ? { ...section, enabled: !section.enabled } : section
        ));
    };

    const handleNewSectionChange = (field, value) => {
        setNewSection(prev => ({ ...prev, [field]: value }));
    };

    const handleNewSectionCardChange = (index, field, value) => {
        setNewSection(prev => {
            const cards = [...prev.cards];
            cards[index] = { ...cards[index], [field]: value };
            return { ...prev, cards };
        });
    };

    const handleExistingSectionUpdate = (sectionIndex, field, value) => {
        setExistingSections(prev => {
            const sections = [...prev];
            sections[sectionIndex] = { ...sections[sectionIndex], [field]: value };
            return sections;
        });
    };

    const handleExistingCardUpdate = (sectionIndex, cardIndex, field, value) => {
        setExistingSections(prev => {
            const sections = [...prev];
            const section = { ...sections[sectionIndex] };
            const cards = [...section.cards];
            cards[cardIndex] = { ...cards[cardIndex], [field]: value };
            section.cards = cards;
            sections[sectionIndex] = section;
            return sections;
        });
    };

    const deleteSection = (index) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            const updated = existingSections.filter((_, i) => i !== index);
            setExistingSections(updated);
        }
    };

    const buildPayload = (sectionsList) => {
        const visibilityMap = sectionsVisibility.reduce((acc, sec) => ({ ...acc, [sec.id]: sec.enabled }), {});
        return {
            heroSlides: heroSlides, // Send list with IDs

            showTrending: visibilityMap['trending'],
            showBestsellers: visibilityMap['bestsellers'],
            showTopDeals: visibilityMap['topdeals'],
            showNewArrivals: visibilityMap['newarrivals'],
            showFeatured: visibilityMap['featured'],

            featuredSections: sectionsList.map(sec => ({
                id: sec.id, // Include ID if updating
                title: sec.title,
                mainCategoryId: sec.mainCategoryId,
                active: sec.active !== undefined ? sec.active : true,
                cards: sec.cards.map(c => ({
                    id: c.id, // Preserve ID
                    subCategoryId: c.subCategoryId || null,
                    displayTitle: c.displayTitle,
                    imageUrl: c.image,
                    offer: c.offer,
                    active: c.active !== undefined ? c.active : true
                }))
            }))
        };
    };

    const saveAll = async (sectionsToSave = existingSections) => {
        try {
            setLoading(true);
            const payload = buildPayload(sectionsToSave);
            const res = await api.post('/seller/homepage-config', payload);

            // Update local state with returned IDs
            if (res.data.featuredSections) {
                setExistingSections(res.data.featuredSections.map(sec => ({
                    id: sec.id,
                    title: sec.title,
                    mainCategoryId: sec.mainCategoryId,
                    active: sec.active !== undefined ? sec.active : true,
                    cards: ensureFourCards(sec.cards)
                })));
            }
            if (res.data.heroSlides) {
                setHeroSlides(res.data.heroSlides.map(s => ({
                    heading: s.heading || '',
                    subtext: s.subtext || '',
                    buttonText: s.buttonText || '',
                    imageUrl: s.imageUrl || ''
                })));
            }

            alert('Settings saved successfully!');
            return true;
        } catch (error) {
            console.error("Save failed", error);
            alert('Failed to save settings');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleAddSection = async () => {
        if (!newSection.title || !newSection.mainCategoryId) {
            alert("Please enter a Title and select a Main Category.");
            return;
        }

        const updatedList = [...existingSections, newSection];
        const success = await saveAll(updatedList);

        if (success) {
            // Wipe form
            setNewSection({
                title: '',
                mainCategoryId: '',
                active: true,
                cards: Array(4).fill({ ...defaultCard })
            });
        }
    };

    // Create Category Modal State
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [parentCategoryForCreation, setParentCategoryForCreation] = useState(null); // ID of parent if creating sub-cat, else null
    const [pendingSelection, setPendingSelection] = useState(null); // { type, sectionIndex, cardIndex } to resume after creation

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            return res.data;
        } catch (error) {
            console.error("Failed to refresh categories", error);
        }
    };

    const openCreateCategoryModal = (type, sectionIndex = null, cardIndex = null, context = 'main') => {
        // Determine parent if sub-category context
        let parentId = null;
        if (context === 'sub') {
            if (type === 'new') {
                parentId = newSection.mainCategoryId;
            } else {
                parentId = existingSections[sectionIndex].mainCategoryId;
            }
            if (!parentId) {
                alert("Please select a Main Category first.");
                return;
            }
        }

        setParentCategoryForCreation(parentId);
        setPendingSelection({ type, sectionIndex, cardIndex, context });
        setNewCategoryName('');
        setShowCreateCategoryModal(true);
    };

    const handleCategorySelectChange = async (e, type, sectionIndex = null, cardIndex = null, context = 'main') => {
        const value = e.target.value;
        // Normal selection
        if (context === 'main') {
            if (type === 'new') handleNewSectionChange('mainCategoryId', value);
            else handleExistingSectionUpdate(sectionIndex, 'mainCategoryId', value);
        } else {
            if (type === 'new') handleNewSectionCardChange(cardIndex, 'subCategoryId', value);
            else handleExistingCardUpdate(sectionIndex, cardIndex, 'subCategoryId', value);
        }
    };

    const handleCreateCategorySubmit = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const payload = { name: newCategoryName };
            if (parentCategoryForCreation) payload.parentId = parentCategoryForCreation;

            const res = await api.post('/categories', payload);
            const newCat = res.data;

            // Refresh categories list
            await fetchCategories();

            // Resume selection
            if (pendingSelection) {
                const { type, sectionIndex, cardIndex, context } = pendingSelection;
                if (context === 'main') {
                    if (type === 'new') handleNewSectionChange('mainCategoryId', newCat.id);
                    else handleExistingSectionUpdate(sectionIndex, 'mainCategoryId', newCat.id);
                } else {
                    if (type === 'new') handleNewSectionCardChange(cardIndex, 'subCategoryId', newCat.id);
                    else handleExistingCardUpdate(sectionIndex, cardIndex, 'subCategoryId', newCat.id);
                }
            }

            setShowCreateCategoryModal(false);
            setPendingSelection(null);
        } catch (error) {
            console.error("Failed to create category", error);
            alert("Failed to create category. It might already exist.");
        }
    };

    const renderCardInputs = (card, index, sectionType, sectionIndex = null) => {
        const handleChange = (field, value) => {
            if (sectionType === 'new') handleNewSectionCardChange(index, field, value);
            else handleExistingCardUpdate(sectionIndex, index, field, value);
        };

        const mainCatId = sectionType === 'new' ? newSection.mainCategoryId : existingSections[sectionIndex].mainCategoryId;
        const subCats = categories.find(c => c.id === mainCatId)?.subCategories || [];

        return (
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-3 relative group">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-gray-400 uppercase">Card {index + 1}</div>
                    <button
                        onClick={() => handleChange('active', !card.active)}
                        className={`relative inline-flex h-5 w-9 border-2 border-transparent rounded-full transition-colors focus:outline-none ${card.active ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white transform ring-0 transition-transform ${card.active ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className={!card.active ? 'opacity-50 pointer-events-none' : ''}>
                    <div className="mb-3">
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Sub Category</label>
                            <button
                                onClick={() => openCreateCategoryModal(sectionType, sectionIndex, index, 'sub')}
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                            >
                                <Plus className="h-3 w-3 mr-0.5" /> New
                            </button>
                        </div>
                        <select
                            value={card.subCategoryId}
                            onChange={(e) => handleCategorySelectChange(e, sectionType, sectionIndex, index, 'sub')}
                            className="block w-full px-2 py-1.5 text-xs border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select sub-category...</option>
                            {subCats.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Display Title</label>
                        <input
                            type="text"
                            value={card.displayTitle}
                            onChange={(e) => handleChange('displayTitle', e.target.value)}
                            className="block w-full px-2 py-1.5 text-xs border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. Jacket"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={card.image}
                                onChange={(e) => handleChange('image', e.target.value)}
                                className="block w-full px-2 py-1.5 text-xs border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://..."
                            />
                            <button
                                onClick={() => triggerUpload({
                                    type: sectionType === 'new' ? 'new_section' : 'existing_section',
                                    sectionIndex,
                                    cardIndex: index,
                                    field: 'image'
                                })}
                                className="px-2 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors border border-gray-300 flex items-center justify-center"
                            >
                                <Upload className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Discount / Offer</label>
                        <input
                            type="text"
                            value={card.offer}
                            onChange={(e) => handleChange('offer', e.target.value)}
                            className="block w-full px-2 py-1.5 text-xs border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-green-600 font-medium"
                            placeholder="e.g. 50% OFF"
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Homepage Controls</h2>
                    <p className="mt-1 text-sm text-gray-500">Customize the look and feel of your storefront homepage.</p>
                </div>
                <button
                    onClick={() => saveAll()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hero Section Config (Multi-Slide) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image className="h-5 w-5 text-indigo-600" />
                            <h3 className="font-semibold text-gray-900">Hero Banner</h3>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">Visible</span>
                    </div>

                    {/* Slide Tabs */}
                    <div className="flex border-b border-gray-100 px-5 pt-3 ga-2 overflow-x-auto">
                        {heroSlides.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveSlideIndex(index)}
                                className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${activeSlideIndex === index ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Slide {index + 1}
                                {heroSlides.length > 1 && (
                                    <X className="h-3 w-3 hover:text-red-500" onClick={(e) => removeHeroSlide(index, e)} />
                                )}
                            </div>
                        ))}
                        {heroSlides.length < 4 && (
                            <button onClick={addHeroSlide} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-t-lg ml-1">
                                <Plus className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Heading</label>
                            <input type="text" value={heroSlides[activeSlideIndex].heading} onChange={(e) => handleHeroChange('heading', e.target.value)} className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" placeholder="Enter banner heading" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subtext</label>
                            <textarea value={heroSlides[activeSlideIndex].subtext} onChange={(e) => handleHeroChange('subtext', e.target.value)} rows={2} className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm" placeholder="Enter banner subtext" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                            <input type="text" value={heroSlides[activeSlideIndex].buttonText} onChange={(e) => handleHeroChange('buttonText', e.target.value)} className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm" placeholder="e.g. Shop Now" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Background Image URL</label>
                            <div className="flex gap-2">
                                <input type="text" value={heroSlides[activeSlideIndex].imageUrl} onChange={(e) => handleHeroChange('imageUrl', e.target.value)} className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm" placeholder="https://..." />
                                <button onClick={() => triggerUpload({ type: 'hero', field: 'imageUrl' })} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300"><Upload className="h-4 w-4" /></button>
                            </div>
                        </div>

                        {/* Preview Mini */}
                        <div className="mt-4 rounded-lg overflow-hidden relative h-32 group border border-gray-200">
                            <img
                                src={heroSlides[activeSlideIndex].imageUrl}
                                alt="Banner Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL'}
                            />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-2">
                                <h4 className="text-white font-bold text-lg">{heroSlides[activeSlideIndex].heading || 'Heading'}</h4>
                                <p className="text-white/80 text-xs mt-1">{heroSlides[activeSlideIndex].subtext || 'Subtext'}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={() => saveAll()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Hero Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visibility Config - Same as before */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-900">Section Visibility</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {sectionsVisibility.map(section => (
                            <div key={section.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <span className="text-sm font-medium text-gray-900">{section.label}</span>
                                <button onClick={() => toggleSectionVisibility(section.id)} className={`relative inline-flex h-6 w-11 border-2 border-transparent rounded-full ${section.enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                                    <span className={`inline-block h-5 w-5 rounded-full bg-white transform ring-0 transition ${section.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List of Existing Featured Sections */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Active Featured Sections</h3>
                {existingSections.length === 0 && <p className="text-sm text-gray-500">No sections added yet.</p>}

                {existingSections.map((section, idx) => (
                    <div key={idx} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${!section.active ? 'opacity-75' : ''}`}>
                        <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => setOpenSectionIndex(openSectionIndex === idx ? null : idx)}>
                            <div className="flex items-center gap-3">
                                <Layout className={`h-5 w-5 ${section.active ? 'text-indigo-600' : 'text-gray-400'}`} />
                                <div>
                                    <h3 className={`font-semibold ${section.active ? 'text-gray-900' : 'text-gray-500'}`}>{section.title || 'Untitled Section'}</h3>
                                    <p className="text-xs text-gray-500">{categories.find(c => c.id === section.mainCategoryId)?.name || 'No Category'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Section Toggle Switch */}
                                <div onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleExistingSectionUpdate(idx, 'active', !section.active)}
                                        className={`relative inline-flex h-5 w-9 border-2 border-transparent rounded-full transition-colors focus:outline-none ${section.active ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                        title={section.active ? "Section Active" : "Section Inactive"}
                                    >
                                        <span className={`inline-block h-4 w-4 rounded-full bg-white transform ring-0 transition-transform ${section.active ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>

                                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                                <button onClick={(e) => { e.stopPropagation(); deleteSection(idx); }} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                {openSectionIndex === idx ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                            </div>
                        </div>
                        {openSectionIndex === idx && (
                            <div className={`p-5 space-y-6 ${!section.active ? 'pointer-events-none opacity-60' : ''}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Section Title</label>
                                        <input type="text" value={section.title} onChange={(e) => handleExistingSectionUpdate(idx, 'title', e.target.value)} className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-end mb-1.5">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Category</label>
                                            <button
                                                onClick={() => openCreateCategoryModal('existing', idx, null, 'main')}
                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                                            >
                                                <Plus className="h-3 w-3 mr-0.5" /> New Main Category
                                            </button>
                                        </div>
                                        <select
                                            value={section.mainCategoryId}
                                            onChange={(e) => handleCategorySelectChange(e, 'existing', idx, null, 'main')}
                                            className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm"
                                        >
                                            <option value="">Select Category...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {section.cards.map((card, cIdx) => renderCardInputs(card, cIdx, 'existing', idx))}
                                </div>
                                <div className="flex justify-end border-t border-gray-100 pt-4">
                                    <button onClick={() => saveAll()} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"><Save className="h-4 w-4 mr-2" /> Save Section Changes</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Section Form */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Add New Featured Section</h3>
                </div>
                <div className="p-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Main Section Title</label>
                            <input
                                type="text"
                                value={newSection.title}
                                onChange={(e) => handleNewSectionChange('title', e.target.value)}
                                className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                placeholder="e.g. Summer Essentials"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-1.5">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Main Category</label>
                                <button
                                    onClick={() => openCreateCategoryModal('new', null, null, 'main')}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                                >
                                    <Plus className="h-3 w-3 mr-0.5" /> New Main Category
                                </button>
                            </div>
                            <select
                                value={newSection.mainCategoryId}
                                onChange={(e) => handleCategorySelectChange(e, 'new', null, null, 'main')}
                                className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            >
                                <option value="">Select a category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {newSection.mainCategoryId && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {newSection.cards.map((card, index) => renderCardInputs(card, index, 'new'))}
                            </div>
                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleAddSection}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save & Add Section
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />

            {/* Create Category Modal */}
            {showCreateCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">
                            Create New {parentCategoryForCreation ? 'Sub-Category' : 'Category'}
                        </h3>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
                            placeholder="Enter Name..."
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => { setShowCreateCategoryModal(false); setPendingSelection(null); }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCategorySubmit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerHomepageControls;
