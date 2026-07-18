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

  it('rechaza un hueco entre horas', () => {
    const result = buildContinuousBookingSelection({
      selectedTimes: ['MON-8'],
      clickedTimeKey: 'MON-10',
      selectedDayCode: 'MON',
    });

    expect(result.error).toContain('consecutivas');
    expect(result.nextSelectedTimes).toEqual(['MON-8']);
  });

  it('rechaza un cambio de día en una misma reserva', () => {
    const result = buildContinuousBookingSelection({
      selectedTimes: ['MON-8'],
      clickedTimeKey: 'TUE-9',
      selectedDayCode: 'MON',
    });

    expect(result.error).toContain('día');
    expect(result.nextSelectedTimes).toEqual(['MON-8']);
  });
});
