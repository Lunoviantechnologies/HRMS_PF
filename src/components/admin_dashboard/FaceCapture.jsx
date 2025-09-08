/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const FaceCapture = ({ setFieldValue }) => {
    const webcamRef = useRef(null);
    const faceCascade = useRef(null);

    const [opencvReady, setOpenCvReady] = useState(false);
    const [captured, setCaptured] = useState(null);

    useEffect(() => {
        async function initCV() {
            console.log("✅ OpenCV runtime initialized!");

            try {
                const response = await fetch("/haarcascade_frontalface_default.xml");
                const buffer = await response.arrayBuffer();
                const data = new Uint8Array(buffer);

                try { cv.FS_unlink("/haarcascade_frontalface_default.xml"); } catch { }
                cv.FS_createDataFile("/", "haarcascade_frontalface_default.xml", data, true, false, false);

                faceCascade.current = new cv.CascadeClassifier();
                if (faceCascade.current.load("haarcascade_frontalface_default.xml")) {
                    console.log("🎉 Haar cascade loaded successfully!");
                    setOpenCvReady(true);
                } else {
                    console.error("❌ Failed to load cascade");
                }
            } catch (err) {
                console.error("⚠️ Error loading cascade:", err);
            }
        }

        if (window.cv && window.cv.Mat) {
            initCV();
        } else {
            console.log("⏳ Waiting for OpenCV runtime...");
            window.cv["onRuntimeInitialized"] = initCV;
        }
    }, []);

    const captureFace = () => {
        if (!opencvReady || !webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            let src = cv.imread(img);
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            let faces = new cv.RectVector();
            faceCascade.current.detectMultiScale(gray, faces, 1.2, 5);

            if (faces.size() > 0) {
                let face = faces.get(0);
                let faceMat = src.roi(face);

                const canvas = document.createElement("canvas");
                cv.imshow(canvas, faceMat);

                canvas.toBlob((blob) => {
                    const file = new File([blob], `face-${Date.now()}.png`, { type: "image/png" });
                    setFieldValue("imageDir", [file]);
                    setCaptured(URL.createObjectURL(file));
                });

                faceMat.delete();
            } else {
                alert("⚠️ No face detected. Please align inside the oval.");
            }

            src.delete();
            gray.delete();
            faces.delete();
        };
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    videoConstraints={{ width: 480, height: 360, facingMode: "user" }}
                    style={{ borderRadius: "10px" }}
                />

                {/* Oval overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "240px",
                        height: "320px",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50% / 60%",
                        border: "3px solid rgba(0, 200, 255, 0.9)",
                        boxShadow: "0 0 15px rgba(0, 200, 255, 0.6)",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {/* Capture Button */}
            <div style={{ marginTop: "15px" }}>
                <button
                    type="button"   // ✅ prevents form submit
                    onClick={captureFace}
                    disabled={!opencvReady}
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: opencvReady ? "#007BFF" : "gray",
                        color: "white",
                        fontSize: "16px",
                        cursor: opencvReady ? "pointer" : "not-allowed",
                    }}
                >
                    {opencvReady ? "Capture Face" : "Loading..."}
                </button>

            </div>

            {captured && (
                <div style={{ marginTop: "15px" }}>
                    <p>✅ Captured Face</p>
                    <img src={captured} alt="captured face" width={120} />
                </div>
            )}
        </div>
    );
};

export default FaceCapture;
