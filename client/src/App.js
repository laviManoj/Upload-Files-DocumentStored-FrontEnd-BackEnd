import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactPage from "./components/Contact";
import Webcam from "webcamjs";

// import Navbar from ""

const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [file4, setFile4] = useState(null);

  const [file1Preview, setFile1Preview] = useState(null);
  const [file2Preview, setFile2Preview] = useState(null);
  const [file3Preview, setFile3Preview] = useState();
  const [file4Preview, setFile4Preview] = useState();

  const [isUploaded, setIsUploaded] = useState(false); //// uploaded files in the format specifications

  const handleFile1Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile1(selectedFile);
    }
  };

  const handleFile2Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile2(selectedFile);
      setFile2Preview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFile3Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile3(selectedFile);
      setFile3Preview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFile4Change = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile4(selectedFile);
      setFile4Preview(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    // Set Webcam configuration
    Webcam.set({
      width: 150,
      height: 100,
      image_format: "jpeg",
      jpeg_quality: 90,
    });

    // Attach Webcam to the 'camera' element
    Webcam.attach("#camera");

    // Clean up the Webcam instance when component unmounts
    return () => {
      Webcam.reset();
    };
  }, []);

  const takeSnap = () => {
    Webcam.snap(function (data_uri) {
      // Store the captured image data in state
      setFile1(data_uri);
      document.getElementById("results").innerHTML =
        '<img src="' + data_uri + '"/>';
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if ((file1 || file2) && file3 && file4) {
      const formData = new FormData();

      if (file1) {
        const imageDataBlob = dataURItoBlob(file1);
        formData.append("file1", imageDataBlob, "file1.jpeg");
        console.log(imageDataBlob, "manoj kumar ");
      }

      if (file2) {
        formData.append("file2", file2);
      }

      formData.append("file2", file2);
      formData.append("file3", file3);
      formData.append("file4", file4);

      fetch("http://localhost:5002/upload-file", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          console.log("File uploaded successfully:", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const dataURItoBlob = (dataURI) => {
    console.log(dataURI);
    if (!dataURI) return null; // Add a check for null or undefined dataURI
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/contact" element={<ContactPage />} />
          {/* Add more routes for other pages */}
        </Routes>
        <div class="alert alert-success" role="alert">
          <h1>File Upload</h1>
          <form>
            {/* Choose file1 documents */}
            <div>
              <label>Choose File 1:</label>
              <input type="file" onChange={handleFile1Change} />
              {file1Preview && (
                <img
                  src={file1Preview}
                  alt="File 1 Preview"
                  height={50}
                  width={120}
                />
              )}
            </div>

            {/* Choose File2 documents */}
            <div>
              <label>Choose File 2:</label>
              <input type="file" onChange={handleFile2Change} />
              {file2Preview && (
                <img
                  src={file2Preview}
                  alt="File 2 Preview"
                  height={50}
                  width={120}
                />
              )}
            </div>

            {/* Upload and submit button  */}

            {!isUploaded ? (
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleSubmit}
              >
                Primary
              </button>
            ) : (
              <p>Files uploaded successfully.</p>
            )}
          </form>
        </div>
      </div>
    </Router>
  );
};

export default App;
