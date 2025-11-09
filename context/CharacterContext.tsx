import React, { createContext, useState, useMemo, useEffect, useContext, ReactNode } from 'react';
import { 
  DOMINIONS, TRAITS_DATA, HOUSES_DATA, HOUSE_UPGRADES_DATA, 
  TRUE_SELF_TRAITS, ALTER_EGO_TRAITS, MAGICAL_STYLES_DATA, 
  BUILD_TYPES_DATA, HEADMASTERS_DATA, TEACHERS_DATA,
  DURATION_DATA, CLUBS_DATA, MISC_ACTIVITIES_DATA, CLASSMATES_DATA,
  CUSTOM_CLASSMATE_CHOICES_DATA,
  BLESSING_ENGRAVINGS, COMMON_SIGILS_DATA, SPECIAL_SIGILS_DATA,
  GOOD_TIDINGS_SIGIL_TREE_DATA,
  COMPELLING_WILL_SIGIL_TREE_DATA,
  WORLDLY_WISDOM_SIGIL_TREE_DATA,
  BITTER_DISSATISFACTION_SIGIL_TREE_DATA,
  LOST_HOPE_SIGIL_TREE_DATA,
  FALLEN_PEACE_SIGIL_TREE_DATA,
  GRACIOUS_DEFEAT_SIGIL_TREE_DATA,
  CLOSED_CIRCUITS_SIGIL_TREE_DATA,
  RIGHTEOUS_CREATION_SIGIL_TREE_DATA,
  STAR_CROSSED_LOVE_SIGIL_TREE_DATA,
  LIMITLESS_POTENTIAL_RUNES_DATA, ALLMILLOR_CHOICES_DATA, CAREER_GOALS_DATA,
  COLLEAGUES_DATA, CUSTOM_COLLEAGUE_CHOICES_DATA, RETIREMENT_CHOICES_DATA, CHILD_OF_GOD_DATA,
  UNIFORMS_DATA
} from '../constants';
import { usePageOneState } from '../hooks/usePageOneState';
import { usePageTwoState } from '../hooks/usePageTwoState';
import { usePageThreeState } from '../hooks/usePageThreeState';
import { usePageFourState } from '../hooks/usePageFourState';
import { usePageFiveState } from '../hooks/usePageFiveState';
import { usePageSixState } from '../hooks/usePageSixState';
// FIX: Import SigilCounts to use in ICharacterContext
import type { SigilCounts } from '../types';

// --- Helper Functions and Constants ---
const PARENT_COST_MAP: { [key: number]: number } = { 0: -20, 1: -10, 2: 0, 3: 3, 4: 8, 5: 15, 6: 24 }; // FP cost
const SIBLING_COST_PER = 3; // FP cost per sibling

type Cost = { fp: number; bp: number };

const parseCost = (costString: string): Cost => {
  const cost: Cost = { fp: 0, bp: 0 };
  if (!costString || costString.toLowerCase().includes('free') || costString.toLowerCase().includes('costs 0') || costString.toLowerCase().includes('variable')) {
    return cost;
  }
  
  const isGrant = costString.toLowerCase().startsWith('grants');
  
  let processedString = costString;
  if (costString.toLowerCase().includes('or')) {
    processedString = costString.split(/or/i)[0];
  }

  // Handle costs like "use -3 BP"
  processedString = processedString.replace(/use (-?\d+)/, '$1');
  
  const fpMatch = processedString.match(/(-?\d+)\s*FP/i);
  if (fpMatch) {
    let value = parseInt(fpMatch[1], 10);
    if (isGrant) {
      cost.fp = -Math.abs(value);
    } else {
      cost.fp = Math.abs(value);
    }
  }

  const bpMatch = processedString.match(/(-?\d+)\s*BP/i);
  if (bpMatch) {
    let value = parseInt(bpMatch[1], 10);
    if (isGrant) {
      cost.bp = -Math.abs(value);
    } else {
      cost.bp = Math.abs(value);
    }
  }
  
  return cost;
};

// --- Context Definition ---
// The context interface includes return types from all state hooks
type PageOneState = ReturnType<typeof usePageOneState>;
type PageTwoState = ReturnType<typeof usePageTwoState>;
type PageThreeState = ReturnType<typeof usePageThreeState>;
type PageFourState = ReturnType<typeof usePageFourState>;
type PageFiveState = ReturnType<typeof usePageFiveState>;
type PageSixState = ReturnType<typeof usePageSixState>;

