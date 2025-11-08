import React, { useState, useEffect } from 'react';
import { WEAPON_PERKS, COMPANION_PERSONALITY_TRAITS } from '../constants';
import type { AllBuilds, WeaponSelections } from '../types';

const STORAGE_KEY = 'seinaru_magecraft_builds';

const calculateWeaponPoints = (selections: WeaponSelections): number => {
    let total = 0;
    // No category cost for weapons
    if (selections.perks) {
        selections.perks.forEach(perkId => {
            const perk = WEAPON_PERKS.find(p => p.id === perkId);
            if (perk) total += perk.cost ?? 0;
        });
    }
    if (selections.perks && selections.perks.has('chatterbox') && selections.traits) {
        selections.traits.forEach(traitId => {
            const trait = COMPANION_PERSONALITY_TRAITS.find(t => t.id === traitId);
            if (trait) total += trait.cost ?? 0;
        });
    }
    return total;
};

const hydrateWeaponData = (data: any): WeaponSelections => {
    if (data) {
        return {
            ...data,
            perks: new Set(data.perks || []),
            traits: new Set(data.traits || []),
        };
    }
    return data;
};


interface WeaponSelectionModalProps {
    currentWeaponName: string | null;
    onClose: () => void;
    onSelect: (weaponName: string | null) => void;
}

export const WeaponSelectionModal: React.FC<WeaponSelectionModalProps> = ({
    currentWeaponName,
    onClose,
    onSelect,
}) => {
    const [weaponBuilds, setWeaponBuilds] = useState<Record<string, { points: number }>>({});
    const WEAPON_POINT_LIMIT = 20;

    useEffect(() => {
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsedBuilds: AllBuilds = JSON.parse(savedBuildsJSON);
                const weapons = parsedBuilds.weapons || {};
                const buildsWithPoints: Record<string, { points: number }> = {};
                
                for (const name in weapons) {
                    const build = weapons[name];
                    if (build.version === 1) {
                        const hydratedData = hydrateWeaponData(build.data);
                        const points = calculateWeaponPoints(hydratedData);
                        buildsWithPoints[name] = { points };
                    }
                }
                setWeaponBuilds(buildsWithPoints);
            } catch (error) {
                console.error("Failed to parse weapon builds from storage:", error);
            }
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[101] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="weapon-modal-title"
        >
            <div
                className="bg-[#100c14] border-2 border-purple-700/80 rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-purple-900/50">
                    <h2 id="weapon-modal-title" className="font-cinzel text-2xl text-purple-200">
                        Assign Weapon
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-purple-200/70 hover:text-white text-3xl font-bold transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <p className="text-center text-sm text-purple-300/80 mb-4 italic">
                        Select a weapon build that costs 20 Weapon Points or less.
                    </p>
                    <div className="space-y-3">
                        {Object.keys(weaponBuilds).length > 0 ? (
                            // FIX: Replaced Object.entries with Object.keys to fix a TypeScript inference issue where the build's value was incorrectly typed as '{}'.
                            Object.keys(weaponBuilds).map((name) => {
                                const { points } = weaponBuilds[name];
                                const isSelected = name === currentWeaponName;
                                const isDisabled = points > WEAPON_POINT_LIMIT;
                                const costColor = isDisabled ? 'text-red-500' : 'text-green-400';
                                
                                return (
                                    <div
                                        key={name}
                                        onClick={() => !isDisabled && onSelect(name)}
                                        className={`p-3 bg-slate-900/70 border rounded-md flex justify-between items-center transition-colors ${
                                            isDisabled 
                                                ? 'border-gray-700 opacity-60 cursor-not-allowed'
                                                : isSelected
                                                    ? 'border-purple-400 ring-2 ring-purple-400/50 cursor-pointer'
                                                    : 'border-gray-800 hover:border-purple-400/50 cursor-pointer'
                                        }`}
                                        role="button"
                                        aria-disabled={isDisabled}
                                        aria-pressed={isSelected}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white">{name}</h3>
                                            <p className="text-xs text-gray-400">
                                                {isDisabled ? `Cost exceeds ${WEAPON_POINT_LIMIT} points` : 'Click to assign this weapon'}
                                            </p>
                                        </div>
                                        <span className={`font-bold text-lg ${costColor}`}>
                                            {points} WP
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 italic py-8">
                                No weapon builds found. Go to the Reference Page to create one!
                            </p>
                        )}
                    </div>
                </main>
                 <footer className="p-3 border-t border-purple-900/50 text-center">
                    <button
                        onClick={() => onSelect(null)}
                        className="px-4 py-2 text-sm font-cinzel bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Clear Assignment
                    </button>
                </footer>
            </div>
        </div>
    );
};
