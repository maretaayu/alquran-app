import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/Homepage";
import SurahDetail from "./pages/SurahDetail";
import PrayerSchedule from "./pages/PrayerSchedule";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Al-Quran App</h1>
          <nav className="App-nav">
            <Link to="/">Beranda</Link>
            <Link to="/jadwal-sholat">Jadwal Sholat</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
            <Route path="/jadwal-sholat" element={<PrayerSchedule />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>Data from equran.id API</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
