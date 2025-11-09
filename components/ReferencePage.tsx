import React, { useState, useEffect, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import {
    COMPANION_INTRO,
    COMPANION_CATEGORIES,
    COMPANION_RELATIONSHIPS,
    COMPANION_PERSONALITY_TRAITS,
    COMPANION_PERKS,
    COMPANION_POWER_LEVELS,
    WEAPON_INTRO,
    WEAPON_CATEGORIES,
    WEAPON_PERKS,
    BEAST_INTRO,
    BEAST_CATEGORIES,
    BEAST_SIZES,
    BEAST_PERKS,
    VEHICLE_INTRO,
    VEHICLE_CATEGORIES,
    VEHICLE_PERKS
} from '../constants';
import type { CompanionOption, CompanionSelections, WeaponSelections, BeastSelections, VehicleSelections, AllBuilds, BuildType, SavedBuildData } from '../types';

// --- SHARED UI COMPONENTS ---
const ReferenceSection: React.FC<{ title: string, subTitle?: string, children: React.ReactNode }> = ({ title, subTitle, children }) => (
    <section className="my-10">
        <h3 className="font-cinzel text-3xl text-center tracking-[0.2em] text-white uppercase">{title}</h3>
        {subTitle && <p className="text-center text-gray-400 italic max-w-3xl mx-auto text-sm my-4">{subTitle}</p>}
        <div className="w-48 h-px bg-white/20 mx-auto my-6"></div>
        {children}
    </section>
);

const ReferenceItemCard: React.FC<{
    item: CompanionOption,
    isSelected: boolean,
    onSelect: (id: string) => void,
    disabled?: boolean,
    layout: 'trait' | 'default',
    children?: React.ReactNode
}> = ({ item, isSelected, onSelect, disabled = false, layout, children }) => {
    const costText = item.cost !== undefined ? `Points: ${item.cost > 0 ? `+${item.cost}` : (item.cost < 0 ? `${item.cost}` : '0')}` : '';
    const costColor = item.cost !== undefined && item.cost > 0 ? 'text-red-400' : 'text-green-400';

    const baseClasses = "group relative bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 transition-all duration-300 h-full flex flex-col text-center";
    const interactionClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black/60 hover:border-white/30';
    const selectedClasses = isSelected ? 'border-cyan-300 ring-2 ring-cyan-300/50' : '';

    return (
        <div className={`${baseClasses} ${interactionClasses} ${selectedClasses}`} onClick={() => !disabled && onSelect(item.id)}>
             {isSelected && <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-xl bg-cyan-400/20 blur-lg -z-10"></div>}
            <img 
                src={item.imageSrc} 
                alt={item.title} 
                className={`mx-auto object-cover group-hover:scale-105 transition-transform duration-300 ${layout === 'trait' ? 'w-24 h-24 rounded-full mb-3' : 'w-full h-40 rounded-md mb-4'}`}
            />
            <h4 className={`font-cinzel font-bold text-white tracking-wider ${layout === 'trait' ? 'text-sm' : 'text-xl'}`}>{item.title}</h4>
            {costText && item.cost !== 0 && <p className={`text-xs font-semibold my-1 ${costColor}`}>{costText.toUpperCase()}</p>}
            {item.requirement && <p className="text-[10px] text-yellow-300/70 italic mt-1 whitespace-pre-wrap">{item.requirement}</p>}
            <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
            {item.description && <p className="text-xs text-gray-400 leading-relaxed flex-grow text-left whitespace-pre-wrap">{item.description}</p>}
            {children && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                    {children}
                </div>
            )}
        </div>
    );
};

interface CounterProps {
    label: string;
    count: number;
    onCountChange: (newCount: number) => void;
    unit?: string;
    cost: string;
    displayMultiplier?: number;
    max?: number;
}

const Counter: React.FC<CounterProps> = ({ label, count, onCountChange, unit = '', cost, displayMultiplier = 1, max = Infinity }) => (
    <div className="text-center mt-2">
        <label className="text-xs text-gray-300 font-semibold">{label} <span className="text-red-400 font-normal">({cost})</span></label>
        <div className="flex items-center justify-center gap-2 mt-1">
            <button onClick={(e) => { e.stopPropagation(); onCountChange(count - 1); }} disabled={count === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
            <span className="font-semibold text-white w-24 text-center">{count * displayMultiplier} {unit}</span>
            <button onClick={(e) => { e.stopPropagation(); onCountChange(count + 1); }} disabled={count >= max} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
        </div>
    </div>
);

// --- SECTION COMPONENTS (NOW CONTROLLED) ---

const CompanionSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: CompanionSelections;
    setSelections: React.Dispatch<React.SetStateAction<CompanionSelections>>;
}> = ({ setPoints, selections, setSelections }) => {

    useEffect(() => {
        let total = 0;
        const allItems = [...COMPANION_CATEGORIES, ...COMPANION_RELATIONSHIPS, ...COMPANION_PERSONALITY_TRAITS, ...COMPANION_PERKS, ...COMPANION_POWER_LEVELS];
        
        if (selections.category) total += allItems.find(i => i.id === selections.category)?.cost ?? 0;
        if (selections.relationship) total += allItems.find(i => i.id === selections.relationship)?.cost ?? 0;
        if (selections.powerLevel) total += allItems.find(i => i.id === selections.powerLevel)?.cost ?? 0;
        selections.traits.forEach(traitId => { total += allItems.find(i => i.id === traitId)?.cost ?? 0; });
        selections.perks.forEach(perkId => { total += allItems.find(i => i.id === perkId)?.cost ?? 0; });
        
        setPoints(total);
    }, [selections, setPoints]);

    const handleSelect = (type: keyof CompanionSelections, id: string) => {
        setSelections(prev => {
            const newSelections = {...prev};
            if (type === 'traits' || type === 'perks') {
                const currentSet = new Set<string>(prev[type]);
                if (currentSet.has(id)) currentSet.delete(id); else currentSet.add(id);
                newSelections[type] = currentSet;
            } else {
                const prop = type as 'category' | 'relationship' | 'powerLevel';
                (newSelections[prop] as string | null) = prev[prop] === id ? null : id;
            }
            return newSelections;
        });
    };

    const isCategoryDisabled = (item: CompanionOption) => {
        return false;
    }
    
    const isRelationshipDisabled = (item: CompanionOption) => {
        if (item.id === 'subservient' && selections.category === 'mage') return true;
        return false;
    }

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={COMPANION_INTRO.imageSrc} alt="Companions" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{COMPANION_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{COMPANION_CATEGORIES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category === item.id} onSelect={(id) => handleSelect('category', id)} disabled={isCategoryDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title="RELATIONSHIP"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{COMPANION_RELATIONSHIPS.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.relationship === item.id} onSelect={(id) => handleSelect('relationship', id)} disabled={isRelationshipDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title="PERSONALITY TRAITS" subTitle="Choose as many as you like."><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{COMPANION_PERSONALITY_TRAITS.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={(id) => handleSelect('traits', id)} />)}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{COMPANION_PERKS.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.perks.has(item.id)} onSelect={(id) => handleSelect('perks', id)} />)}</div></ReferenceSection>
            <ReferenceSection title="POWER LEVEL"><div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">{COMPANION_POWER_LEVELS.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.powerLevel === item.id} onSelect={(id) => handleSelect('powerLevel', id)} />)}</div></ReferenceSection>
        </div>
    );
};

const WeaponSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: WeaponSelections;
    setSelections: React.Dispatch<React.SetStateAction<WeaponSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
    const { selectedMetathermics, selectedNaniteControls } = useCharacterContext();

    useEffect(() => {
        let total = 0;
        selections.perks.forEach(perkId => {
            const perk = WEAPON_PERKS.find(p => p.id === perkId);
            if (perk) total += perk.cost ?? 0;
        });
        if (selections.perks.has('chatterbox')) {
            selections.traits.forEach(traitId => {
                const trait = COMPANION_PERSONALITY_TRAITS.find(t => t.id === traitId);
                if (trait) total += trait.cost ?? 0;
            });
        }
        setPoints(total);
    }, [selections, setPoints]);

    const handleCategorySelect = (id: string) => setSelections(prev => ({ ...prev, category: prev.category === id ? null : id }));
    const handlePerkSelect = (id: string) => {
        setSelections(prev => {
            const newPerks = new Set(prev.perks);
            let newTraits = prev.traits;
            if (newPerks.has(id)) {
                newPerks.delete(id);
                if (id === 'chatterbox') newTraits = new Set();
            } else {
                newPerks.add(id);
            }
            return { ...prev, perks: newPerks, traits: newTraits };
        });
    };
    const handleWeaponTraitSelect = (id: string) => {
        setSelections(prev => {
            const newTraits = new Set(prev.traits);
            if (newTraits.has(id)) newTraits.delete(id);
            else newTraits.add(id);
            return { ...prev, traits: newTraits };
        });
    };

    const isPerkDisabled = (perk: CompanionOption) => {
        if (!perk.requirement) return false;
        if (perk.requirement.includes("Can't be Bow") && selections.category === 'bow') return true;
        if (perk.requirement.includes("Can't be Wand or Staff") && ['wand', 'staff'].includes(selections.category ?? '')) return true;
        if (perk.requirement.includes("Requires Melee Weapon") && !['blunt_melee', 'bladed_melee'].includes(selections.category ?? '')) return true;
        if (perk.requirement.includes("Requires Weapon") && !selections.category) return true;
        if (perk.requirement.includes("Thermal Weaponry") && !selectedMetathermics.has('thermal_weaponry')) return true;
        if (perk.requirement.includes("Heavily Armed") && !selectedNaniteControls.has('heavily_armed')) return true;
        return false;
    };

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={WEAPON_INTRO.imageSrc} alt="Weapons" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{WEAPON_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{WEAPON_CATEGORIES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category === item.id} onSelect={handleCategorySelect} />)}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{WEAPON_PERKS.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.perks.has(item.id)} onSelect={handlePerkSelect} disabled={isPerkDisabled(item)} />)}</div></ReferenceSection>
            {selections.perks.has('chatterbox') && <ReferenceSection title="PERSONALITY TRAITS" subTitle="Choose as many as you like. Points are deducted from Weapon Points."><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{COMPANION_PERSONALITY_TRAITS.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={handleWeaponTraitSelect} />)}</div></ReferenceSection>}
        </div>
    );
};

const BeastSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: BeastSelections;
    setSelections: React.Dispatch<React.SetStateAction<BeastSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
     useEffect(() => {
        let total = 0;
        if (selections.category) total += BEAST_CATEGORIES.find(c => c.id === selections.category)?.cost ?? 0;
        if (selections.size) total += BEAST_SIZES.find(s => s.id === selections.size)?.cost ?? 0;
        selections.perks.forEach(perkId => {
            const perk = BEAST_PERKS.find(p => p.id === perkId);
            if (perk) {
                let cost = perk.cost ?? 0;
                if (perk.id === 'unnerving_appearance' && selections.perks.has('undead_perk')) cost = 0;
                if (perk.id === 'steel_skin' && selections.perks.has('automaton_perk')) cost = 0;
                total += cost;
            }
        });
        if (selections.perks.has('chatterbox_beast')) {
            selections.traits.forEach(traitId => {
                const trait = COMPANION_PERSONALITY_TRAITS.find(t => t.id === traitId);
                if (trait) total += trait.cost ?? 0;
            });
        }
        setPoints(total);
    }, [selections, setPoints]);

    const handleSelect = (type: keyof BeastSelections, id: string) => {
        setSelections(prev => {
            const newSelections = {...prev};
            if (type === 'perks' || type === 'traits') {
                const currentSet = new Set<string>(prev[type]);
                if (currentSet.has(id)) {
                    currentSet.delete(id);
                    if (id === 'chatterbox_beast' && type === 'perks') newSelections.traits = new Set();
                } else currentSet.add(id);
                newSelections[type] = currentSet;
            } else {
                const prop = type as 'category' | 'size';
                (newSelections[prop] as string | null) = prev[prop] === id ? null : id;
            }
            return newSelections;
        });
    };
    
    const isPerkDisabled = (perk: CompanionOption) => {
        if (perk.id === 'noble_steed') return !['medium', 'large', 'humongous'].includes(selections.size ?? '');
        if (perk.id === 'automaton_perk' && selections.category !== 'automaton') return true;
        if (perk.id === 'undead_perk' && selections.category !== 'undead') return true;
        return false;
    }

    const getModifiedPerk = (perk: CompanionOption): CompanionOption => {
        if (perk.id === 'unnerving_appearance' && selections.perks.has('undead_perk')) return { ...perk, cost: 0, requirement: 'Free for Undead' };
        if (perk.id === 'steel_skin' && selections.perks.has('automaton_perk')) return { ...perk, cost: 0, requirement: 'Free for Automaton' };
        return perk;
    }

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={BEAST_INTRO.imageSrc} alt="Beasts" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{BEAST_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{BEAST_CATEGORIES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category === item.id} onSelect={(id) => handleSelect('category', id)} />)}</div></ReferenceSection>
            <ReferenceSection title="SIZE"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{BEAST_SIZES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.size === item.id} onSelect={(id) => handleSelect('size', id)} />)}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{BEAST_PERKS.map(item => <ReferenceItemCard key={item.id} item={getModifiedPerk(item)} layout="default" isSelected={selections.perks.has(item.id)} onSelect={(id) => handleSelect('perks', id)} disabled={isPerkDisabled(item)} />)}</div></ReferenceSection>
            {selections.perks.has('chatterbox_beast') && <ReferenceSection title="PERSONALITY TRAITS" subTitle="Choose as many as you like. Points are deducted from Beast Points."><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{COMPANION_PERSONALITY_TRAITS.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={(id) => handleSelect('traits', id)} />)}</div></ReferenceSection>}
        </div>
    );
};

const VehicleSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: VehicleSelections;
    setSelections: React.Dispatch<React.SetStateAction<VehicleSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
    useEffect(() => {
        let total = 0;
        if (selections.category) total += VEHICLE_CATEGORIES.find(c => c.id === selections.category)?.cost ?? 0;
        selections.perks.forEach((count, perkId) => {
            const perk = VEHICLE_PERKS.find(p => p.id === perkId);
            if (perk) {
                let cost = perk.cost ?? 0;
                if (perkId === 'chatterbox_vehicle' && selections.category === 'car') cost = 0;
                if (perkId === 'hellfire_volley' && (selections.category === 'tank' || selections.category === 'mecha')) cost = 0;
                total += cost * count;
            }
        });
        setPoints(total);
    }, [selections, setPoints]);

    const handleCategorySelect = (id: string) => setSelections(prev => ({ ...prev, category: prev.category === id ? null : id }));
    const handlePerkSelect = (id: string) => {
        if (id === 'speed_boost') return;
        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            if (newPerks.has(id)) newPerks.delete(id);
            else newPerks.set(id, 1);
            return { ...prev, perks: newPerks };
        });
    };
    const handleSpeedBoostChange = (newCount: number) => {
        if (newCount < 0 || newCount > 3) return;
        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            if (newCount === 0) newPerks.delete('speed_boost');
            else newPerks.set('speed_boost', newCount);
            return { ...prev, perks: newPerks };
        });
    };
    const isPerkDisabled = (perk: CompanionOption) => {
        if (!perk.requirement) return false;
        if (perk.requirement.includes("Requires Tank or Mecha") && !['tank', 'mecha'].includes(selections.category ?? '')) return true;
        return false;
    };
    const getModifiedPerk = (perk: CompanionOption): CompanionOption => {
        if (perk.id === 'chatterbox_vehicle' && selections.category === 'car') return { ...perk, cost: 0 };
        if (perk.id === 'hellfire_volley' && (selections.category === 'tank' || selections.category === 'mecha')) return { ...perk, cost: 0 };
        return perk;
    };

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={VEHICLE_INTRO.imageSrc} alt="Vehicles" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{VEHICLE_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{VEHICLE_CATEGORIES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category === item.id} onSelect={handleCategorySelect} />)}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{VEHICLE_PERKS.map(item => {
                if (item.id === 'speed_boost') {
                    const count = selections.perks.get('speed_boost') ?? 0;
                    return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={count > 0} onSelect={() => {}} disabled={isPerkDisabled(item)}><Counter label="Purchases" count={count} onCountChange={handleSpeedBoostChange} cost={`${item.cost} VP each`} max={3} /></ReferenceItemCard>;
                }
                return <ReferenceItemCard key={item.id} item={getModifiedPerk(item)} layout="default" isSelected={selections.perks.has(item.id)} onSelect={handlePerkSelect} disabled={isPerkDisabled(item)} />;
            })}</div></ReferenceSection>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const initialCompanionSelections: CompanionSelections = { category: null, relationship: null, traits: new Set(), perks: new Set(), powerLevel: null };
const initialWeaponSelections: WeaponSelections = { category: null, perks: new Set(), traits: new Set() };
const initialBeastSelections: BeastSelections = { category: null, size: null, perks: new Set(), traits: new Set() };
const initialVehicleSelections: VehicleSelections = { category: null, perks: new Map() };

