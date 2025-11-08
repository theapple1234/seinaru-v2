import React, { useEffect } from 'react';
import { UNIFORMS_DATA } from '../constants';

interface UniformSelectionModalProps {
    classmateName: string;
    currentUniformId: string | undefined;
    onClose: () => void;
    onSelect: (uniformId: string) => void;
}

export const UniformSelectionModal: React.FC<UniformSelectionModalProps> = ({
    classmateName,
    currentUniformId,
    onClose,
    onSelect,
}) => {
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
            aria-labelledby="uniform-modal-title"
        >
            <div
                className="bg-[#1f1612] border-2 border-yellow-800/80 rounded-xl shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-yellow-900/50">
                    <h2 id="uniform-modal-title" className="font-cinzel text-2xl text-amber-200">
                        Select Uniform for {classmateName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-amber-200/70 hover:text-white text-3xl font-bold transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {UNIFORMS_DATA.map((uniform) => {
                            const isSelected = uniform.id === currentUniformId;
                            const borderClass = isSelected
                                ? 'border-amber-400 ring-2 ring-amber-400'
                                : 'border-gray-800 hover:border-amber-300/70';

                            return (
                                <div
                                    key={uniform.id}
                                    onClick={() => onSelect(uniform.id)}
                                    className={`p-3 bg-black/30 border rounded-lg cursor-pointer transition-colors ${borderClass}`}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isSelected}
                                >
                                    <img
                                        src={uniform.imageSrc}
                                        alt={uniform.title}
                                        className="w-full h-40 object-cover rounded-md mb-3"
                                    />
                                    <h3 className="font-cinzel text-center text-amber-100">{uniform.title}</h3>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
};