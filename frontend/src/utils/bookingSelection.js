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

  const [clickedDay, clickedHour] = clickedTimeKey.split('-');
  const clickedHourNumber = Number(clickedHour);

  if (selectedDayCode && clickedDay !== selectedDayCode) {
    return {
      nextSelectedTimes: selectedTimes,
      startTime: '',
      endTime: '',
      error: 'No puedes combinar horarios de distintos días en un mismo booking.',
    };
  }

  const currentSelection = selectedTimes.includes(clickedTimeKey)
    ? selectedTimes.filter((time) => time !== clickedTimeKey)
    : [...selectedTimes, clickedTimeKey];

  if (currentSelection.length <= 1) {
    return {
      nextSelectedTimes: currentSelection,
      startTime: currentSelection[0] ? Number(currentSelection[0].split('-')[1]) : '',
      endTime: currentSelection[0] ? Number(currentSelection[0].split('-')[1]) + 1 : '',
      error: '',
    };
  }

  const hours = currentSelection
    .map((time) => Number(time.split('-')[1]))
    .sort((a, b) => a - b);

  const isConsecutive = hours.every((hour, index) => {
    if (index === 0) return true;
    return hour === hours[index - 1] + 1;
  });

  if (!isConsecutive) {
    return {
      nextSelectedTimes: selectedTimes,
      startTime: '',
      endTime: '',
      error: 'Solo puedes seleccionar horas consecutivas en un mismo booking. Si hay una hora de separación o un cambio de día, debes crear otro booking.',
    };
  }

  return {
    nextSelectedTimes: currentSelection,
    startTime: hours[0],
    endTime: hours[hours.length - 1] + 1,
    error: '',
  };
};
