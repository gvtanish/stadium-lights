import { PatternConfig, PatternType, Zone, ZoneSchedule } from '@stadium-lights/shared';
import { BasePattern } from './BasePattern';

export class LampLightingPattern extends BasePattern {
  readonly id = PatternType.LAMP_LIGHTING;
  readonly name = 'Lamp Lighting Ceremony';

  generateSchedule(zones: Zone[], config: PatternConfig): ZoneSchedule {
    const schedule: ZoneSchedule = {};
    const stepDuration = config.speed || 180;
    const duration = config.duration || 10000;
    const amberColors = ['#FFD166', '#FFB703', '#FB8500', '#F4A261', '#E76F51'];

    // Gentle candle flicker animation
    // Lights gently pulse with warm amber/gold hues, simulating the ceremonial lamp flame
    const steps = Math.floor(duration / stepDuration);

    for (let step = 0; step < steps; step++) {
      const timeOffset = step * stepDuration;
      // Gentle pseudo-random shimmer for each zone
      const states = zones.map((z, idx) => {
        // Pseudo-random oscillation based on step and zone index
        const flicker = Math.sin(step * 0.4 + idx * 0.7);
        const isOn = flicker > -0.6; // Most zones stay softly lit
        const brightness = isOn ? Math.max(0.4, (flicker + 1) / 2) : 0;
        const color = amberColors[(step + idx) % amberColors.length];
        return this.createState(z.id, isOn, brightness, color);
      });

      schedule[timeOffset] = states;
    }

    return schedule;
  }
}
