import { PatternConfig, PatternType, Zone, ZoneSchedule, ZoneState } from '@stadium-lights/shared';
import { BasePattern } from './BasePattern';

export class TrackRelayPattern extends BasePattern {
  readonly id = PatternType.TRACK_RELAY;
  readonly name = '400m Torch Relay';

  generateSchedule(zones: Zone[], config: PatternConfig): ZoneSchedule {
    const schedule: ZoneSchedule = {};
    const stepDuration = config.speed || 120; // ms per step
    const torchColor = config.color || '#FF7700'; // Flame orange/gold
    const stageColor = '#FFD700';

    // Order zones by angle to follow the 400m track oval
    const sortedZones = this.sortZonesByAngle(zones, this.isClockwise(config));
    const totalZones = sortedZones.length;
    if (totalZones === 0) return schedule;

    // Track torch runner moving around the track
    // Each step advances the torch by 1 zone, with a trailing tail of 2 zones
    let timeOffset = 0;
    const laps = 1;
    const totalSteps = totalZones * laps;

    for (let step = 0; step < totalSteps; step++) {
      const activeIdx = step % totalZones;
      const tailIdx1 = (step - 1 + totalZones) % totalZones;
      const tailIdx2 = (step - 2 + totalZones) % totalZones;

      const states: ZoneState[] = [];

      for (let i = 0; i < totalZones; i++) {
        const zone = sortedZones[i];
        if (i === activeIdx) {
          states.push(this.createState(zone.id, true, 1.0, torchColor));
        } else if (i === tailIdx1) {
          states.push(this.createState(zone.id, true, 0.6, '#FF5400'));
        } else if (i === tailIdx2) {
          states.push(this.createState(zone.id, true, 0.3, '#9D0208'));
        } else {
          states.push(this.createState(zone.id, false));
        }
      }

      schedule[timeOffset] = states;
      timeOffset += stepDuration;
    }

    // Grand finish at the stage (all track lights burst on)
    schedule[timeOffset] = zones.map((z) => this.createState(z.id, true, 1.0, stageColor));
    timeOffset += 400;
    schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));
    timeOffset += 200;
    schedule[timeOffset] = zones.map((z) => this.createState(z.id, true, 1.0, '#FFFFFF'));
    timeOffset += 500;
    schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));

    return schedule;
  }
}
