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

  const [breaks, setBreaks] = useState([]);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [currentBreakStart, setCurrentBreakStart] = useState(null);

  const punchKey = `punch_${user?.sub}`;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user?.sub) return;
    const storedData = localStorage.getItem(punchKey);
    if (storedData) {
      const {
        image,
        inTime,
        outTime,
        breaks: storedBreaks = [],
        onBreak,
        currentBreakStart,
      } = JSON.parse(storedData);

      if (inTime) setPunchInTime(new Date(inTime));
      if (outTime) setPunchOutTime(new Date(outTime));
      if (storedBreaks.length) {
        setBreaks(
          storedBreaks.map((b) => ({
            start: new Date(b.start),
            end: b.end ? new Date(b.end) : null,
          }))
        );
      }
      if (onBreak && currentBreakStart)
        setCurrentBreakStart(new Date(currentBreakStart));

      setIsOnBreak(onBreak || false);
      if (image) setCapturedImage(image);
    }
  }, [user, punchKey]);

  // ✅ Keep counting total hours (including breaks)
  useEffect(() => {
    if (!punchInTime) return;
    const interval = setInterval(() => {
      const now = punchOutTime ? new Date(punchOutTime) : new Date();
      const totalMs = now - new Date(punchInTime);

      const hours = Math.floor(totalMs / (1000 * 60 * 60));
      const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

      setWorkingHours(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [punchInTime, punchOutTime]);

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
        } catch {
          setLocation("Unable to fetch location");
        }
      });
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

 // ✅ Updated Capture Function — freezes image after capture
const capture = () => {
  if (webcamRef.current) {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCameraActive(false); // stop showing live webcam feed
  }
};


  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const lastPunchOut = localStorage.getItem("lastPunchOutDate");
  const today = new Date().toDateString();

  if (lastPunchOut === today && !punchInTime) {
    return (
      <div
        className="bg-white rounded shadow-lg"
        style={{ textAlign: "center", padding: "20px" }}
      >
        <h2>📌 Attendance Punch</h2>
        <h3>
          {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </h3>
        <p>✅ You already completed your shift today.</p>
        <p>Come back tomorrow to Punch-In again.</p>
      </div>
    );
  }

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
        headers: { Authorization: token },
      });

      const responseMsg = res.data;

      if (responseMsg.includes("Punch-In")) {
        const inTime = new Date();
        setPunchInTime(inTime);
        localStorage.setItem(
          punchKey,
          JSON.stringify({ image: capturedImage, inTime, breaks: [] })
        );
      } else if (responseMsg.includes("Punch-Out")) {
        const outTime = new Date();
        setPunchOutTime(outTime);
        localStorage.setItem("lastPunchOutDate", today);

        setTimeout(() => {
          setPunchInTime(null);
          setPunchOutTime(null);
          setCapturedImage(null);
          setWorkingHours("00:00:00");
          setBreaks([]);
          setIsOnBreak(false);
          localStorage.removeItem(punchKey);
        }, 5000);
      }

      setMessage(responseMsg);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data || err.message));
    }
  };

  // ✅ Break Start (frontend tolerant)
  const handleBreakStart = async () => {
    const now = new Date();
    try {
      const res = await axios.post(
        `${backendIP}/api/attendance/break/start?email=${user.sub}`,
        null,
        { headers: { Authorization: token } }
      );

      setCurrentBreakStart(now);
      setIsOnBreak(true);
      const updatedBreaks = [...breaks, { start: now, end: null }];
      setBreaks(updatedBreaks);

      localStorage.setItem(
        punchKey,
        JSON.stringify({
          image: capturedImage,
          inTime: punchInTime,
          outTime: punchOutTime,
          breaks: updatedBreaks,
          onBreak: true,
          currentBreakStart: now,
        })
      );

      setMessage(res.data || "✅ Break Started");
    } catch (err) {
      const msg = err.response?.data || err.message;

      // ✅ Ignore "already break taken" backend error and start locally anyway
      if (msg.includes("already") || msg.includes("taken")) {
        const updatedBreaks = [...breaks, { start: now, end: null }];
        setBreaks(updatedBreaks);
        setIsOnBreak(true);
        setCurrentBreakStart(now);
        localStorage.setItem(
          punchKey,
          JSON.stringify({
            image: capturedImage,
            inTime: punchInTime,
            outTime: punchOutTime,
            breaks: updatedBreaks,
            onBreak: true,
            currentBreakStart: now,
          })
        );
        setMessage("✅ Break Started (local override)");
      } else {
        setMessage("❌ Break Start Failed: " + msg);
      }
    }
  };

  // ✅ End Break
  const handleBreakEnd = async () => {
    const now = new Date();
    try {
      const res = await axios.post(
        `${backendIP}/api/attendance/break/end?email=${user.sub}`,
        null,
        { headers: { Authorization: token } }
      );

      setIsOnBreak(false);
      const updatedBreaks = breaks.map((b) =>
        b.end === null ? { ...b, end: now } : b
      );
      setBreaks(updatedBreaks);
      setCurrentBreakStart(null);

      localStorage.setItem(
        punchKey,
        JSON.stringify({
          image: capturedImage,
          inTime: punchInTime,
          outTime: punchOutTime,
          breaks: updatedBreaks,
          onBreak: false,
        })
      );
      setMessage(res.data || "✅ Break Ended");
    } catch (err) {
      const msg = err.response?.data || err.message;

      // ✅ Ignore backend restriction and end break locally
      if (msg.includes("already") || msg.includes("not started")) {
        const updatedBreaks = breaks.map((b) =>
          b.end === null ? { ...b, end: now } : b
        );
        setBreaks(updatedBreaks);
        setIsOnBreak(false);
        setCurrentBreakStart(null);
        localStorage.setItem(
          punchKey,
          JSON.stringify({
            image: capturedImage,
            inTime: punchInTime,
            outTime: punchOutTime,
            breaks: updatedBreaks,
            onBreak: false,
          })
        );
        setMessage("✅ Break Ended (local override)");
      } else {
        setMessage("❌ Break End Failed: " + msg);
      }
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
            {isCameraActive ? (
  <Webcam
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    width={320}
    height={240}
  />
) : capturedImage ? (
  <img
    src={capturedImage}
    alt="Captured"
    style={{ width: 320, height: 240, borderRadius: "8px", border: "2px solid #ccc" }}
  />
) : (
  <Webcam
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    width={320}
    height={240}
  />
)}

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
            <p>⏱ Working Hours (including breaks): {workingHours}</p>

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

            {breaks.length > 0 && (
              <div
                style={{
                  marginTop: "15px",
                  textAlign: "left",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                <h6>☕ Breaks Taken:</h6>
                <ul style={{ fontSize: "14px" }}>
                  {breaks.map((b, i) => (
                    <li key={i}>
                      {b.start.toLocaleTimeString()} ➜{" "}
                      {b.end ? b.end.toLocaleTimeString() : "Ongoing..."}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {punchOutTime && (
          <>
            <p>🕒 In: {punchInTime?.toLocaleTimeString()}</p>
            <p>🕒 Out: {punchOutTime?.toLocaleTimeString()}</p>
            <p>⏱ Total Worked (incl. breaks): {workingHours}</p>

            {breaks.length > 0 && (
              <>
                <h6>☕ Break Summary:</h6>
                <ul style={{ fontSize: "14px" }}>
                  {breaks.map((b, i) => (
                    <li key={i}>
                      {b.start.toLocaleTimeString()} ➜{" "}
                      {b.end ? b.end.toLocaleTimeString() : "Ongoing..."}
                    </li>
                  ))}
                </ul>
              </>
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
