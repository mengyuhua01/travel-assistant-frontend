import React, { useState } from 'react';
import { Tabs } from 'antd';
import DayDetails from './DayDetails';
import './TripDetailsPage.css';

const { TabPane } = Tabs;

const TripDetailsPage = ({ tripData }) => {
  return (
    <div className="trip-details-page">
      <h1 className="trip-title">{tripData.title}</h1>
      <p className="trip-overview">{tripData.overview}</p>

      <Tabs defaultActiveKey="0" className="trip-tabs">
        {tripData.dailyPlan.map((day, index) => (
          <TabPane tab={`Day ${day.day}`} key={index}>
            <DayDetails dayData={day} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default TripDetailsPage;
