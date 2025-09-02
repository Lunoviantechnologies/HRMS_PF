import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import backendIP from "../../api"; // ✅ your backend base URL
import { useAuth } from "../../context/AuthContext";

const AttendancePunch = () => {
  const { token, user } = useAuth();
  const webcamRef = useRef(null);
  const { token } = useAuth();

  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  // console.log(user)
  // ✅ Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      formData.append("email", user.sub);  // ✅ required by backend
      formData.append("location", location);         // ✅ optional

      console.log([...formData.values()])

      const res = await axios.post(
        `${backendIP}/HRMS/api/attendance/mark`,
        formData,
        {
          headers: {
            // Authorization: token,  // already has Bearer
            // "Content-Type": "multipart/form-data" 
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
