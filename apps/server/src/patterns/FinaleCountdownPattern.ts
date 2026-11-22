import { PatternConfig, PatternType, Zone, ZoneSchedule } from '@stadium-lights/shared';
import { BasePattern } from './BasePattern';

export class FinaleCountdownPattern extends BasePattern {
  readonly id = PatternType.FINALE_COUNTDOWN;
  readonly name = 'Grand Finale Countdown';

  generateSchedule(zones: Zone[], config: PatternConfig): ZoneSchedule {
    const schedule: ZoneSchedule = {};
    const countdownColors = ['#E9C46A', '#F4A261', '#E76F51', '#D62828', '#E63946']; // Yellow -> Red
    let timeOffset = 0;

    // 5 countdown pulses (5... 4... 3... 2... 1...)
    for (let count = 5; count >= 1; count--) {
      const color = countdownColors[5 - count];
      const pulseDuration = 400;
      const restDuration = 600;

      // Pulse ON
      schedule[timeOffset] = zones.map((z) => this.createState(z.id, true, 1.0, color));
      timeOffset += pulseDuration;

      // Pulse OFF
      schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));
      timeOffset += restDuration;
    }

    // CLIMAX EXPLOSION! Multi-color high-intensity strobe
    const strobeColors = ['#E63946', '#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0', '#06D6A0', '#FFD166'];
    const strobeFlashes = 16;
    const strobeSpeed = 80;

    for (let f = 0; f < strobeFlashes; f++) {
      const color = strobeColors[f % strobeColors.length];
      schedule[timeOffset] = zones.map((z, idx) => {
        const zoneColor = strobeColors[(idx + f) % strobeColors.length];
        return this.createState(z.id, true, 1.0, zoneColor);
      });
      timeOffset += strobeSpeed;

      schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));
      timeOffset += strobeSpeed;
    }

    // Grand final hold (all pure white brilliant glow)
    schedule[timeOffset] = zones.map((z) => this.createState(z.id, true, 1.0, '#FFFFFF'));
    timeOffset += 1200;

    schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));

    return schedule;
  }
}
