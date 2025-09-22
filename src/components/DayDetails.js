import React from 'react';
import DetailItem from './DetailItem';
import { FaSun, FaCloudSun, FaMoon, FaUtensils, FaBed, FaBus } from 'react-icons/fa';
import './DayDetails.css';

const DayDetails = ({ dayData }) => {
  return (
    <div className="day-details">
      <h2 className="day-theme">{dayData.theme}</h2>

      <DetailItem label="Morning" content={dayData.morning} icon={<FaSun />} />
      <DetailItem label="Afternoon" content={dayData.afternoon} icon={<FaCloudSun />} />
      <DetailItem label="Evening" content={dayData.evening} icon={<FaMoon />} />

      <h3>Meals</h3>
      <DetailItem label="Breakfast" content={dayData.meals.breakfast} icon={<FaUtensils />} />
      <DetailItem label="Lunch" content={dayData.meals.lunch} icon={<FaUtensils />} />
      <DetailItem label="Dinner" content={dayData.meals.dinner} icon={<FaUtensils />} />

      <DetailItem label="Accommodation" content={dayData.accommodation} icon={<FaBed />} />
      <DetailItem label="Transportation" content={dayData.transportation.details} icon={<FaBus />} />

      <h3 className="daily-cost">Daily Cost: {dayData.dailyCost} 元</h3>
    </div>
  );
};

export default DayDetails;
