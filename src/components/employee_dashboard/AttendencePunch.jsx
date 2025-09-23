// src/components/attendance/AttendancePunch.jsx
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

  // ✅ Break state
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [breakEndTime, setBreakEndTime] = useState(null);
  const [isOnBreak, setIsOnBreak] = useState(false);

  const punchKey = `punch_${user?.sub}`;

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
      const { image, inTime, outTime, breakStart, breakEnd, onBreak } =
        JSON.parse(storedData);

      if (inTime) setPunchInTime(new Date(inTime));
      if (outTime) setPunchOutTime(new Date(outTime));
      if (breakStart) setBreakStartTime(new Date(breakStart));
      if (breakEnd) setBreakEndTime(new Date(breakEnd));
      if (image) setCapturedImage(image);
      if (onBreak) setIsOnBreak(true);
    }
  }, [user, punchKey]);

  // ✅ Calculate Working Hours (pauses on break)
  useEffect(() => {
    if (!punchInTime) return;
    let interval;

    if (!isOnBreak) {
      interval = setInterval(() => {
        const now = new Date();
        const endTime = punchOutTime ? new Date(punchOutTime) : now;

        let diffMs = endTime - new Date(punchInTime);

        // subtract break duration
        if (breakStartTime && !breakEndTime) {
          diffMs -= now - breakStartTime; // ongoing break
        } else if (breakStartTime && breakEndTime) {
          diffMs -= breakEndTime - breakStartTime;
        }

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setWorkingHours(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [punchInTime, punchOutTime, isOnBreak, breakStartTime, breakEndTime]);

  // ✅ Fetch Location
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

  // ✅ Single Punch (backend decides In/Out)
  const handlePunch = async () => {
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

      const res = await axios.post(`${backendIP}/api/attendance/marks`, formData, {
        headers : {
          Authorization : token
        }
      });

      const responseMsg = res.data;

      if (responseMsg.includes("Punch-In")) {
        const inTime = new Date();
        setPunchInTime(inTime);
        localStorage.setItem(
          punchKey,
          JSON.stringify({ image: capturedImage, inTime })
        );
      } else if (responseMsg.includes("Punch-Out")) {
        const outTime = new Date();
        setPunchOutTime(outTime);

        // Reset after 3 seconds
        setTimeout(() => {
          setPunchInTime(null);
          setPunchOutTime(null);
          setCapturedImage(null);
          setWorkingHours("00:00:00");
          setBreakStartTime(null);
          setBreakEndTime(null);
          setIsOnBreak(false);
          localStorage.removeItem(punchKey);
        }, 3000);
      }

      setMessage(responseMsg);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data || err.message));
    }
  };

  // ✅ Break Start
  const handleBreakStart = async () => {
    try {
      const res = await axios.post(
        `${backendIP}/api/attendance/break/start?email=${user.sub}`, 
        null,
        { headers: { Authorization: token } }
      );
      const now = new Date();
      setBreakStartTime(now);
      setIsOnBreak(true);

      localStorage.setItem(
        punchKey,
        JSON.stringify({
          image: capturedImage,
          inTime: punchInTime,
          outTime: punchOutTime,
          breakStart: now,
          onBreak: true,
        })
      );
      setMessage(res.data || "✅ Break Started");
    } catch (err) {
      setMessage("❌ Break Start Failed: " + (err.response?.data || err.message));
    }
  };

  // ✅ Break End
  const handleBreakEnd = async () => {
    try {
      const res = await axios.post(
        `${backendIP}/api/attendance/break/end?email=${user.sub}`,
        null,
        { headers: { Authorization: token } }
      );
      const now = new Date();
      setBreakEndTime(now);
      setIsOnBreak(false);

      localStorage.setItem(
        punchKey,
        JSON.stringify({
          image: capturedImage,
          inTime: punchInTime,
          outTime: punchOutTime,
          breakStart: breakStartTime,
          breakEnd: now,
          onBreak: false,
        })
      );
      setMessage(res.data || "✅ Break Ended");
    } catch (err) {
      setMessage("❌ Break End Failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div
      className="bg-white rounded shadow-lg"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h2>📌 Attendance Punch</h2>
      <h3>
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </h3>

      <div
        className="shadow-lg"
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          width: "350px",
          margin: "20px auto",
        }}
      >
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
              onClick={handlePunch}
              className="btn btn-outline-primary"
              disabled={!capturedImage}
              style={{ margin: "10px", padding: "8px" }}
            >
              🚀 Punch In
            </button>
          </>
        )}

        {punchInTime && !punchOutTime && (
          <>
            <p>🕒 In Time: {punchInTime.toLocaleTimeString()}</p>
            <p>⏱ Live Hours: {workingHours}</p>

            {!isOnBreak ? (
              <button
                onClick={handleBreakStart}
                className="btn btn-warning"
                style={{ margin: "10px", padding: "8px" }}
              >
                ☕ Start Break
              </button>
            ) : (
              <button
                onClick={handleBreakEnd}
                className="btn btn-success"
                style={{ margin: "10px", padding: "8px" }}
              >
                ✅ End Break
              </button>
            )}

            <button
              onClick={handlePunch}
              className="btn btn-outline-danger"
              style={{ padding: "8px", marginTop: "10px" }}
            >
              🔴 Punch Out
            </button>
          </>
        )}

        {punchOutTime && (
          <>
            <p>🕒 In: {punchInTime?.toLocaleTimeString()}</p>
            <p>🕒 Out: {punchOutTime?.toLocaleTimeString()}</p>
            <p>⏱ Total Hours: {workingHours}</p>
            {breakStartTime && (
              <p>☕ Break Started: {breakStartTime.toLocaleTimeString()}</p>
            )}
            {breakEndTime && (
              <p>✅ Break Ended: {breakEndTime.toLocaleTimeString()}</p>
            )}
            {capturedImage && (
              <img
                src={capturedImage}
                alt="punch"
                width={220}
                style={{ marginTop: "10px" }}
              />
            )}
          </>
        )}
      </div>

      <p>📍 {location}</p>
      <p>{message}</p>
    </div>
  );
};

export default AttendancePunch;
