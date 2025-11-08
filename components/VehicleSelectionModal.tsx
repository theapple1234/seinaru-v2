import React, { useState, useEffect } from 'react';
import { VEHICLE_CATEGORIES, VEHICLE_PERKS } from '../constants';
import type { AllBuilds, VehicleSelections } from '../types';

const STORAGE_KEY = 'seinaru_magecraft_builds';

const calculateVehiclePoints = (selections: VehicleSelections): number => {
    let total = 0;
    if (selections.category) {
        total += VEHICLE_CATEGORIES.find(c => c.id === selections.category)?.cost ?? 0;
    }
    selections.perks.forEach((count, perkId) => {
        const perk = VEHICLE_PERKS.find(p => p.id === perkId);
        if (perk) {
            let cost = perk.cost ?? 0;
            if (perkId === 'chatterbox_vehicle' && selections.category === 'car') cost = 0;
            if (perkId === 'hellfire_volley' && (selections.category === 'tank' || selections.category === 'mecha')) cost = 0;
            total += cost * count;
        }
    });
    return total;
};

const hydrateVehicleData = (data: any): VehicleSelections => {
    if (data && data.perks && ! (data.perks instanceof Map)) {
        return { ...data, perks: new Map(data.perks) };
    }
    return data;
};

interface VehicleSelectionModalProps {
    currentVehicleName: string | null;
    onClose: () => void;
    onSelect: (vehicleName: string | null) => void;
}

export const VehicleSelectionModal: React.FC<VehicleSelectionModalProps> = ({
    currentVehicleName,
    onClose,
    onSelect,
}) => {
    const [vehicleBuilds, setVehicleBuilds] = useState<Record<string, { points: number }>>({});

    useEffect(() => {
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsedBuilds: AllBuilds = JSON.parse(savedBuildsJSON);
                const vehicles = parsedBuilds.vehicles || {};
                const buildsWithPoints: Record<string, { points: number }> = {};
                
                for (const name in vehicles) {
                    const build = vehicles[name];
                    if (build.version === 1) {
                        const hydratedData = hydrateVehicleData(build.data);
                        const points = calculateVehiclePoints(hydratedData);
                        buildsWithPoints[name] = { points };
                    }
                }
                setVehicleBuilds(buildsWithPoints);
            } catch (error) {
                console.error("Failed to parse vehicle builds from storage:", error);
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-modal-title"
        >
            <div
                className="bg-[#0a101f] border-2 border-cyan-700/80 rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-cyan-900/50">
                    <h2 id="vehicle-modal-title" className="font-cinzel text-2xl text-cyan-200">
                        Assign Signature Vehicle
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-cyan-200/70 hover:text-white text-3xl font-bold transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="space-y-3">
                        {Object.keys(vehicleBuilds).length > 0 ? (
                            // FIX: Replaced Object.entries with Object.keys to fix a TypeScript inference issue where the build's value was incorrectly typed as '{}'.
                            Object.keys(vehicleBuilds).map((name) => {
                                const { points } = vehicleBuilds[name];
                                const isSelected = name === currentVehicleName;
                                const isDisabled = points > 30;
                                const costColor = isDisabled ? 'text-red-500' : 'text-green-400';
                                
                                return (
                                    <div
                                        key={name}
                                        onClick={() => !isDisabled && onSelect(name)}
                                        className={`p-3 bg-slate-900/70 border rounded-md flex justify-between items-center transition-colors ${
                                            isDisabled 
                                                ? 'border-gray-700 opacity-60 cursor-not-allowed'
                                                : isSelected
                                                    ? 'border-cyan-400 ring-2 ring-cyan-400/50 cursor-pointer'
                                                    : 'border-gray-800 hover:border-cyan-400/50 cursor-pointer'
                                        }`}
                                        role="button"
                                        aria-disabled={isDisabled}
                                        aria-pressed={isSelected}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white">{name}</h3>
                                            <p className="text-xs text-gray-400">
                                                {isDisabled ? 'Cost exceeds 30 points' : 'Click to assign this vehicle'}
                                            </p>
                                        </div>
                                        <span className={`font-bold text-lg ${costColor}`}>
                                            {points} VP
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 italic py-8">
                                No vehicle builds found. Go to the Reference Page to create one!
                            </p>
                        )}
                    </div>
                </main>
                 <footer className="p-3 border-t border-cyan-900/50 text-center">
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
