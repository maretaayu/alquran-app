import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import "../styles/SurahDetail.css";

const SurahDetail = () => {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAyat, setCurrentAyat] = useState(null);
  const [currentReciter, setCurrentReciter] = useState("01"); // Default reciter

  useEffect(() => {
    const fetchSurahDetail = async () => {
      try {
        const response = await fetch(`https://equran.id/api/v2/surat/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch surah detail");
        }
        const data = await response.json();
        setSurah(data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchSurahDetail();

    // Clean up audio on component unmount
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, [id]);

  const handlePlayAudio = (ayat, reciter = currentReciter) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(ayat.audio[reciter]);
    setCurrentAudio(audio);
    setCurrentAyat(ayat.nomorAyat);
    setCurrentReciter(reciter);

    audio.play();
    setAudioPlaying(true);

    audio.onended = () => {
      setAudioPlaying(false);
      setCurrentAyat(null);
    };
  };

  const handlePlayFullSurah = () => {
    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(surah.audioFull[currentReciter]);
    setCurrentAudio(audio);
    setCurrentAyat("full");

    audio.play();
    setAudioPlaying(true);

    audio.onended = () => {
      setAudioPlaying(false);
      setCurrentAyat(null);
    };
  };

  const handlePauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setAudioPlaying(false);
    }
  };

  const changeReciter = (reciterId) => {
    setCurrentReciter(reciterId);
    if (audioPlaying && currentAyat) {
      if (currentAyat === "full") {
        const audio = new Audio(surah.audioFull[reciterId]);
        if (currentAudio) {
          currentAudio.pause();
        }
        setCurrentAudio(audio);
        audio.play();
      } else {
        const ayat = surah.ayat.find((a) => a.nomorAyat === currentAyat);
        if (ayat) {
          handlePlayAudio(ayat, reciterId);
        }
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!surah) {
    return <div className="error">Surah not found</div>;
  }

  const reciters = [
    { id: "01", name: "Abdullah Al-Juhany" },
    { id: "02", name: "Abdul Muhsin Al-Qasim" },
    { id: "03", name: "Abdurrahman as-Sudais" },
    { id: "04", name: "Ibrahim Al-Dossari" },
    { id: "05", name: "Misyari Rasyid Al-Afasi" },
  ];

  return (
    <div className="surah-detail">
      <div className="surah-header">
        <Link to="/" className="back-button">
          ← Kembali
        </Link>
        <div className="surah-title">
          <h2>
            {surah.namaLatin} ({surah.nama})
          </h2>
          <p>
            {surah.arti} • {surah.tempatTurun} • {surah.jumlahAyat} Ayat
          </p>
        </div>
      </div>

      <div className="audio-controls">
        <div className="reciter-selector">
          <label>Pilih Qari: </label>
          <select
            value={currentReciter}
            onChange={(e) => changeReciter(e.target.value)}
          >
            {reciters.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="play-full-button"
          onClick={audioPlaying ? handlePauseAudio : handlePlayFullSurah}
        >
          {audioPlaying && currentAyat === "full" ? "Pause" : "Play Full Surah"}
        </button>
      </div>

      <div
        className="surah-description"
        dangerouslySetInnerHTML={{ __html: surah.deskripsi }}
      ></div>

      <div className="ayat-list">
        {surah.ayat.map((ayat) => (
          <div
            key={ayat.nomorAyat}
            className={`ayat-item ${
              currentAyat === ayat.nomorAyat ? "playing" : ""
            }`}
          >
            <div className="ayat-number">{ayat.nomorAyat}</div>
            <div className="ayat-content">
              <div className="ayat-arabic">{ayat.teksArab}</div>
              <div className="ayat-latin">{ayat.teksLatin}</div>
              <div className="ayat-translation">{ayat.teksIndonesia}</div>
              <button
                className="play-ayat-button"
                onClick={() => {
                  if (audioPlaying && currentAyat === ayat.nomorAyat) {
                    handlePauseAudio();
                  } else {
                    handlePlayAudio(ayat);
                  }
                }}
              >
                {audioPlaying && currentAyat === ayat.nomorAyat
                  ? "Pause"
                  : "Play"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        {surah.suratSebelumnya && (
          <Link
            to={`/surah/${surah.suratSebelumnya.nomor}`}
            className="nav-button prev"
          >
            ← {surah.suratSebelumnya.namaLatin}
          </Link>
        )}
        {surah.suratSelanjutnya && (
          <Link
            to={`/surah/${surah.suratSelanjutnya.nomor}`}
            className="nav-button next"
          >
            {surah.suratSelanjutnya.namaLatin} →
          </Link>
        )}
      </div>
    </div>
  );
};

export default SurahDetail;
