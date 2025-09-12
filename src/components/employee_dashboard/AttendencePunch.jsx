import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

const AttendancePunch = () => {
  const { token, user } = useAuth();
  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("");

  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [workingHours, setWorkingHours] = useState("00:00:00");

  const punchKey = `punchIn_${user?.sub}`;

  // ✅ Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Restore state from localStorage
  useEffect(() => {
    if (!user?.sub) return;
    const storedData = localStorage.getItem(punchKey);
    if (storedData) {
      const { image, inTime, outTime } = JSON.parse(storedData);
      if (inTime) setPunchInTime(new Date(inTime));
      if (outTime) setPunchOutTime(new Date(outTime));
      if (image) setCapturedImage(image);
    }
  }, [user, punchKey]);

  // ✅ Calculate Working Hours (live until punch out)
  useEffect(() => {
    if (!punchInTime) return;
    const interval = setInterval(() => {
      const endTime = punchOutTime ? new Date(punchOutTime) : new Date();
      const diffMs = endTime - new Date(punchInTime);
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setWorkingHours(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [punchInTime, punchOutTime]);

  // ✅ Fetch User Location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          setLocation(data.display_name || "Location not found");
        } catch (err) {
          setLocation("Unable to fetch location");
        }
      });
    }
  };
  useEffect(() => {
    fetchLocation();
  }, []);

  // ✅ Capture Image
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  // ✅ Convert base64 → File
  const dataURLtoFile = (dataUrl, filename) => {
    let arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // ✅ Punch In
  const handlePunchIn = async () => {
    if (!capturedImage) {
      setMessage("⚠ Please capture your face first.");
      return;
    }
    try {
      const file = dataURLtoFile(capturedImage, "captured.jpg");

      const formData = new FormData();
      formData.append("photo", file);
      formData.append("email", user.sub);
      formData.append("location", location);

      const res = await axios.post(
        `${backendIP}/api/attendance/punchIn`,
        formData,
        { headers: { Authorization: token } }
      );

      const inTime = new Date();
      setPunchInTime(inTime);

      localStorage.setItem(
        punchKey,
        JSON.stringify({ image: capturedImage, inTime })
      );

      setMessage(res.data.message || "✅ Punched In!");
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data || err.message));
    }
  };

  // ✅ Punch Out
  // ✅ Punch Out
  const handlePunchOut = async () => {
    if (!punchInTime) {
      setMessage("⚠ Please punch in first.");
      return;
    }
    try {
      const file = dataURLtoFile(capturedImage, "captured.jpg");

      const formData = new FormData();
      formData.append("photo", file);
      formData.append("email", user.sub);
      formData.append("location", location);

      const res = await axios.post(
        `${backendIP}/api/attendance/punchOut`,
        formData,
        { headers: { Authorization: token } }
      );

      const outTime = new Date();
      setPunchOutTime(outTime);

      setMessage(res.data.message || "✅ Punched Out!");

      // Show final working hours for 3 seconds, then reset
      setTimeout(() => {
        setPunchInTime(null);
        setPunchOutTime(null);
        setCapturedImage(null);
        setWorkingHours("00:00:00");
        localStorage.removeItem(punchKey);
        setMessage(""); // clear message after reset
      }, 3000);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="bg-white rounded shadow-lg" style={{ textAlign: "center", padding: "20px" }}>
      <h2>📌 Attendance Punch</h2>
      <h3>
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </h3>

      {/* Two side-by-side cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Punch In Card */}
        <div
          className="shadow-lg"
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            width: "300px",
          }}
        >
          <h4>Check In</h4>

          {!punchInTime && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={260}
                height={200}
              />
              <br />
              <button
                onClick={capture}
                className="btn btn-outline-success"
                style={{ margin: "10px", padding: "8px" }}
              >
                📸 Capture
              </button>
              <button
                onClick={handlePunchIn}
                className="btn btn-outline-success"
                disabled={!capturedImage}
                style={{ margin: "10px", padding: "8px" }}
              >
                🚀 Check In
              </button>
            </>
          )}

          {punchInTime && (
            <>
              <p>🕒 In Time: {punchInTime.toLocaleTimeString()}</p>
              {!punchOutTime && <p>⏱ Live Hours: {workingHours}</p>}
            </>
          )}
        </div>

        {/* Punch Out Card */}
        <div
          className="shadow-lg"
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            width: "300px",
          }}
        >
          <h4>Check Out</h4>
          {!punchOutTime ? (
            <button
              onClick={handlePunchOut}
              className="btn btn-outline-danger"
              disabled={!punchInTime}
              style={{ padding: "8px", marginTop: "10px" }}
            >
              🔴 Check Out
            </button>
          ) : (
            <>
              <p>🕒 In: {punchInTime?.toLocaleTimeString()}</p>
              <p>🕒 Out: {punchOutTime?.toLocaleTimeString()}</p>
              <p>⏱ Total Hours: {workingHours}</p>
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="punch-in"
                  width={220}
                  style={{ marginTop: "10px" }}
                />
              )}
            </>
          )}
        </div>
      </div>

      <p>📍 {location}</p>
      <p>{message}</p>
    </div>
  );
};

export default AttendancePunch;
