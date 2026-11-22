export enum PatternType {
  WAVE = 'wave',
  PULSE = 'pulse',
  STROBE = 'strobe',
  ALTERNATING = 'alternating',
  CHECKERBOARD = 'checkerboard',
  SPIRAL = 'spiral',
  SPARKLE = 'sparkle',
  CHASE = 'chase',
  // School Annual Day specialized patterns
  TRACK_RELAY = 'track_relay',
  HOUSE_BATTLE = 'house_battle',
  LAMP_LIGHTING = 'lamp_lighting',
  SCHOOL_PRIDE = 'school_pride',
  FINALE_COUNTDOWN = 'finale_countdown',
}

export type PatternMode = 'grid' | 'ring' | 'track';
export type RingDirection = 'clockwise' | 'counterclockwise';

export interface PatternInfo {
  id: PatternType;
  name: string;
  description: string;
  defaultConfig: PatternDefaultConfig;
  category?: 'annual_day' | 'standard';
}

export interface PatternDefaultConfig {
  duration: number;
  speed?: number;
  frequency?: number;
  direction?: 'left' | 'right' | 'up' | 'down' | 'in' | 'out';
  density?: number;
  repeat?: boolean;
  color?: string;
  primaryColor?: string;
  secondaryColor?: string;
  mode?: PatternMode;
}

export const PATTERN_CATALOG: PatternInfo[] = [
  // School Annual Day Show Cues & Presets
  {
    id: PatternType.TRACK_RELAY,
    name: '400m Torch Relay',
    description: 'Light sprints around the 400m track bends straight into the stage',
    category: 'annual_day',
    defaultConfig: { duration: 6000, speed: 120, color: '#FF7700', mode: 'track' },
  },
  {
    id: PatternType.HOUSE_BATTLE,
    name: 'House Cheer Showdown',
    description: 'Alternating vibrant waves between Red, Blue, Green, and Yellow houses',
    category: 'annual_day',
    defaultConfig: { duration: 8000, speed: 250, mode: 'track' },
  },
  {
    id: PatternType.LAMP_LIGHTING,
    name: 'Lamp Lighting Ceremony',
    description: 'Warm golden candle shimmer honoring the inaugural stage ceremony',
    category: 'annual_day',
    defaultConfig: { duration: 10000, speed: 180, color: '#FFB703', mode: 'track' },
  },
  {
    id: PatternType.SCHOOL_PRIDE,
    name: 'School Pride Glow',
    description: 'Dual-tone pulsing waves in royal school colors',
    category: 'annual_day',
    defaultConfig: { duration: 6000, speed: 300, primaryColor: '#1D3557', secondaryColor: '#FFD166', repeat: true },
  },
  {
    id: PatternType.FINALE_COUNTDOWN,
    name: 'Grand Finale Countdown',
    description: 'Dramatic 5-4-3-2-1 countdown ripple culminating in a massive strobe explosion',
    category: 'annual_day',
    defaultConfig: { duration: 8000, speed: 200, color: '#E63946' },
  },
  // Standard stadium patterns
  {
    id: PatternType.SPARKLE,
    name: 'Random Sparkle',
    description: 'Random zones flash creating a sparkle effect',
    category: 'standard',
    defaultConfig: { duration: 5000, density: 0.3, speed: 100, color: '#FFFFFF' },
  },
  {
    id: PatternType.WAVE,
    name: 'Wave',
    description: 'Light sweeps across the stadium and track',
    category: 'standard',
    defaultConfig: { duration: 5000, speed: 200, direction: 'left', color: '#00F0FF' },
  },
  {
    id: PatternType.PULSE,
    name: 'Pulse',
    description: 'Light expands from the center stage outward',
    category: 'standard',
    defaultConfig: { duration: 5000, speed: 300, repeat: true, color: '#7209B7' },
  },
  {
    id: PatternType.STROBE,
    name: 'Strobe',
    description: 'All lights flash together in high-sync strobe',
    category: 'standard',
    defaultConfig: { duration: 5000, frequency: 4, color: '#FFFFFF' },
  },
  {
    id: PatternType.ALTERNATING,
    name: 'Alternating',
    description: 'Odd and even zones alternate',
    category: 'standard',
    defaultConfig: { duration: 5000, frequency: 2, color: '#4CC9F0' },
  },
  {
    id: PatternType.CHECKERBOARD,
    name: 'Checkerboard',
    description: 'Grid pattern alternates like a checkerboard',
    category: 'standard',
    defaultConfig: { duration: 5000, frequency: 2, color: '#F72585' },
  },
  {
    id: PatternType.SPIRAL,
    name: 'Spiral',
    description: 'Light spirals in or out from center stage',
    category: 'standard',
    defaultConfig: { duration: 5000, speed: 150, direction: 'out', color: '#4361EE' },
  },
  {
    id: PatternType.CHASE,
    name: 'Chase',
    description: 'Light chases sequentially through zones',
    category: 'standard',
    defaultConfig: { duration: 5000, speed: 100, direction: 'right', color: '#3A0CA3' },
  },
];