interface ICharacterContext extends 
    PageOneState, PageTwoState, PageThreeState, PageFourState, PageFiveState, PageSixState 
{
  selectedDominionId: string | null;
  handleSelectDominion: (id: string) => void;
  blessingPoints: number;
  fortunePoints: number;
  // FIX: Add availableSigilCounts and totalSigilCounts to the context type
  availableSigilCounts: SigilCounts;
  totalSigilCounts: SigilCounts;
  isReferencePageOpen: boolean;
  openReferencePage: () => void;
  closeReferencePage: () => void;
  addMiscFpCost: (amount: number) => void;
}

const CharacterContext = createContext<ICharacterContext | undefined>(undefined);

export const useCharacterContext = () => {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error('useCharacterContext must be used within a CharacterProvider');
    }
    return context;
};

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- GLOBAL & CROSS-PAGE STATE ---
    const [selectedDominionId, setSelectedDominionId] = useState<string | null>(DOMINIONS[0].id);
    const [blessingPoints, setBlessingPoints] = useState(100);
    const [fortunePoints, setFortunePoints] = useState(100);
    const [isReferencePageOpen, setIsReferencePageOpen] = useState(false);
    const [miscFpCosts, setMiscFpCosts] = useState(0);

    // --- PAGE-SPECIFIC STATE HOOKS ---
    const pageOneState = usePageOneState();
    const pageTwoState = usePageTwoState({ isMultiplayer: pageOneState.isMultiplayer });
    // FIX: Added missing usePageThreeState hook and reordered hooks for clarity. This resolves multiple 'pageThreeState' is not defined errors.
    const pageThreeState = usePageThreeState();
    const pageFourState = usePageFourState();
    const pageFiveState = usePageFiveState({ isMultiplayer: pageOneState.isMultiplayer });
    const pageSixState = usePageSixState();
    
    // --- COMPLEX INTER-DEPENDENT STATE (SIGILS & PAGE 3) ---
    // 1. Calculate total sigils acquired from Page 3 state
    const totalSigilCounts = useMemo(() => {
        const totals = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        totals.kaarn = pageThreeState.acquiredCommonSigils.get('kaarn') ?? 0;
        totals.purth = pageThreeState.acquiredCommonSigils.get('purth') ?? 0;
        totals.juathas = pageThreeState.acquiredCommonSigils.get('juathas') ?? 0;
        totals.xuth = pageThreeState.selectedSpecialSigilChoices.get('xuth')?.size ?? 0;
        totals.sinthru = pageThreeState.selectedSpecialSigilChoices.get('sinthru')?.size ?? 0;
        let lekoluTotal = 0;
        for (const count of pageThreeState.acquiredLekoluJobs.values()) {
            lekoluTotal += count;
        }
        totals.lekolu = lekoluTotal;
        return totals;
    }, [pageThreeState.acquiredCommonSigils, pageThreeState.selectedSpecialSigilChoices, pageThreeState.acquiredLekoluJobs]);

    // 2. Calculate sigils used by blessings from Page 3 state
    const { usedSigilCounts } = pageThreeState; // This is now calculated within the hook

    // 3. Calculate available sigils
    const availableSigilCounts = useMemo(() => ({
        kaarn: totalSigilCounts.kaarn - usedSigilCounts.kaarn,
        purth: totalSigilCounts.purth - usedSigilCounts.purth,
        juathas: totalSigilCounts.juathas - usedSigilCounts.juathas,
        xuth: totalSigilCounts.xuth - usedSigilCounts.xuth,
        sinthru: totalSigilCounts.sinthru - usedSigilCounts.sinthru,
        lekolu: totalSigilCounts.lekolu - usedSigilCounts.lekolu,
    }), [totalSigilCounts, usedSigilCounts]);

    // 4. Pass available counts back to the Page 3 hook to update its internal logic
    // This is a bit of a workaround for the circular dependency. The hook is called again with new props.
    // In a real app, you might lift more state up or use a reducer. For this structure, we pass it back.
    useEffect(() => {
        pageThreeState.setAvailableSigilCounts(availableSigilCounts);
    }, [availableSigilCounts, pageThreeState.setAvailableSigilCounts]);


    // --- COST CALCULATION ---
    const lekoluSubOptions = SPECIAL_SIGILS_DATA.find(s => s.id === 'lekolu')?.subOptions || [];
    const ALL_CAREER_GOALS = useMemo(() => [ ...CAREER_GOALS_DATA.proSports, ...CAREER_GOALS_DATA.general, ...CAREER_GOALS_DATA.finishingTouches ], []);

    const ALL_ITEMS_WITH_COSTS = useMemo(() => [
        ...TRAITS_DATA.positive, ...TRAITS_DATA.negative,
        ...HOUSES_DATA, ...HOUSE_UPGRADES_DATA,
        ...TRUE_SELF_TRAITS, ...ALTER_EGO_TRAITS, ...UNIFORMS_DATA,
        ...MAGICAL_STYLES_DATA, ...BUILD_TYPES_DATA,
        ...HEADMASTERS_DATA, ...TEACHERS_DATA, ...DURATION_DATA,
        ...CLUBS_DATA, ...MISC_ACTIVITIES_DATA, ...CLASSMATES_DATA,
        ...CUSTOM_CLASSMATE_CHOICES_DATA,
        ...BLESSING_ENGRAVINGS, ...COMMON_SIGILS_DATA, 
        ...SPECIAL_SIGILS_DATA.map(s => ({...s, cost: s.id === 'lekolu' ? '' : s.cost})),
        ...lekoluSubOptions.map(sub => ({...sub, cost: SPECIAL_SIGILS_DATA.find(s => s.id === 'lekolu')?.cost || ''})),
        ...GOOD_TIDINGS_SIGIL_TREE_DATA,
        ...LIMITLESS_POTENTIAL_RUNES_DATA, ...ALLMILLOR_CHOICES_DATA,
        ...ALL_CAREER_GOALS, ...COLLEAGUES_DATA, ...CUSTOM_COLLEAGUE_CHOICES_DATA,
        ...RETIREMENT_CHOICES_DATA, ...CHILD_OF_GOD_DATA,
    ], [ALL_CAREER_GOALS, lekoluSubOptions]);

    const ALL_COSTS = useMemo(() => {
        const costs = new Map<string, Cost>();
        ALL_ITEMS_WITH_COSTS.forEach(item => {
        if (item.id) costs.set(item.id, parseCost(item.cost));
        });
        return costs;
    }, [ALL_ITEMS_WITH_COSTS]);

    useEffect(() => {
        let totalFpCost = 0;
        let totalBpCost = 0;
        const accumulateCost = (id: string | null) => {
          if (!id) return;
          const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
          totalFpCost += cost.fp;
          totalBpCost += cost.bp;
        };
        const dominion = DOMINIONS.find(d => d.id === selectedDominionId);
        const dominionName = dominion?.title.toUpperCase();

        // Page 1
        totalFpCost += PARENT_COST_MAP[pageOneState.numParents] ?? (pageOneState.numParents > 0 ? (pageOneState.numParents - 2) * 5 + 3 : -20);
        totalFpCost += pageOneState.numSiblings * SIBLING_COST_PER;
        pageOneState.assignedTraits.forEach((traits) => { traits.forEach(accumulateCost); });
        accumulateCost(pageOneState.selectedHouseId);
        pageOneState.selectedUpgrades.forEach(id => {
            if (id === 'virtual_reality') {
                if (pageOneState.vrChamberCostType === 'fp') totalFpCost += 3;
                else if (pageOneState.vrChamberCostType === 'bp') totalBpCost += 2;
            } else {
                accumulateCost(id);
            }
        });
        totalFpCost += pageOneState.vacationHomeCount * 3;
        if (pageOneState.selectedHouseId === 'mansion') {
            totalFpCost += pageOneState.mansionExtraSqFt * 1;
        }
        if (pageOneState.selectedUpgrades.has('private_island')) {
            totalFpCost += pageOneState.islandExtraMiles * 1;
        }

        pageOneState.selectedTrueSelfTraits.forEach(accumulateCost);
        pageOneState.selectedAlterEgoTraits.forEach(accumulateCost);
        pageOneState.selectedUniforms.slice(1).forEach(accumulateCost);
        pageOneState.selectedMagicalStyles.forEach(accumulateCost);

        // Page 2
        accumulateCost(pageTwoState.selectedHeadmasterId);
        pageTwoState.selectedTeacherIds.forEach(accumulateCost);
        accumulateCost(pageTwoState.selectedDurationId);
        pageTwoState.selectedClubIds.forEach(accumulateCost);
        pageTwoState.selectedMiscActivityIds.forEach(accumulateCost);
        pageTwoState.selectedClassmateIds.forEach(id => {
            const classmate = CLASSMATES_DATA.find(c => c.id === id);
            const cost = ALL_COSTS.get(id) ?? { fp: 0, bp: 0 };
            let currentFpCost = cost.fp;
            if (classmate && dominionName && classmate.birthplace.toUpperCase() === dominionName) {
                currentFpCost -= 2;
            }
            totalFpCost += currentFpCost;
            totalBpCost += cost.bp;
        });
        pageTwoState.customClassmates.forEach(c => accumulateCost(c.optionId));
        if (pageTwoState.isBoardingSchool && pageOneState.selectedHouseId === 'ragamuffin') {
            totalFpCost += 8;
        }
        
        // Page 3
        const allBlessingEngravings = [
            pageThreeState.goodTidingsEngraving,
            pageThreeState.compellingWillEngraving,
            pageThreeState.worldlyWisdomEngraving,
            pageThreeState.bitterDissatisfactionEngraving,
            pageThreeState.lostHopeEngraving,
            pageThreeState.fallenPeaceEngraving,
            pageThreeState.graciousDefeatEngraving,
            pageThreeState.closedCircuitsEngraving,
            pageThreeState.righteousCreationEngraving,
        ];
        
        for (const engraving of allBlessingEngravings) {
            const finalEngraving = engraving ?? pageThreeState.selectedBlessingEngraving;
            if (finalEngraving === 'weapon') {
                // Costs for weapon engraving are now handled on the Reference Page when saving a new build.
            }
        }
        
        // BP Refund Logic for weapon engravings + juathas sigil
        let bpRefund = 0;
        const checkRefund = (engraving: string | null, sigilSet: Set<string>, juathasSigilId: string) => {
            const finalEngraving = engraving ?? pageThreeState.selectedBlessingEngraving;
            if (finalEngraving === 'weapon' && sigilSet.has(juathasSigilId)) {
                bpRefund++;
            }
        };

        const refundMap = [
            { engraving: pageThreeState.compellingWillEngraving, sigils: pageThreeState.selectedCompellingWillSigils, juathasId: 'manipulator' },
            { engraving: pageThreeState.worldlyWisdomEngraving, sigils: pageThreeState.selectedWorldlyWisdomSigils, juathasId: 'arborealist' },
            { engraving: pageThreeState.bitterDissatisfactionEngraving, sigils: pageThreeState.selectedBitterDissatisfactionSigils, juathasId: 'fireborn' },
            { engraving: pageThreeState.lostHopeEngraving, sigils: pageThreeState.selectedLostHopeSigils, juathasId: 'young_witch' },
            { engraving: pageThreeState.fallenPeaceEngraving, sigils: pageThreeState.selectedFallenPeaceSigils, juathasId: 'left_brained' },
            { engraving: pageThreeState.graciousDefeatEngraving, sigils: pageThreeState.selectedGraciousDefeatSigils, juathasId: 'gd_fireborn' },
            { engraving: pageThreeState.closedCircuitsEngraving, sigils: pageThreeState.selectedClosedCircuitsSigils, juathasId: 'script_kiddy' },
            { engraving: pageThreeState.righteousCreationEngraving, sigils: pageThreeState.selectedRighteousCreationSigils, juathasId: 'rookie_engineer' },
        ];

        for (const { engraving, sigils, juathasId } of refundMap) {
            checkRefund(engraving, sigils, juathasId);
        }
        totalBpCost -= bpRefund;

        if (pageThreeState.selectedMetathermics.has('thermal_weaponry')) {
            totalFpCost -= 5;
        }
        if (pageThreeState.selectedNaniteControls.has('heavily_armed')) {
            totalFpCost -= 5;
        }
        if (pageThreeState.selectedMagitechPowers.has('weaponsmith')) {
            totalFpCost -= 5;
        }


        pageThreeState.acquiredCommonSigils.forEach((count, id) => {
            const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
            totalFpCost += cost.fp * count;
            totalBpCost += cost.bp * count;
        });
        pageThreeState.acquiredLekoluJobs.forEach((count, id) => {
            const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
            totalFpCost += cost.fp * count;
            totalBpCost += cost.bp * count;
        });
        pageThreeState.selectedSpecialSigilChoices.forEach((subOptionSet, sigilId) => {
            if (sigilId !== 'lekolu') {
                const cost = ALL_COSTS.get(sigilId) ?? { fp: 0, bp: 0 };
                const count = subOptionSet.size;
                totalFpCost += cost.fp * count;
                totalBpCost += cost.bp * count;
            }
        });
        
        // Magician Trait cost modifications
        const magicianBlessings = [
            { isApplied: pageThreeState.isGoodTidingsMagicianApplied, cost: pageThreeState.goodTidingsSigilTreeCost },
            { isApplied: pageThreeState.isCompellingWillMagicianApplied, cost: pageThreeState.compellingWillSigilTreeCost },
            { isApplied: pageThreeState.isWorldlyWisdomMagicianApplied, cost: pageThreeState.worldlyWisdomSigilTreeCost },
            { isApplied: pageThreeState.isBitterDissatisfactionMagicianApplied, cost: pageThreeState.bitterDissatisfactionSigilTreeCost },
            { isApplied: pageThreeState.isLostHopeMagicianApplied, cost: pageThreeState.lostHopeSigilTreeCost },
            { isApplied: pageThreeState.isFallenPeaceMagicianApplied, cost: pageThreeState.fallenPeaceSigilTreeCost },
            { isApplied: pageThreeState.isGraciousDefeatMagicianApplied, cost: pageThreeState.graciousDefeatSigilTreeCost },
            { isApplied: pageThreeState.isClosedCircuitsMagicianApplied, cost: pageThreeState.closedCircuitsSigilTreeCost },
            { isApplied: pageThreeState.isRighteousCreationMagicianApplied, cost: pageThreeState.righteousCreationSigilTreeCost },
        ];

        if (pageOneState.selectedTrueSelfTraits.has('magician')) {
            magicianBlessings.forEach(blessing => {
                if (blessing.isApplied) {
                    totalBpCost += Math.floor(blessing.cost * 0.25);
                }
            });
        }
        
        // Page 4
        const ruhaiCount = pageFourState.acquiredRunes.get('ruhai') ?? 0;
        const mialgrathCount = pageFourState.acquiredRunes.get('mialgrath') ?? 0;
        totalBpCost += (ALL_COSTS.get('ruhai')?.bp ?? 0) * ruhaiCount;
        totalBpCost += (ALL_COSTS.get('mialgrath')?.bp ?? 0) * mialgrathCount;


        // Page 5
        pageFiveState.selectedAllmillorIds.forEach(accumulateCost);
        pageFiveState.selectedCareerGoalIds.forEach(accumulateCost);
        pageFiveState.selectedColleagueIds.forEach(id => {
            const colleague = COLLEAGUES_DATA.find(c => c.id === id);
            const cost = ALL_COSTS.get(id) ?? { fp: 0, bp: 0 };
            let currentFpCost = cost.fp;
            if (colleague && dominionName && colleague.birthplace.toUpperCase() === dominionName) {
                if (currentFpCost > 0) currentFpCost = Math.max(0, currentFpCost - 2);
            }
            totalFpCost += currentFpCost;
            totalBpCost += cost.bp;
        });
        pageFiveState.customColleagues.forEach(c => accumulateCost(c.optionId));
        
        // Page 6
        accumulateCost(pageSixState.selectedRetirementChoiceId);
        accumulateCost(pageSixState.selectedChildOfGodChoiceId);
        
        // Misc Costs
        totalFpCost += miscFpCosts;

        setFortunePoints(100 - totalFpCost);
        setBlessingPoints(100 - totalBpCost);
    }, [
        selectedDominionId, ALL_COSTS, miscFpCosts,
        pageOneState, pageTwoState, pageThreeState, pageFourState, pageFiveState, pageSixState
    ]);
    
    const handleSelectDominion = (id: string) => setSelectedDominionId(id);
    const openReferencePage = () => setIsReferencePageOpen(true);
    const closeReferencePage = () => setIsReferencePageOpen(false);
    const addMiscFpCost = (amount: number) => setMiscFpCosts(prev => prev + amount);

    const contextValue: ICharacterContext = {
      selectedDominionId, handleSelectDominion,
      blessingPoints, fortunePoints,
      isReferencePageOpen, openReferencePage, closeReferencePage,
      addMiscFpCost,
      ...pageOneState,
      ...pageTwoState,
      ...pageThreeState,
      availableSigilCounts, // Add calculated sigil counts to context
      totalSigilCounts,
      ...pageFourState,
      ...pageFiveState,
      ...pageSixState,
    };

    return (
        <CharacterContext.Provider value={contextValue}>
            {children}
        </CharacterContext.Provider>
    );
};