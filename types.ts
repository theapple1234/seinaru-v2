

// FIX: Removed conflicting import of 'Dominion' which is declared in this file.
export interface Dominion {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

export interface Trait {
  id: string;
  title: string;
  cost: string;
  description: string;
  imageSrc: string;
}

export interface ChoiceItem {
  id:string;
  title: string;
  cost: string;
  description: string;
  imageSrc: string;
  requires?: string | string[];
}

export interface School {
  id: string;
  title: string;
  description: string;
  costBlurb: string;
  imageSrc: string;
}

export interface Classmate {
  id: string;
  name: string;
  cost: string;
  description: string;
  imageSrc: string;
  birthplace: string;
  signature: string;
  otherPowers: string;
}

export interface Colleague extends Classmate {}

export interface CustomColleagueOption {
    id: string;
    cost: string;
    description: string;
}

export interface SigilSubOption {
  id: string;
  description: string;
  imageSrc: string;
}

export interface Sigil {
  id: string;
  title: string;
  cost: string;
  description: string;
  imageSrc: string;
  subOptions?: SigilSubOption[];
}

export interface GoodTidingsSigilTier {
    id: 'standard' | 'journeyman' | 'master';
    title: string;
    description: string;
    benefits: string;
    cost: string;
    imageSrc: string;
}

export interface CompellingWillSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    unlocks?: string[];
    benefits: {
        telekinetics?: number;
        metathermics?: number;
    };
}

export interface CompellingWillPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; // IDs of required sigils or other powers
}

export interface WorldlyWisdomSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Arborealist' | 'Sanctified' | 'Healer' | 'Dark Art';
    benefits: {
        eleanors?: number;
        genevieves?: number;
    };
    unlocks?: string;
}

export interface WorldlyWisdomPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; 
    specialRequirement?: string;
}

export interface BitterDissatisfactionSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Fireborn' | 'Brewer' | 'Beastmother' | 'Shifter' | 'Mageweaver' | 'Parasitology';
    benefits: {
        brewing?: number;
        soulAlchemy?: number;
        transformation?: number;
    };
    unlocks?: string;
}

export interface BitterDissatisfactionPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; 
}

export interface LostHopeSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Young Witch' | 'Spirit Channel' | 'Deadseer' | 'Necromancer' | 'Lazarus' | 'Forbidden Arts' | 'Lich Queen';
    benefits: {
        channeling?: number;
        necromancy?: number;
        blackMagic?: number;
    };
    unlocks?: string;
}

export interface LostHopePower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
}

export interface FallenPeaceSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Left Brained' | 'Lobe' | 'Frontal Lobe' | 'Right Brained';
    benefits: {
        telepathy?: number;
        mentalManipulation?: number;
    };
    unlocks?: string;
}

export interface FallenPeacePower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
}

export interface GraciousDefeatPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; 
}

export interface GraciousDefeatSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Fireborn' | 'Cultivate' | 'Realmkeeper' | 'Strengthen' | 'Sweet Suffering' | 'Pocket God' | 'Realmmaster';
    benefits: {
        entrance?: number;
        features?: number;
        influence?: number;
    };
    unlocks?: string;
}

export interface ClosedCircuitsSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    unlocks?: string[];
    benefits: {
        netAvatar?: number;
        technomancy?: number;
        naniteControl?: number;
    };
}

export interface ClosedCircuitsPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
}

export interface RighteousCreationSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    unlocks?: string[];
    benefits: {
        specialty?: number;
        magitech?: number;
        arcaneConstructs?: number;
        metamagic?: number;
    };
}

export interface RighteousCreationPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
}

export interface SpecialtyChoice {
    id: 'magitech_specialty' | 'arcane_constructs_specialty' | 'metamagic_specialty';
    title: string;
    description: string;
    imageSrc: string;
}

export interface StarCrossedLoveSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    benefits: {
        pacts: number;
    };
}

export interface StarCrossedLovePact {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
}

export type SigilCounts = {
  kaarn: number;
  purth: number;
  juathas: number;
  xuth: number;
  sinthru: number;
  lekolu: number;
};

// Companion Reference Page Types
export interface CompanionOption {
    id: string;
    title: string;
    imageSrc: string;
    cost?: number;
    description: string;
    requirement?: string;
}
