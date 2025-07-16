import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const AttendancePunch = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState({ lat: '', long: '' });
  const [punchedData, setPunchedData] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user"
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          lat: pos.coords.latitude.toFixed(6),
          long: pos.coords.longitude.toFixed(6)
        }),
        err => reject(err),
        { enableHighAccuracy: true }
      );
    });
  };

  const handlePunch = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert("Unable to capture image.");
      return;
    }

    try {
      const currentLocation = await getLocation();
      setLocation(currentLocation);

      const punchedAt = new Date().toLocaleString();
      setCapturedImage(imageSrc);
      setPunchedData({
        time: punchedAt,
        location: currentLocation,
        image: imageSrc
      });

      alert('Attendance Punched Successfully!');
    } catch (error) {
      alert("Error fetching location: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Attendance Punch</h2>

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
          <button onClick={handlePunch} style={{ marginTop: 10 }}>
            Punch Attendance
          </button>
        </>
      )}

      {punchedData && (
        <div style={{ marginTop: 20 }}>
          <h3>Punch Details</h3>
          <p><strong>Time:</strong> {punchedData.time}</p>
          <p><strong>Location:</strong> Lat: {punchedData.location.lat}, Long: {punchedData.location.long}</p>
          <img src={punchedData.image} alt="Captured" style={{ width: 200, borderRadius: 10 }} />
        </div>
      )}
    </div>
  );
};

export default AttendancePunch;