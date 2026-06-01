import React from 'react';
import '../styles/KPICard.css';

const KPICard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        {icon && <span className="kpi-icon">{icon}</span>}
        <h3 className="kpi-title">{title}</h3>
      </div>
      <div className="kpi-value">{value}</div>
      {subtitle && <p className="kpi-subtitle">{subtitle}</p>}
    </div>
  );
};

export default KPICard;
