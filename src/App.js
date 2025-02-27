import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AQI from "./components/AQI";
import Chart from "./components/Chart";
import Map from "./components/Map";
import Alerts from "./components/Alerts";
import AQIAlerts from "./components/AQIAlerts";
import Customize from "./components/Customize";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default route (/) will show AQI component */}
          <Route path="/" element={<AQI />} />
          
          {/* Other routes for chart and map */}
          <Route path="/chart" element={<Chart />} />
          <Route path="/map" element={<Map />} />
		  <Route path="/alerts" element={<Alerts />} />
		  <Route path="/aqialerts" element={<AQIAlerts />} />
		  <Route path="/customize" element={<Customize />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
