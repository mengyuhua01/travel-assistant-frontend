import logo from './logo.svg';
import './App.css';
import React from 'react';
import TripDetailsPage from './components/TripDetailsPage';

const sampleTripData = {
  title: "珠海 - 上海 - 北京 - 苏州经济型三地游",
  overview: "这是一条从珠海出发，依次游览上海、北京、苏州的经济型旅行路线，总预算控制在 2000 元以内，适合单人穷游体验",
  duration: 6,
  totalBudget: 1980,
  dailyPlan: [
    {
      day: 1,
      theme: "珠海出发抵达上海",
      morning: "从珠海出发，乘坐 G1302 次高铁前往上海虹桥",
      afternoon: "下午抵达上海，入住青年旅舍，游览外滩和南京路步行街",
      evening: "夜游外滩，欣赏黄浦江夜景",
      meals: {
        breakfast: "珠海本地早餐（肠粉 + 豆浆）约 15 元",
        lunch: "高铁上简餐约 30 元",
        dinner: "上海小笼包 + 生煎包约 25 元"
      },
      accommodation: "上海蓝山国际青年旅舍，多人间床位 60 元 / 晚，地址：上海市卢湾区",
      transportation: {
        details: "G1302 次高铁，珠海 12:17 - 上海虹桥 21:47，二等座约 600 元",
        cost: 600
      },
      dailyCost: 730
    },
    {
      day: 2,
      theme: "上海经典一日游",
      morning: "游览城隍庙和豫园，体验老上海风情",
      afternoon: "参观田子坊艺术区，逛新天地",
      evening: "陆家嘴金融区观光，登东方明珠或金茂大厦（外观）",
      meals: {
        breakfast: "青旅提供简餐或附近早餐店约 10 元",
        lunch: "城隍庙小吃（小笼包、生煎）约 25 元",
        dinner: "田子坊特色小吃约 30 元"
      },
      accommodation: "上海蓝山国际青年旅舍，多人间床位 60 元 / 晚",
      transportation: {
        details: "上海市内地铁交通一日票约 15 元",
        cost: 15
      },
      dailyCost: 140
    },
    {
      day: 3,
      theme: "上海到北京转移日",
      morning: "乘坐高铁从上海前往北京",
      afternoon: "抵达北京南站，入住青年旅舍",
      evening: "前门大街步行，品尝北京小吃",
      meals: {
        breakfast: "上海早餐（粢饭团 + 豆浆）约 10 元",
        lunch: "高铁上简餐约 30 元",
        dinner: "前门大街老北京炸酱面约 25 元"
      },
      accommodation: "北京前门青年旅舍，多人间床位 70 元 / 晚，地址：北京市东城区",
      transportation: {
        details: "G104 次高铁，上海虹桥 06:37 - 北京南 12:33，二等座约 606 元",
        cost: 606
      },
      dailyCost: 741
    }
  ]
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <TripDetailsPage tripData={sampleTripData} />
    </div>
  );
}

export default App;
