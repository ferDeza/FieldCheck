const { buildContinuousBookingSelection } = require('./utils/bookingSelection');
const sequences = [
  ['MON-7','MON-8','MON-9'],
  ['MON-7','MON-9'],
  ['MON-8','MON-7'],
  ['MON-8','MON-9','MON-7'],
  ['MON-7','MON-9','MON-8'],
  ['MON-7','MON-8','MON-10'],
  ['MON-8','MON-10','MON-9'],
];
for (const seq of sequences) {
  let selected = [];
  console.log('seq', seq);
  for (const click of seq) {
    const res = buildContinuousBookingSelection({
      selectedTimes: selected,
      clickedTimeKey: click,
      selectedDayCode: selected.length > 0 ? selected[0].split('-')[0] : null,
    });
    selected = res.nextSelectedTimes;
    console.log(' click', click, '->', selected, 'error', res.error || '(ok)', 'range', `${res.startTime}-${res.endTime}`);
  }
  console.log('---');
}
