export const buildContinuousBookingSelection = ({
  selectedTimes = [],
  clickedTimeKey,
  selectedDayCode,
}) => {
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
    return {
      nextSelectedTimes,
      startTime: nextSelectedTimes[0] ? Number(nextSelectedTimes[0].split('-')[1]) : '',
      endTime: nextSelectedTimes[0] ? Number(nextSelectedTimes[0].split('-')[1]) + 1 : '',
      error: '',
    };
  }

  if (selectedDayCode && clickedDay !== selectedDayCode) {
    return {
      nextSelectedTimes: [clickedTimeKey],
      startTime: Number(clickedTimeKey.split('-')[1]),
      endTime: Number(clickedTimeKey.split('-')[1]) + 1,
      error: 'Has cambiado de día, se ha iniciado una nueva selección para el día seleccionado.',
    };
  }

  if (selectedTimes.length === 0) {
    return {
      nextSelectedTimes: [clickedTimeKey],
      startTime: Number(clickedTimeKey.split('-')[1]),
      endTime: Number(clickedTimeKey.split('-')[1]) + 1,
      error: '',
    };
  }

  const currentSelection = [...selectedTimes, clickedTimeKey];
  const hours = currentSelection
    .map((time) => Number(time.split('-')[1]))
    .sort((a, b) => a - b);

  const isConsecutive = hours.every((hour, index) => {
    if (index === 0) return true;
    return hour === hours[index - 1] + 1;
  });

  if (!isConsecutive) {
    return {
      nextSelectedTimes: [clickedTimeKey],
      startTime: Number(clickedTimeKey.split('-')[1]),
      endTime: Number(clickedTimeKey.split('-')[1]) + 1,
      error: 'Solo puedes seleccionar horas consecutivas en un mismo booking. Se inició una nueva selección con la hora escogida.',
    };
  }

  return {
    nextSelectedTimes: currentSelection,
    startTime: hours[0],
    endTime: hours[hours.length - 1] + 1,
    error: '',
  };
};
