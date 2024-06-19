import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./Home.css";
import cpu from "./CPU_attack.jpg";

export default function Home2() {
  const [showModal, setShowModal] = useState(false);
  const [showSpinners, setShowSpinners] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [numProcesses, setNumProcesses] = useState(1);
  const [fileContent, setFileContent] = useState(null);
  const [receivedFileContent, setReceivedFileContent] = useState("");
  const [status, setStatus] = useState("");
  const [showResultButton, setShowResultButton] = useState(false); 
  const ENDPOINT = "http://localhost:5000";
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);

    socketRef.current.on("connect", () => {
      console.log("Connected to the server");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socketRef.current.on("file_received", (data) => {
      setStatus(data.status);
    });

    socketRef.current.on("receive_file", (data) => {
      setReceivedFileContent(data.file);
      setStatus(data.status);
      setShowSpinners(false); 
      setShowResultModal(true); 
      setShowResultButton(true); 
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const submitProcess = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleFileChange = (event) => {
    setFileContent(event.target.files[0]);
  };

  const handleNumProcessesChange = (event) => {
    setNumProcesses(event.target.value);
  };

  const handleSubmit = () => {
    if (fileContent) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileText = reader.result;
        if (socketRef.current) {
          socketRef.current.emit("send_file", { file: fileText ,numProcesses:numProcesses});
        }
      };
      reader.readAsText(fileContent);
    } else {
      setStatus("No file selected");
    }
    setShowModal(false);
    setShowSpinners(true);

    
    setTimeout(() => {
      setShowSpinners(false);
      setShowResultButton(true);
    }, 3000); 
  };

  

  const handleResultClick2 = () => {
    const currentURL = window.location.href;
    const loginURL = `${currentURL}result`;
    window.location.href = loginURL;
  };

  const handleResultClose = () => {
    setShowResultModal(false);
  };

  return (
    <div className={`home-container ${showSpinners ? "blur" : ""}`}>
      <section id="hero" className="d-flex align-items-center">
        <div className="container23">
          <div className="textfirst">
            <h2>CPU Scheduler</h2>
            <h3>Your Scheduling Companion</h3>
           
            <button
              onClick={submitProcess}
              type="button"
              className="btn btn-primary"
              id="getStarted"
            >
              Get Started
            </button>
          </div>
          <div className="imagefirst">
            <img src={cpu} alt="Right Part - Image" />
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Process Input</h5>
                <button type="button" className="close" onClick={handleClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="numProcesses">Number of Processes</label>
                  <select
                    id="numProcesses"
                    className="form-control"
                    value={numProcesses}
                    onChange={handleNumProcessesChange}
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="fileInput">Upload File</label>
                  <input
                    type="file"
                    id="fileInput"
                    className="form-control-file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {showSpinners && (
        <div className="spinner-container">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}

      {/* {status && <div className="status-message">{status}</div>} */}

      {showResultButton && (
        <div className="result_button">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResultClick2}
          >
            View Results
          </button>
        </div>
      )}

      {showResultModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Result</h5>
                <button type="button" className="close" onClick={handleResultClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h3>Received File Content:</h3>
                <pre>{receivedFileContent}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleResultClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showResultModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
