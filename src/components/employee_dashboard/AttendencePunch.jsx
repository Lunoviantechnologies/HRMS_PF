import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import backendIP from "../../api"; // ✅ your backend base URL
import { useAuth } from "../../context/AuthContext";

const AttendancePunch = () => {
  const { token, user } = useAuth();    
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("");

  // console.log(user)
  // ✅ Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Fetch User Location (Address instead of lat/lon)
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

  // ✅ Capture Image from Webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  // ✅ Convert base64 → File (needed for multipart/form-data)
  const dataURLtoFile = (dataUrl, filename) => {
    let arr = dataUrl.split(","), mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // ✅ Send Captured Face to Backend
  const sendToBackend = async () => {
    if (!capturedImage) {
      setMessage("⚠️ Please capture your face first.");
      return;
    }

    try {
      const file = dataURLtoFile(capturedImage, "captured.jpg");

      const formData = new FormData();
      formData.append("photo", file);
      formData.append("email", user.sub);  
      formData.append("location", location);

      console.log([...formData.values()])

      const res = await axios.post(
        `${backendIP}/api/attendance/mark`,
        formData,
        {
          headers: {
            // Authorization: token,  // already has Bearer
            //"Content-Type": "multipart/form-data/json" 
          }
        }
      );

      setMessage(res.data.message || "✅ Attendance marked!");
      alert("✅ Attendance marked!");
    } catch (err) {
      console.error("❌ Error marking attendance:", err.response?.data || err.message);
      setMessage("❌ Error: " + (err.response?.data || err.message));
    }
  };



  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📌 Attendance Punch</h2>
      <h3>{currentTime.toLocaleTimeString()}</h3>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <br />

      <button onClick={capture} style={{ margin: "10px", padding: "10px" }}>
        📸 Capture
      </button>
      <button
        onClick={sendToBackend}
        disabled={!capturedImage}
        style={{ margin: "10px", padding: "10px" }}
      >
        🚀 Punch In
      </button>

      {capturedImage && (
        <div>
          <h4>Preview</h4>
          <img src={capturedImage} alt="captured" width={220} />
        </div>
      )}

      <p>📍 {location}</p>
      <p>{message}</p>
    </div>
  );
};

export default AttendancePunch; 