export const buildContinuousBookingSelection = ({
  selectedTimes = [],
  clickedTimeKey,
  selectedDayCode,
}) => {
  const getHour = (timeKey) => Number(timeKey.split('-')[1]);
  const sortTimeKeys = (keys) =>
    [...keys].sort((a, b) => getHour(a) - getHour(b));

  if (!clickedTimeKey) {
    return {
      nextSelectedTimes: selectedTimes,
      startTime: '',
      endTime: '',
      error: '',
    };
  }

  const [clickedDay] = clickedTimeKey.split('-');

  if (selectedTimes.includes(clickedTimeKey)) {
    const nextSelectedTimes = selectedTimes.filter((time) => time !== clickedTimeKey);
    const sorted = sortTimeKeys(nextSelectedTimes);
    const startTime = sorted.length ? getHour(sorted[0]) : '';
    const endTime = sorted.length ? getHour(sorted[sorted.length - 1]) + 1 : '';

    return {
      nextSelectedTimes,
      startTime,
      endTime,
      error: '',
    };
  }

  if (selectedDayCode && clickedDay !== selectedDayCode) {
    return {
      nextSelectedTimes: [clickedTimeKey],
      startTime: getHour(clickedTimeKey),
      endTime: getHour(clickedTimeKey) + 1,
      error: 'Has cambiado de día, se ha iniciado una nueva selección para el día seleccionado.',
    };
  }

  if (selectedTimes.length === 0) {
    return {
      nextSelectedTimes: [clickedTimeKey],
      startTime: getHour(clickedTimeKey),
      endTime: getHour(clickedTimeKey) + 1,
      error: '',
    };
  }

  const hours = selectedTimes.map(getHour);
  const minHour = Math.min(...hours);
  const maxHour = Math.max(...hours);
  const clickedHour = getHour(clickedTimeKey);

  const canExtendLeft = clickedHour === minHour - 1;
  const canExtendRight = clickedHour === maxHour + 1;

  if (!canExtendLeft && !canExtendRight) {
    return {
      nextSelectedTimes: [clickedTimeKey],
      startTime: clickedHour,
      endTime: clickedHour + 1,
      error: 'Solo puedes seleccionar horas consecutivas en un mismo booking. Se inició una nueva selección con la hora escogida.',
    };
  }

  const nextSelectedTimes = sortTimeKeys([...selectedTimes, clickedTimeKey]);

  return {
    nextSelectedTimes,
    startTime: getHour(nextSelectedTimes[0]),
    endTime: getHour(nextSelectedTimes[nextSelectedTimes.length - 1]) + 1,
    error: '',
  };
};
