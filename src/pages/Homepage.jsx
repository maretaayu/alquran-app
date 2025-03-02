import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import "../styles/HomePage.css";

const HomePage = () => {
  const [surahs, setSurahs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("https://equran.id/api/v2/surat");
        if (!response.ok) {
          throw new Error("Failed to fetch surahs");
        }
        const data = await response.json();
        setSurahs(data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <h2>Daftar Surah</h2>
      <div className="surah-list">
        {surahs.map((surah) => (
          <Link
            to={`/surah/${surah.nomor}`}
            key={surah.nomor}
            className="surah-card"
          >
            <div className="surah-number">{surah.nomor}</div>
            <div className="surah-info">
              <div className="surah-name-group">
                <h3 className="surah-name-latin">{surah.namaLatin}</h3>
                <h3 className="surah-name-arabic">{surah.nama}</h3>
              </div>
              <div className="surah-details">
                <span>{surah.arti}</span>
                <span>
                  {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
