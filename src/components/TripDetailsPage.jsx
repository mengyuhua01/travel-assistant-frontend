import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import DayDetails from './DayDetails';
import './TripDetailsPage.css';

const { TabPane } = Tabs;

const TripDetailsPage = ({ tripData }) => {
  return (
    <div className="trip-details-page">
      <Card title={tripData.title} bordered={false} className="trip-card">
        <p className="trip-overview">{tripData.overview}</p>
      </Card>

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