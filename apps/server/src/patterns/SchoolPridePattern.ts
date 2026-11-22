import { PatternConfig, PatternType, Zone, ZoneSchedule } from '@stadium-lights/shared';
import { BasePattern } from './BasePattern';

export class SchoolPridePattern extends BasePattern {
  readonly id = PatternType.SCHOOL_PRIDE;
  readonly name = 'School Pride Glow';

  generateSchedule(zones: Zone[], config: PatternConfig): ZoneSchedule {
    const schedule: ZoneSchedule = {};
    const stepDuration = config.speed || 300;
    const primaryColor = config.primaryColor || '#1D3557'; // Royal Navy Blue
    const secondaryColor = config.secondaryColor || '#FFD166'; // Golden Yellow

    // Alternate expanding rings/sectors in royal school colors
    const sortedZones = this.sortZonesByAngle(zones, true);
    const numZones = sortedZones.length;
    const cycles = 6;

    let timeOffset = 0;

    for (let c = 0; c < cycles; c++) {
      const isPrimary = c % 2 === 0;
      const activeColor = isPrimary ? primaryColor : secondaryColor;
      const altColor = isPrimary ? secondaryColor : primaryColor;

      // Half the track in primary, half in secondary, then swap
      schedule[timeOffset] = sortedZones.map((z, idx) => {
        const half = idx < numZones / 2;
        const color = half ? activeColor : altColor;
        return this.createState(z.id, true, 1.0, color);
      });
      timeOffset += stepDuration * 2;

      // Soft dip between transitions
      schedule[timeOffset] = sortedZones.map((z) => this.createState(z.id, true, 0.4, activeColor));
      timeOffset += stepDuration;
    }

    return schedule;
  }
}