const BUILD_TYPES: BuildType[] = ['companions', 'weapons', 'beasts', 'vehicles'];

const initialAllBuilds: AllBuilds = { companions: {}, weapons: {}, beasts: {}, vehicles: {} };
const STORAGE_KEY = 'seinaru_magecraft_builds';


export const ReferencePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { fortunePoints, addMiscFpCost } = useCharacterContext();
    const [currentView, setCurrentView] = useState('home');
    const [allBuilds, setAllBuilds] = useState<AllBuilds>(initialAllBuilds);
    const [currentBuild, setCurrentBuild] = useState<{ type: BuildType; name: string } | null>(null);

    const [companionSelections, setCompanionSelections] = useState<CompanionSelections>(initialCompanionSelections);
    const [weaponSelections, setWeaponSelections] = useState<WeaponSelections>(initialWeaponSelections);
    const [beastSelections, setBeastSelections] = useState<BeastSelections>(initialBeastSelections);
    const [vehicleSelections, setVehicleSelections] = useState<VehicleSelections>(initialVehicleSelections);

    const [companionPoints, setCompanionPoints] = useState(0);
    const [weaponPoints, setWeaponPoints] = useState(0);
    const [beastPoints, setBeastPoints] = useState(0);
    const [vehiclePoints, setVehiclePoints] = useState(0);

    useEffect(() => {
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsed = JSON.parse(savedBuildsJSON);
                // Ensure all build types exist as keys to prevent errors
                const completeBuilds: AllBuilds = {
                    companions: parsed.companions || {},
                    weapons: parsed.weapons || {},
                    beasts: parsed.beasts || {},
                    vehicles: parsed.vehicles || {},
                };
                setAllBuilds(completeBuilds);
            } catch {
                setAllBuilds(initialAllBuilds);
            }
        }
    }, []);

    const saveBuildsToStorage = (builds: AllBuilds) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
        setAllBuilds(builds);
    };

    const getSelectionsForType = (type: BuildType) => {
        switch (type) {
            case 'companions': return companionSelections;
            case 'weapons': return weaponSelections;
            case 'beasts': return beastSelections;
            case 'vehicles': return vehicleSelections;
        }
    };

    const sanitizeDataForSave = (type: BuildType, selections: any) => {
        switch (type) {
            case 'companions': return { ...selections, traits: Array.from(selections.traits), perks: Array.from(selections.perks) };
            case 'weapons': return { ...selections, perks: Array.from(selections.perks), traits: Array.from(selections.traits) };
            case 'beasts': return { ...selections, perks: Array.from(selections.perks), traits: Array.from(selections.traits) };
            case 'vehicles': return { ...selections, perks: Array.from(selections.perks.entries()) };
            default: return selections;
        }
    };

    const hydrateDataFromLoad = (type: BuildType, data: any) => {
        switch (type) {
            case 'companions': return { ...data, traits: new Set(data.traits), perks: new Set(data.perks) };
            case 'weapons': return { ...data, perks: new Set(data.perks), traits: new Set(data.traits) };
            case 'beasts': return { ...data, perks: new Set(data.perks), traits: new Set(data.traits) };
            case 'vehicles': return { ...data, perks: new Map(data.perks) };
            default: return data;
        }
    };
    
    const saveBuild = (type: BuildType, name: string) => {
        const selections = getSelectionsForType(type);
        const dataToSave = sanitizeDataForSave(type, selections);
        
        const newAllBuilds: AllBuilds = {
            ...allBuilds,
            [type]: {
                ...allBuilds[type],
                [name]: { version: 1, data: dataToSave },
            },
        };

        saveBuildsToStorage(newAllBuilds);
        setCurrentBuild({ type, name });
        alert(`Build "${name}" saved!`);
    };
    
    const handleSaveCurrentBuild = () => {
        if (currentBuild) {
            saveBuild(currentBuild.type, currentBuild.name);
        }
    };
    
    const handleSaveAsNewBuild = () => {
        const type = currentView as BuildType;
        if (!BUILD_TYPES.includes(type)) return;

        let name = prompt(`Enter a name for your new ${type} build:`);
        if (!name) return;
        
        const isOverwrite = !!allBuilds[type]?.[name];
        const isNewWeaponBuild = type === 'weapons' && !isOverwrite;

        if (isNewWeaponBuild) {
            if (fortunePoints < 5) {
                alert("You need 5 Fortune Points to save a new weapon build.");
                return;
            }
        }
        
        if (isOverwrite) {
            if (!confirm(`A build named "${name}" already exists. Overwrite it?`)) {
                return;
            }
        }
        
        if (isNewWeaponBuild) {
            addMiscFpCost(5);
        }

        saveBuild(type, name);
    };

    const handleStartNew = (type: BuildType) => {
        switch (type) {
            case 'companions': setCompanionSelections(initialCompanionSelections); break;
            case 'weapons': setWeaponSelections(initialWeaponSelections); break;
            case 'beasts': setBeastSelections(initialBeastSelections); break;
            case 'vehicles': setVehicleSelections(initialVehicleSelections); break;
        }
        setCurrentBuild(null);
        setCurrentView(type);
    };

    const handleLoadBuild = (type: BuildType, name: string) => {
        const build = allBuilds[type]?.[name];
        if (!build || build.version !== 1) {
            alert("Failed to load build. Data may be corrupted.");
            return;
        }

        const hydratedData = hydrateDataFromLoad(type, build.data);
        switch (type) {
            case 'companions': setCompanionSelections(hydratedData); break;
            case 'weapons': setWeaponSelections(hydratedData); break;
            case 'beasts': setBeastSelections(hydratedData); break;
            case 'vehicles': setVehicleSelections(hydratedData); break;
        }

        setCurrentBuild({ type, name });
        setCurrentView(type);
    };

    const handleDeleteBuild = (type: BuildType, name: string) => {
        if (confirm(`Are you sure you want to delete the build "${name}"? This cannot be undone.`)) {
            // Refund 5 FP if a weapon build is deleted
            if (type === 'weapons') {
                addMiscFpCost(-5);
            }
            const buildsForType = { ...allBuilds[type] };
            delete buildsForType[name];
            
            const newAllBuilds: AllBuilds = {
                ...allBuilds,
                [type]: buildsForType,
            };
            saveBuildsToStorage(newAllBuilds);
        }
    };

    const TabButton: React.FC<{ view: BuildType, children: React.ReactNode }> = ({ view, children }) => {
        const isActive = currentView === view;
        return <button onClick={() => { setCurrentBuild(null); handleStartNew(view); }} className={`px-6 py-3 font-cinzel text-lg tracking-widest transition-colors ${isActive ? 'bg-cyan-900/50 text-cyan-200' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>{children}</button>;
    };

    const pointsMap: { [key: string]: number } = { companions: companionPoints, weapons: weaponPoints, beasts: beastPoints, vehicles: vehiclePoints };
    const currentPoints = pointsMap[currentView] ?? 0;
    const currentTitle = currentView !== 'home' && currentView !== 'load' ? currentView.charAt(0).toUpperCase() + currentView.slice(1) : '';
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-center items-center" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="reference-page-title">
            <div className="bg-[#0a101f] w-[90vw] max-w-[1600px] h-[90vh] rounded-xl border-2 border-cyan-300/20 shadow-2xl shadow-black flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0 bg-black/20">
                    <h2 id="reference-page-title" className="font-cinzel text-3xl text-white tracking-widest">THE REFERENCE PAGE</h2>
                    {currentView !== 'home' && currentView !== 'load' && <div className="font-cinzel text-xl text-white">{currentBuild ? `Editing: ${currentBuild.name}` : `New ${currentTitle} Build`} | Points Spent: <span className="font-bold text-red-400 ml-2">{currentPoints}</span></div>}
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-4xl" aria-label="Close Reference Page">&times;</button>
                </header>
                {currentView !== 'home' && currentView !== 'load' && <nav className="flex-shrink-0 bg-black/30 border-b border-white/10 flex justify-center"><TabButton view="companions">Companions</TabButton><TabButton view="weapons">Weapons</TabButton><TabButton view="beasts">Beasts</TabButton><TabButton view="vehicles">Vehicles</TabButton></nav>}
                
                <main className="flex-grow overflow-y-auto bg-cover bg-center" style={{backgroundImage: "url('https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Ref/bg.png')"}}>
                    {currentView === 'home' && (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <h3 className="font-cinzel text-4xl text-cyan-200 tracking-widest">Welcome</h3>
                            <p className="text-gray-400 mt-4 max-w-2xl">Create and manage your custom companions, weapons, beasts, and vehicles.</p>
                            <button onClick={() => setCurrentView('load')} className="mt-8 px-10 py-4 font-cinzel text-2xl bg-cyan-700/30 border border-cyan-500 rounded-md hover:bg-cyan-600/40 backdrop-blur-sm transition-colors">
                                LOAD SAVED BUILDS
                            </button>
                            <p className="font-cinzel text-gray-500 tracking-widest text-sm mt-16">OR START A NEW BUILD</p>
                            <div className="flex gap-4 mt-4">
                                {BUILD_TYPES.map(type => ( <button key={type} onClick={() => handleStartNew(type)} className="px-6 py-2 font-cinzel bg-slate-700/40 border border-slate-500 rounded-md hover:bg-slate-600/50 backdrop-blur-sm transition-colors">{type.charAt(0).toUpperCase() + type.slice(1)}</button> ))}
                            </div>
                        </div>
                    )}
                     {currentView === 'load' && (
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-cinzel text-3xl text-cyan-200 tracking-widest">Load a Build</h3>
                                <button onClick={() => setCurrentView('home')} className="px-4 py-2 font-cinzel bg-slate-700/40 border border-slate-500 rounded-md hover:bg-slate-600/50 backdrop-blur-sm transition-colors">← Back to Home</button>
                            </div>
                            <div className="space-y-8">
                                {BUILD_TYPES.map(type => (
                                    <div key={type}>
                                        <h4 className="font-cinzel text-2xl text-white tracking-wider border-b-2 border-cyan-700/50 pb-2 mb-4">{type.toUpperCase()}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {Object.keys(allBuilds[type]).length > 0 ? Object.keys(allBuilds[type]).map(name => (
                                                <div key={name} className="bg-black/30 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                                                    <span className="text-gray-300 font-semibold">{name}</span>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleLoadBuild(type, name)} className="px-3 py-1 text-sm font-cinzel bg-cyan-800/40 border border-cyan-600 rounded-md hover:bg-cyan-700/60 backdrop-blur-sm transition-colors">Load</button>
                                                        <button onClick={() => handleDeleteBuild(type, name)} className="px-3 py-1 text-sm font-cinzel bg-red-800/30 border border-red-600 rounded-md hover:bg-red-700/50 backdrop-blur-sm transition-colors">Delete</button>
                                                    </div>
                                                </div>
                                            )) : <p className="text-gray-500 italic col-span-full">No saved builds for this category.</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {currentView === 'companions' && <CompanionSection selections={companionSelections} setSelections={setCompanionSelections} setPoints={setCompanionPoints} />}
                    {currentView === 'weapons' && <WeaponSection selections={weaponSelections} setSelections={setWeaponSelections} setPoints={setWeaponPoints} />}
                    {currentView === 'beasts' && <BeastSection selections={beastSelections} setSelections={setBeastSelections} setPoints={setBeastPoints} />}
                    {currentView === 'vehicles' && <VehicleSection selections={vehicleSelections} setSelections={setVehicleSelections} setPoints={setVehiclePoints} />}
                </main>

                {currentView !== 'home' && currentView !== 'load' && (
                    <footer className="flex justify-center items-center gap-4 p-3 border-t border-white/10 bg-black/20 flex-shrink-0">
                        {currentBuild ? (
                            <>
                                <button onClick={handleSaveCurrentBuild} className="px-8 py-3 font-cinzel text-lg bg-green-800/40 border border-green-600 rounded-md hover:bg-green-700/50 backdrop-blur-sm transition-colors">Save Changes</button>
                                <button onClick={handleSaveAsNewBuild} className="px-8 py-3 font-cinzel text-lg bg-blue-800/40 border border-blue-600 rounded-md hover:bg-blue-700/50 backdrop-blur-sm transition-colors">
                                    Save As New...
                                    {currentView === 'weapons' && <span className="text-red-400 text-sm ml-2">(-5 FP)</span>}
                                </button>
                            </>
                        ) : (
                            <button onClick={handleSaveAsNewBuild} className="px-8 py-3 font-cinzel text-lg bg-green-800/40 border border-green-600 rounded-md hover:bg-green-700/50 backdrop-blur-sm transition-colors">
                                Save New Build...
                                {currentView === 'weapons' && <span className="text-red-400 text-sm ml-2">(-5 FP)</span>}
                            </button>
                        )}
                    </footer>
                )}
            </div>
        </div>
      );
};