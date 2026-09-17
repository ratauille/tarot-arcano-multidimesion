export type PlanType = 'freemium' | 'pro' | 'elite' | 'test_fire';

export type SpreadId = 'daily_3' | 'celtic_cross' | 'mystic_cross' | 'astrological';

export interface TarotCard {
  id: string;
  number: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  glyph: string;
  imageUrl: string;
  fallbackGradient: string;
  core: string;
  light: string;
  shadow: string;
  prompt: string;
  planetaryRuler?: string;
  element?: string;
}

export interface SpreadPosition {
  index: number;
  id: string;
  title: string;
  description: string;
  category: 'core' | 'past_future' | 'environment' | 'outcome' | 'planet';
}

export interface SpreadConfig {
  id: SpreadId;
  name: string;
  subtitle: string;
  cardCount: number;
  requiredPlan: PlanType;
  description: string;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  card: TarotCard;
  position: SpreadPosition;
  isUpright: boolean;
  revealed: boolean;
}

export interface ReadingInsight {
  cardName: string;
  position: string;
  interpretation: string;
  advice: string;
}

export interface AIReadingResult {
  synthesis: string;
  crossCardDynamics: string;
  obstacleAction: string;
  oracleAffirmation: string;
  positionInsights: ReadingInsight[];
}

export interface SavedReading {
  id: string;
  date: string;
  alias?: string;
  question: string;
  spreadId: SpreadId;
  spreadName: string;
  cards: Array<{
    name: string;
    positionTitle: string;
    imageUrl: string;
    isUpright: boolean;
  }>;
  aiResult?: AIReadingResult;
}

export interface UserSubscription {
  plan: PlanType;
  activeSince: string;
  renewsOn?: string;
  dailyReadingsUsedToday: number;
  lastReadingDate?: string;
}
