import React from 'react';
import './DayDetails.css';
import DetailItem from './DetailItem';
import { FaSun, FaCoffee, FaCloudSun, FaUtensils, FaMoon, FaWineGlassAlt, FaBed, FaBus } from 'react-icons/fa';

const DayDetails = ({ dayData }) => {
  return (
    <div className="day-details">
      <h2 className="day-theme">{dayData.theme}</h2>

      <div className="session">
        <h3 className="session-title">Morning</h3>
        <DetailItem label="Activities" content={dayData.morning} icon={<FaSun />} />
        <DetailItem label="Breakfast" content={dayData.meals.breakfast} icon={<FaCoffee />} />
      </div>

      <div className="session">
        <h3 className="session-title">Afternoon</h3>
        <DetailItem label="Activities" content={dayData.afternoon} icon={<FaCloudSun />} />
        <DetailItem label="Lunch" content={dayData.meals.lunch} icon={<FaUtensils />} />
      </div>

      <div className="session">
        <h3 className="session-title">Evening</h3>
        <DetailItem label="Activities" content={dayData.evening} icon={<FaMoon />} />
        <DetailItem label="Dinner" content={dayData.meals.dinner} icon={<FaWineGlassAlt />} />
      </div>

      <div className="session">
        <h3 className="session-title">Accommodation</h3>
        <DetailItem content={dayData.accommodation} icon={<FaBed />} />
      </div>

      <div className="session">
        <h3 className="session-title">Transportation</h3>
        <DetailItem content={dayData.transportation.details} icon={<FaBus />} />
      </div>

      <h3 className="daily-cost">Daily Cost: {dayData.dailyCost} 元</h3>
    </div>
  );
};

export default DayDetails;
