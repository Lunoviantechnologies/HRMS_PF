import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const AttendancePunch = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState("");
  const [punchedData, setPunchedData] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [workingHours, setWorkingHours] = useState("00:00:00");
  const webcamRef = useRef(null);

  const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // 🔑 Replace with your key

  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user",
  };

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

  // 📌 Fetch location when punching in
  const fetchLocation = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const city = addressComponents.find((c) =>
          c.types.includes("locality")
        )?.long_name;
        const state = addressComponents.find((c) =>
          c.types.includes("administrative_area_level_1")
        )?.long_name;
        const pincode = addressComponents.find((c) =>
          c.types.includes("postal_code")
        )?.long_name;

        const formatted = `${city || ""}, ${state || ""}, ${pincode || ""}`;
        setLocation(formatted.trim() || "Location not available");
      } else {
        setLocation("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocation("Unable to fetch address");
    }
  };

  const handlePunchIn = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert("Unable to capture image.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchLocation(pos.coords.latitude, pos.coords.longitude);

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
      },
      (err) => {
        console.error("Error getting location:", err);
        setLocation("Location not available");
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePunchOut = () => {
    const punchedAt = new Date().toLocaleString();
    setPunchedData((prev) => ({
      ...prev,
      type: "Punch Out",
      time: punchedAt,
      workingHours,
      location,
    }));
    setLoginTime(null); // ✅ Stop working hours
    alert("Punch Out Successful!");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Attendance Punch</h2>

      {/* Live Location */}
      <p>
        <strong>Location:</strong> {location || "Not available"}
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
            <strong>Location:</strong> {location}
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
