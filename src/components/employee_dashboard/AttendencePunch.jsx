import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import backendIP from "../../api";

const AttendancePunch = ({ sub }) => {
  const webcamRef = useRef(null);
  const { token } = useAuth();

  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  // Capture image from webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  // Get location from backend (proxy to avoid CORS)
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `${backendIP}/HRMS/api/location/reverse?lat=${latitude}&lon=${longitude}`
          );
          setLocation(res.data.display_name || `${latitude}, ${longitude}`);
        } catch (err) {
          console.error("Location fetch error:", err);
          setLocation(`${latitude}, ${longitude}`);
        }
      });
    } else {
      setLocation("Geolocation not supported");
    }
  };

  // Submit attendance to backend
  const handleSubmit = async () => {
    if (!capturedImage) {
      setMessage("⚠ Please capture an image first.");
      return;
    }

    try {
      const file = await (await fetch(capturedImage)).blob();
      const formData = new FormData();
      formData.append("file", file, "attendance.jpg");
      formData.append("employeeEmail", sub);
      formData.append("location", location || "");

      const response = await axios.post(
        `${backendIP}/HRMS/api/attendance/mark`,
        formData,
        {
          headers: {
            Authorization: token, // ✅ Fix here
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setMessage("❌ Failed to submit attendance.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Attendance Punch</h2>

      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={300} />

      <br />
      <button onClick={capture}>📸 Capture</button>
      <button onClick={fetchLocation}>📍 Get Location</button>
      <button onClick={handleSubmit}>✅ Submit Attendance</button>

      {capturedImage && (
        <div>
          <h4>Preview:</h4>
          <img src={capturedImage} alt="Captured" width={200} />
        </div>
      )}

      {location && <p><b>Location:</b> {location}</p>}
      {message && <p><b>Status:</b> {message}</p>}
    </div>
  );
};

export default AttendancePunch;
