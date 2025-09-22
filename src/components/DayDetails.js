import React from 'react';
import './DayDetails.css';
import DetailItem from './DetailItem';

const DayDetails = ({ dayData }) => {
  return (
    <div className="day-details">
      <h2 className="day-theme">{dayData.theme}</h2>

      <div className="session">
        <h3 className="session-title">Morning</h3>
        <DetailItem label="Activities" content={dayData.morning} />
        <DetailItem label="Breakfast" content={dayData.meals.breakfast} />
      </div>

      <div className="session">
        <h3 className="session-title">Afternoon</h3>
        <DetailItem label="Activities" content={dayData.afternoon} />
        <DetailItem label="Lunch" content={dayData.meals.lunch} />
      </div>

      <div className="session">
        <h3 className="session-title">Evening</h3>
        <DetailItem label="Activities" content={dayData.evening} />
        <DetailItem label="Dinner" content={dayData.meals.dinner} />
      </div>

      <div className="session">
        <h3 className="session-title">Accommodation</h3>
        <DetailItem label="Accommodation" content={dayData.accommodation} />
      </div>

      <div className="session">
        <h3 className="session-title">Transportation</h3>
        <DetailItem label="Transportation" content={dayData.transportation.details} />
      </div>

      <h3 className="daily-cost">Daily Cost: {dayData.dailyCost} 元</h3>
    </div>
  );
};

export default DayDetails;
