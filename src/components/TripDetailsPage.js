import React, { useState } from 'react';
import DayDetails from './DayDetails';
import './TripDetailsPage.css';

const TripDetailsPage = ({ tripData }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="trip-details-page">
      <h1 className="trip-title">{tripData.title}</h1>
      <p className="trip-overview">{tripData.overview}</p>

      <div className="tabs">
        {tripData.dailyPlan.map((day, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <DayDetails dayData={tripData.dailyPlan[activeTab]} />
      </div>
    </div>
  );
};

export default TripDetailsPage;
