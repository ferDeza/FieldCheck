import { buildContinuousBookingSelection } from './bookingSelection';

describe('buildContinuousBookingSelection', () => {
  it('acepta horas consecutivas en el mismo día', () => {
    const result = buildContinuousBookingSelection({
      selectedTimes: ['MON-8'],
      clickedTimeKey: 'MON-9',
      selectedDayCode: 'MON',
    });

    expect(result.error).toBe('');
    expect(result.nextSelectedTimes).toEqual(['MON-8', 'MON-9']);
    expect(result.startTime).toBe(8);
    expect(result.endTime).toBe(10);
  });

  it('reinicia la selección cuando hay un hueco entre horas', () => {
    const result = buildContinuousBookingSelection({
      selectedTimes: ['MON-8'],
      clickedTimeKey: 'MON-10',
      selectedDayCode: 'MON',
    });

    expect(result.error).toContain('nueva selección');
    expect(result.nextSelectedTimes).toEqual(['MON-10']);
    expect(result.startTime).toBe(10);
    expect(result.endTime).toBe(11);
  });

  it('reinicia la selección cuando cambia de día', () => {
    const result = buildContinuousBookingSelection({
      selectedTimes: ['MON-8'],
      clickedTimeKey: 'TUE-9',
      selectedDayCode: 'MON',
    });

    expect(result.error).toContain('nueva selección');
    expect(result.nextSelectedTimes).toEqual(['TUE-9']);
    expect(result.startTime).toBe(9);
    expect(result.endTime).toBe(10);
  });
});
