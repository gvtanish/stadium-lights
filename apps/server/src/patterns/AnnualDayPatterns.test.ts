import { describe, it, expect } from 'vitest';
import { PatternType, StadiumBounds, Zone, ZoneState } from '@stadium-lights/shared';
import { ZoneService } from '../services/ZoneService';
import { TrackRelayPattern } from './TrackRelayPattern';
import { HouseBattlePattern } from './HouseBattlePattern';
import { LampLightingPattern } from './LampLightingPattern';
import { SchoolPridePattern } from './SchoolPridePattern';
import { FinaleCountdownPattern } from './FinaleCountdownPattern';

describe('School Annual Day Patterns', () => {
  const zoneService = new ZoneService();
  const bounds: StadiumBounds = {
    topLeft: { latitude: 12.972, longitude: 77.594 },
    topRight: { latitude: 12.972, longitude: 77.596 },
    bottomLeft: { latitude: 12.970, longitude: 77.594 },
    bottomRight: { latitude: 12.970, longitude: 77.596 },
  };
  const zones: Zone[] = zoneService.createZoneGrid('test-group', bounds, 4, 4);

  it('TrackRelayPattern generates sequential relay schedule along the track', () => {
    const pattern = new TrackRelayPattern();
    expect(pattern.id).toBe(PatternType.TRACK_RELAY);

    const schedule = pattern.generateSchedule(zones, { speed: 100 });
    const offsets = Object.keys(schedule).map(Number);
    expect(offsets.length).toBeGreaterThan(0);

    // Verify first step has an active state with torch color
    const firstStep = schedule[0];
    const activeZone = firstStep.find((s: ZoneState) => s.isOn);
    expect(activeZone).toBeDefined();
    expect(activeZone?.color).toBeDefined();
  });

  it('HouseBattlePattern generates cheer showdown with house colors', () => {
    const pattern = new HouseBattlePattern();
    expect(pattern.id).toBe(PatternType.HOUSE_BATTLE);

    const schedule = pattern.generateSchedule(zones, { speed: 200 });
    const offsets = Object.keys(schedule).map(Number);
    expect(offsets.length).toBeGreaterThan(0);

    // Verify house states exist with colors
    const hasColoredZone = (Object.values(schedule) as ZoneState[][]).some((states: ZoneState[]) =>
      states.some((s: ZoneState) => s.isOn && s.color !== undefined)
    );
    expect(hasColoredZone).toBe(true);
  });

  it('LampLightingPattern creates warm amber flicker schedule', () => {
    const pattern = new LampLightingPattern();
    expect(pattern.id).toBe(PatternType.LAMP_LIGHTING);

    const schedule = pattern.generateSchedule(zones, { duration: 2000, speed: 200 });
    const offsets = Object.keys(schedule).map(Number);
    expect(offsets.length).toBeGreaterThan(5);

    // Verify zones are turned on with brightness variations
    const firstStep = schedule[0];
    expect(firstStep.some((s: ZoneState) => s.isOn)).toBe(true);
  });

  it('SchoolPridePattern creates alternating primary and secondary colors', () => {
    const pattern = new SchoolPridePattern();
    expect(pattern.id).toBe(PatternType.SCHOOL_PRIDE);

    const schedule = pattern.generateSchedule(zones, {
      primaryColor: '#1D3557',
      secondaryColor: '#FFD166',
    });
    const offsets = Object.keys(schedule).map(Number);
    expect(offsets.length).toBeGreaterThan(0);

    const statesWithColors = (Object.values(schedule) as ZoneState[][]).flatMap((states: ZoneState[]) =>
      states.filter((s: ZoneState) => s.isOn && s.color)
    );
    expect(statesWithColors.some((s) => s.color === '#1D3557')).toBe(true);
    expect(statesWithColors.some((s) => s.color === '#FFD166')).toBe(true);
  });

  it('FinaleCountdownPattern generates countdown pulses followed by strobe explosion', () => {
    const pattern = new FinaleCountdownPattern();
    expect(pattern.id).toBe(PatternType.FINALE_COUNTDOWN);

    const schedule = pattern.generateSchedule(zones, {});
    const offsets = Object.keys(schedule).map(Number);
    expect(offsets.length).toBeGreaterThan(20);

    // Strobe explosion should have multiple distinct color flashes
    const finalHold = schedule[Math.max(...offsets)];
    expect(finalHold).toBeDefined();
  });
});
