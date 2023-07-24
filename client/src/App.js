import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import ContactPage from './components/Contact';

// import Navbar from ""


const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file1Preview, setFile1Preview] = useState(null);
  const [file2Preview, setFile2Preview] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);  //// uploaded files in the format specifications
  

  const handleFile1Change = (event) => {
    const selectedFile = event.target.files[0];
    setFile1(selectedFile);

    // Generate preview URL for File 1
    const reader = new FileReader();
    reader.onload = () => {
      setFile1Preview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFile2Change = (event) => {
    const selectedFile = event.target.files[0];
    setFile2(selectedFile);

    // Generate preview URL for File 2
    const reader = new FileReader();
    reader.onload = () => {
      setFile2Preview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (file1 && file2) {
      const formData = new FormData();
      formData.append("file1", file1);
      formData.append("file2", file2); 

      fetch("http://localhost:5000/upload-file", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message)
          console.log("File uploaded successfully:", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  return (
    <Router>
<div>
    
<Navbar />
<Routes>
          <Route path="/contact" element={<ContactPage />} />
          {/* Add more routes for other pages */}
        </Routes>
    <div class="alert alert-success" role="alert" >
      <h1>File Upload</h1>
      <form>
        <div>
          <label>Choose File 1:</label>
          <input type="file" onChange={handleFile1Change} />
          {file1Preview && <img src={file1Preview} alt="File 1 Preview" height={50} width={120}/>}
        </div>

        <div>
          <label>Choose File 2:</label>
          <input type="file" onChange={handleFile2Change} />
          {file2Preview && <img src={file2Preview} alt="File 2 Preview" height={50} width={120} />}
        </div>

        {!isUploaded ? (
            <button type="button" class="btn btn-primary" onClick={handleSubmit}>Primary</button>
        ) : (
          <p >Files uploaded successfully.</p>
        )}
      </form>
    </div>
    </div>
    </Router>
  );
};

export default App;
