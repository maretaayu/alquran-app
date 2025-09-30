import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CITY_API_URL = "https://api.myquran.com/v2/sholat/kota/semua";
const SCHEDULE_API_BASE = "https://api.myquran.com/v2/sholat/jadwal";

const formatDateForApi = (date) => {
  const [year, month, day] = date.split("-");
  return `${year}/${month}/${day}`;
};

const formatScheduleLabel = (label) =>
  label
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const PrayerSchedule = () => {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [schedule, setSchedule] = useState(null);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(CITY_API_URL);
        if (!response.ok) {
          throw new Error("Gagal mengambil daftar kota");
        }
        const data = await response.json();
        setCities(data.data);
        setFilteredCities(data.data);
        if (data.data.length > 0) {
          setSelectedCity(data.data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    const fetchSchedule = async () => {
      setLoadingSchedule(true);
      setError(null);
      try {
        const response = await fetch(
          `${SCHEDULE_API_BASE}/${selectedCity.id}/${formatDateForApi(selectedDate)}`
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil jadwal sholat");
        }
        const data = await response.json();
        setSchedule(data.data);
      } catch (err) {
        setError(err.message);
        setSchedule(null);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchSchedule();
  }, [selectedCity, selectedDate]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCities(cities);
      return;
    }

    const term = searchTerm.toLowerCase();
    setFilteredCities(
      cities.filter(
        (city) =>
          city.lokasi.toLowerCase().includes(term) ||
          city.id.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, cities]);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    const city = cities.find((item) => item.id === cityId);
    setSelectedCity(city ?? null);
  };

  return (
    <div className="prayer-page">
      <div className="page-header">
        <Link to="/" className="back-button">
          ← Kembali ke Beranda
        </Link>
        <div>
          <h2>Jadwal Sholat</h2>
          <p>Temukan waktu sholat harian berdasarkan lokasi pilihan Anda.</p>
        </div>
      </div>

      {loadingCities ? (
        <div className="loading">Memuat daftar kota...</div>
      ) : error ? (
        <div className="error">Terjadi kesalahan: {error}</div>
      ) : (
        <>
          <div className="schedule-controls">
            <div className="control-group">
              <label htmlFor="city">Kota</label>
              <input
                id="city-search"
                type="text"
                placeholder="Cari kota..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <select
                id="city"
                value={selectedCity?.id ?? ""}
                onChange={handleCityChange}
              >
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.lokasi}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="date">Tanggal</label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>
          </div>

          {loadingSchedule ? (
            <div className="loading">Memuat jadwal sholat...</div>
          ) : schedule ? (
            <div className="schedule-card">
              <div className="schedule-card__header">
                <h3>{schedule.lokasi}</h3>
                <p>
                  {schedule.daerah} • {schedule.jadwal.tanggal}
                </p>
              </div>
              <div className="schedule-grid">
                {Object.entries(schedule.jadwal)
                  .filter(([key]) => key !== "tanggal")
                  .map(([key, value]) => (
                    <div key={key} className="schedule-item">
                      <span className="schedule-item__label">
                        {formatScheduleLabel(key)}
                      </span>
                      <span className="schedule-item__time">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="error">Jadwal tidak tersedia untuk pilihan ini.</div>
          )}
        </>
      )}
    </div>
  );
};

export default PrayerSchedule;
