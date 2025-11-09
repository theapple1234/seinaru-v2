import React, { useState, useEffect } from 'react';
import { BEAST_CATEGORIES, BEAST_SIZES, BEAST_PERKS, COMPANION_PERSONALITY_TRAITS } from '../constants';
import type { AllBuilds, BeastSelections } from '../types';

const STORAGE_KEY = 'seinaru_magecraft_builds';

const calculateBeastPoints = (selections: BeastSelections): number => {
    let total = 0;
    if (selections.category) {
        total += BEAST_CATEGORIES.find(c => c.id === selections.category)?.cost ?? 0;
    }
    if (selections.size) {
        total += BEAST_SIZES.find(s => s.id === selections.size)?.cost ?? 0;
    }
    selections.perks.forEach(perkId => {
        const perk = BEAST_PERKS.find(p => p.id === perkId);
        if (perk) {
            let cost = perk.cost ?? 0;
            // Handle free perks based on other selections
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
    return total;
};

const hydrateBeastData = (data: any): BeastSelections => {
    if (data) {
        return {
            ...data,
            perks: new Set(data.perks || []),
            traits: new Set(data.traits || []),
        };
    }
    return data;
};

interface BeastSelectionModalProps {
    currentBeastName: string | null;
    onClose: () => void;
    onSelect: (beastName: string | null) => void;
    pointLimit: number | typeof Infinity;
    title: string;
    categoryFilter?: string;
    excludedPerkIds?: string[];
}

export const BeastSelectionModal: React.FC<BeastSelectionModalProps> = ({
    currentBeastName,
    onClose,
    onSelect,
    pointLimit,
    title,
    categoryFilter,
    excludedPerkIds,
}) => {
    const [beastBuilds, setBeastBuilds] = useState<Record<string, { points: number }>>({});

    useEffect(() => {
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsedBuilds: AllBuilds = JSON.parse(savedBuildsJSON);
                const beasts = parsedBuilds.beasts || {};
                const buildsWithPoints: Record<string, { points: number }> = {};
                
                for (const name in beasts) {
                    const build = beasts[name];
                    if (build.version === 1) {
                        const hydratedData = hydrateBeastData(build.data);
                        
                        if (categoryFilter && hydratedData.category !== categoryFilter) {
                            continue;
                        }

                        if (excludedPerkIds && excludedPerkIds.some(perkId => hydratedData.perks.has(perkId))) {
                            continue;
                        }

                        const points = calculateBeastPoints(hydratedData);
                        buildsWithPoints[name] = { points };
                    }
                }
                setBeastBuilds(buildsWithPoints);
            } catch (error) {
                console.error("Failed to parse beast builds from storage:", error);
            }
        }
    }, [categoryFilter, excludedPerkIds]);

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
            aria-labelledby="beast-modal-title"
        >
            <div
                className="bg-[#100c14] border-2 border-purple-700/80 rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-purple-900/50">
                    <h2 id="beast-modal-title" className="font-cinzel text-2xl text-purple-200">
                        {title}
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
                        {pointLimit === Infinity
                            ? "Select any beast build."
                            : `Select a beast build that costs ${pointLimit} Beast Points or less.`}
                        {categoryFilter && ` Must have category: ${categoryFilter.toUpperCase()}.`}
                    </p>
                    <div className="space-y-3">
                        {Object.keys(beastBuilds).length > 0 ? (
                            Object.keys(beastBuilds).map((name) => {
                                const { points } = beastBuilds[name];
                                const isSelected = name === currentBeastName;
                                const isDisabled = pointLimit !== Infinity && points > pointLimit;
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
                                                {isDisabled ? `Cost exceeds ${pointLimit} points` : 'Click to assign this beast'}
                                            </p>
                                        </div>
                                        <span className={`font-bold text-lg ${costColor}`}>
                                            {points} BP
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 italic py-8">
                                No compatible beast builds found. Go to the Reference Page to create one.
                                {categoryFilter && ` Make sure it has the '${categoryFilter.toUpperCase()}' category.`}
                                {excludedPerkIds && excludedPerkIds.length > 0 && " Ensure it does not use restricted perks (*)."}
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