import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const AttendancePunch = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState("");
  const [punchedData, setPunchedData] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [workingHours, setWorkingHours] = useState("00:00:00");
  const webcamRef = useRef(null);

  const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your key

  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user",
  };

  // 📌 Get location in words with PIN code
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
            );
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              setLocation(data.results[0].formatted_address);
            } else {
              setLocation("Address not found");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            setLocation("Error fetching location");
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // 📌 Working hours counter
  useEffect(() => {
    if (!loginTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - loginTime;
      const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

      setWorkingHours(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [loginTime]);

  const handlePunchIn = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert("Unable to capture image.");
      return;
    }

    const punchedAt = new Date().toLocaleString();
    setCapturedImage(imageSrc);
    setLoginTime(new Date());
    setPunchedData({
      type: "Punch In",
      time: punchedAt,
      location,
      image: imageSrc,
    });

    alert("Punch In Successful!");
  };

  const handlePunchOut = () => {
    const punchedAt = new Date().toLocaleString();
    setPunchedData((prev) => ({
      ...prev,
      type: "Punch Out",
      time: punchedAt,
      workingHours,
    }));
    alert("Punch Out Successful!");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Attendance Punch</h2>

      {/* Live Location in words */}
      <p>
        <strong>Live Location:</strong> {location || "Fetching location..."}
      </p>

      {/* Working Hours */}
      {loginTime && (
        <p>
          <strong>Working Hours:</strong> {workingHours}
        </p>
      )}

      {/* Webcam */}
      {!capturedImage && (
        <>
          <Webcam
            audio={false}
            height={240}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            videoConstraints={videoConstraints}
          />
          <br />
          <button onClick={handlePunchIn} style={{ marginTop: 10 }}>
            Punch In
          </button>
        </>
      )}

      {/* Punch Out */}
      {capturedImage && punchedData?.type === "Punch In" && (
        <div style={{ marginTop: 10 }}>
          <button onClick={handlePunchOut} style={{ marginTop: 10 }}>
            Punch Out
          </button>
        </div>
      )}

      {/* Details */}
      {punchedData && (
        <div style={{ marginTop: 20 }}>
          <h3>{punchedData.type} Details</h3>
          <p>
            <strong>Time:</strong> {punchedData.time}
          </p>
          <p>
            <strong>Location:</strong> {punchedData.location}
          </p>
          {punchedData.image && (
            <img
              src={punchedData.image}
              alt="Captured"
              style={{ width: 200, borderRadius: 10 }}
            />
          )}
          {punchedData.type === "Punch Out" && (
            <p>
              <strong>Total Working Hours:</strong> {punchedData.workingHours}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendancePunch;