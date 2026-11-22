import { IPattern, PatternType } from '@stadium-lights/shared';
import { WavePattern } from './WavePattern';
import { PulsePattern } from './PulsePattern';
import { StrobePattern } from './StrobePattern';
import { AlternatingPattern } from './AlternatingPattern';
import { CheckerboardPattern } from './CheckerboardPattern';
import { SpiralPattern } from './SpiralPattern';
import { SparklePattern } from './SparklePattern';
import { ChasePattern } from './ChasePattern';
import { TrackRelayPattern } from './TrackRelayPattern';
import { HouseBattlePattern } from './HouseBattlePattern';
import { LampLightingPattern } from './LampLightingPattern';
import { SchoolPridePattern } from './SchoolPridePattern';
import { FinaleCountdownPattern } from './FinaleCountdownPattern';

export class PatternRegistry {
  private patterns = new Map<PatternType, IPattern>();

  constructor() {
    this.registerAllPatterns();
  }

  private registerAllPatterns(): void {
    // School Annual Day Show patterns
    this.register(new TrackRelayPattern());
    this.register(new HouseBattlePattern());
    this.register(new LampLightingPattern());
    this.register(new SchoolPridePattern());
    this.register(new FinaleCountdownPattern());

    // Standard patterns
    this.register(new WavePattern());
    this.register(new PulsePattern());
    this.register(new StrobePattern());
    this.register(new AlternatingPattern());
    this.register(new CheckerboardPattern());
    this.register(new SpiralPattern());
    this.register(new SparklePattern());
    this.register(new ChasePattern());
  }

  private register(pattern: IPattern): void {
    this.patterns.set(pattern.id, pattern);
  }

  getPattern(id: PatternType): IPattern | null {
    return this.patterns.get(id) || null;
  }

  getAllPatterns(): IPattern[] {
    return Array.from(this.patterns.values());
  }
}
