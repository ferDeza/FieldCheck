import React, { useState, useEffect } from 'react';
import '../styles/ScheduleWeeklyView.css';

const ScheduleWeeklyView = ({ fieldId, schedules: propsSchedules, onTimeSelect, selectedTimes = [] }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const dayMap = { 'MONDAY': 'MON', 'TUESDAY': 'TUE', 'WEDNESDAY': 'WED', 'THURSDAY': 'THU', 'FRIDAY': 'FRI', 'SATURDAY': 'SAT', 'SUNDAY': 'SUN' };
  const daysNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 07:00 to 22:00

  useEffect(() => {
    if (propsSchedules && propsSchedules.length > 0) {
      // Use schedules from props (from API)
      const processedSchedules = propsSchedules.map((schedule) => ({
        dayOfWeek: dayMap[schedule.dayOfWeek] || schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isAvailable: schedule.isAvailable,
        hour: parseInt(schedule.startTime.split(':')[0]),
      }));
      setSchedules(processedSchedules);
    } else if (fieldId) {
      // Fallback to mock data if no schedules provided
      const mockSchedules = generateMockSchedules();
      setSchedules(mockSchedules);
    }
    setLoading(false);
  }, [fieldId, propsSchedules]);

  const generateMockSchedules = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const mock = [];
    days.forEach((day) => {
      hours.forEach((hour) => {
        const isAvailable = Math.random() > 0.3;
        mock.push({
          dayOfWeek: day,
          hour: hour,
          isAvailable: isAvailable,
        });
      });
    });
    return mock;
  };

  const handleTimeClick = (day, hour) => {
    const timeKey = `${day}-${hour}`;
    const schedule = schedules.find(s => s.dayOfWeek === day && s.hour === hour);

    if (schedule && schedule.isAvailable) {
      if (onTimeSelect) {
        onTimeSelect({ day, hour });
      }
    }
  };

  const getStatusClass = (day, hour) => {
    const schedule = schedules.find(s => s.dayOfWeek === day && s.hour === hour);
    const timeKey = `${day}-${hour}`;
    const isSelected = selectedTimes.includes(timeKey);

    if (isSelected) return 'selected';
    if (schedule && !schedule.isAvailable) return 'unavailable';
    return 'available';
  };

  if (loading) {
    return <div className="schedule-loading">Cargando horarios...</div>;
  }

  const days = Object.values(dayMap).slice(0, 7);

  return (
    <div className="schedule-weekly-view">
      <h3>Disponibilidad Semanal</h3>
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Hora</th>
              {daysNames.map((day, idx) => (
                <th key={idx}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td className="hour-cell">{String(hour).padStart(2, '0')}:00</td>
                {days.map((day) => (
                  <td
                    key={`${day}-${hour}`}
                    className={`time-cell ${getStatusClass(day, hour)}`}
                    onClick={() => handleTimeClick(day, hour)}
                  >
                    {getStatusClass(day, hour) === 'available' && '✓'}
                    {getStatusClass(day, hour) === 'selected' && '■'}
                    {getStatusClass(day, hour) === 'unavailable' && '✕'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="schedule-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Seleccionado</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable"></span>
          <span>No disponible</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleWeeklyView;
