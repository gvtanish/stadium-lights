import { PatternConfig, PatternType, Zone, ZoneSchedule, ZoneState } from '@stadium-lights/shared';
import { BasePattern } from './BasePattern';

export class HouseBattlePattern extends BasePattern {
  readonly id = PatternType.HOUSE_BATTLE;
  readonly name = 'House Cheer Showdown';

  generateSchedule(zones: Zone[], config: PatternConfig): ZoneSchedule {
    const schedule: ZoneSchedule = {};
    const stepDuration = config.speed || 250;

    // School House Colors: Red, Blue, Green, Yellow
    const houseColors: { [key: string]: string } = {
      red: '#E63946',
      blue: '#0077B6',
      green: '#2A9D8F',
      yellow: '#E9C46A',
      ...config.houseColors,
    };

    const houses = ['red', 'blue', 'green', 'yellow'];

    // Map each zone to a house based on zone.house or zone position in track quadrants
    const zonesByHouse = new Map<string, Zone[]>();
    for (const h of houses) {
      zonesByHouse.set(h, []);
    }

    const sortedZones = this.sortZonesByAngle(zones, true);
    const numZones = sortedZones.length;

    sortedZones.forEach((z, idx) => {
      let house = z.house?.toLowerCase();
      if (!house || !zonesByHouse.has(house)) {
        // Divide the 400m track oval into 4 house sectors
        const quadrant = Math.floor((idx / Math.max(1, numZones)) * 4) % 4;
        house = houses[quadrant];
      }
      zonesByHouse.get(house)!.push(z);
    });

    let timeOffset = 0;

    // Phase 1: Solo House spotlight (each house cheers one by one)
    for (const house of houses) {
      const color = houseColors[house];
      const houseZones = zonesByHouse.get(house) || [];

      // Flash 2 times
      for (let flash = 0; flash < 2; flash++) {
        // ON
        schedule[timeOffset] = zones.map((z) => {
          const isMyHouse = houseZones.some((hz) => hz.id === z.id);
          return this.createState(z.id, isMyHouse, 1.0, isMyHouse ? color : undefined);
        });
        timeOffset += stepDuration;

        // OFF
        schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));
        timeOffset += stepDuration / 2;
      }
    }

    // Phase 2: Duel! (Red & Green vs Blue & Yellow alternate)
    for (let duel = 0; duel < 3; duel++) {
      // Red & Green
      schedule[timeOffset] = zones.map((z) => {
        const isRed = (zonesByHouse.get('red') || []).some((hz) => hz.id === z.id);
        const isGreen = (zonesByHouse.get('green') || []).some((hz) => hz.id === z.id);
        if (isRed) return this.createState(z.id, true, 1.0, houseColors.red);
        if (isGreen) return this.createState(z.id, true, 1.0, houseColors.green);
        return this.createState(z.id, false);
      });
      timeOffset += stepDuration;

      // Blue & Yellow
      schedule[timeOffset] = zones.map((z) => {
        const isBlue = (zonesByHouse.get('blue') || []).some((hz) => hz.id === z.id);
        const isYellow = (zonesByHouse.get('yellow') || []).some((hz) => hz.id === z.id);
        if (isBlue) return this.createState(z.id, true, 1.0, houseColors.blue);
        if (isYellow) return this.createState(z.id, true, 1.0, houseColors.yellow);
        return this.createState(z.id, false);
      });
      timeOffset += stepDuration;
    }

    // Phase 3: Grand Climax - ALL Houses light up together with their colors!
    schedule[timeOffset] = zones.map((z) => {
      for (const h of houses) {
        if ((zonesByHouse.get(h) || []).some((hz) => hz.id === z.id)) {
          return this.createState(z.id, true, 1.0, houseColors[h]);
        }
      }
      return this.createState(z.id, true, 1.0, '#FFFFFF');
    });
    timeOffset += 800;

    schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));
    timeOffset += 200;

    // Final strobe burst
    schedule[timeOffset] = zones.map((z) => {
      for (const h of houses) {
        if ((zonesByHouse.get(h) || []).some((hz) => hz.id === z.id)) {
          return this.createState(z.id, true, 1.0, houseColors[h]);
        }
      }
      return this.createState(z.id, true, 1.0, '#FFFFFF');
    });
    timeOffset += 600;

    schedule[timeOffset] = zones.map((z) => this.createState(z.id, false));

    return schedule;
  }
}
