import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SurahDetail from "./pages/SurahDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Al-Quran App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
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
