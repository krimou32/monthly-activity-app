// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes instead of Switch
import Navbar from "./components/Navbar";
import ActivitiesList from "./components/ActivitiesList";
import Home from "./components/Home"; // Assume you have a Home component for your main page

function App() {
  return (
    <div className="container mx-auto">
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/activities"
            element={<ActivitiesList />}
          />
          <Route
            path="/"
            element={<Home />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
