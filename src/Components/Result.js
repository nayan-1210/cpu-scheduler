import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./Result.css";

const Home2 = () => {
  const [receivedFileContent, setReceivedFileContent] = useState("");
  const [receivedArrivalTime, setReceivedArrivalTime] = useState("");
  const [ArrivalTime, setArrivalTime] = useState(null);
  const [status, setStatus] = useState("");
  const [showResultButton, setShowResultButton] = useState(true); 
  const [arr, setArr] = useState([]);
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#E4FC09",
    "#33FFF3", "#8C33FF", "#FF3333", "#33FF8C", "#FFFF33"
  ];

  const ENDPOINT = "http://localhost:5000";
  const socketRef = useRef(null);

  const maxTime = 61; 
  const chartWidth = 800;
  const timeScale = chartWidth / maxTime;
  const numGridLines = 5; 
  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);

    socketRef.current.on("connect", () => {
      console.log("Connected to the server2");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from the server2");
    });

    socketRef.current.on("receive_files", (data) => {
      console.log("Received files data:", data);

      setReceivedFileContent(data.output_file);
      setStatus(data.output_file_status);

      const outputLines = data.output_file.split('\n');
      let parsedData = [];
      let arr2 = [];

      outputLines.forEach((line, index) => {
        if (line.trim() === "") {
          parsedData.push(arr2); 
          arr2 = []; 
        } else {
          const pairs = line.slice(0, -1).split(',');
          const result = pairs.map(pair => pair.split(':').map(Number));
          arr2.push(result); 
        }
      });

      setArr(parsedData); 
      console.log("Parsed data:", parsedData);

      setReceivedArrivalTime(data.arrival_file);
      const arrivalLines = data.arrival_file.split('\n');
      let arrivalTime = [];
      arrivalLines.forEach((line, index) => {
        if (line.trim() !== "") arrivalTime.push(parseInt(line));
      });
      setArrivalTime(arrivalTime);
      console.log("Arrival time:", arrivalTime);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleResultClick = () => {
    console.log("Button clicked");
    if (socketRef.current) {
      socketRef.current.emit("request_files");
    }
  };

  const calculateresult = (data) => {
    if (!data || !ArrivalTime || ArrivalTime.length === 0) return [0, 0, 0];

    let resultarr = [];
    let waiting_time = 0;

    data.forEach((task, i) => {
      let prev = ArrivalTime[i];
      task.forEach(([start, end]) => {
        if (start !== undefined && end !== undefined) {
          waiting_time += start - prev;
          prev = end;
        }
      });
    });

    const avg_waiting_time = waiting_time / data.length;
    resultarr.push(avg_waiting_time);

    let turnaround_time = 0;
    data.forEach((task, i) => {
      if (task.length > 0) {
        const lastIndex = task.length - 1;
        const end = task[lastIndex][1];
        if (end !== undefined) {
          turnaround_time += end - ArrivalTime[i];
        }
      }
    });

    const avg_turnaround_time = turnaround_time / data.length;
    resultarr.push(avg_turnaround_time);

    let initial_time = Math.min(...ArrivalTime);
    let final_time = Math.max(...data.flat().map(range => range[1]).filter(Boolean));
    const throughput = data.length / (final_time - initial_time);
    resultarr.push(throughput);

    return resultarr;
  }

  const algo_results = arr.map((algorithmData, index) => ({
    index,
    result: calculateresult(algorithmData)
  }));

  algo_results.sort((a, b) => a.result[0] - b.result[0]);
  const optimized_algo_id = algo_results.length > 0 ? algo_results[0].index : null;
  let optimized_algorithm = '';

  switch (optimized_algo_id) {
    case 0:
      optimized_algorithm = "First Come First Serve";
      break;
    case 1:
      optimized_algorithm = "Shortest Job First";
      break;
    case 2:
      optimized_algorithm = "Shortest Remaining Time First";
      break;
    case 3:
      optimized_algorithm = "Round Robin";
      break;
    default:
      optimized_algorithm = "Unknown";
      break;
  }

  const renderGridLines = () => {
    const gridLines = [];
    for (let i = 1; i <= numGridLines; i++) {
      const yPosition = (chartWidth / numGridLines) * i;
      gridLines.push(
        <div
          key={`grid-line-${i}`}
          className="grid-line"
          style={{ top: `${yPosition}px` }}
        />
      );
    }
    return gridLines;
  };

  const renderGanttChart = (data, chartIndex, algorithmName, resultstat) => (
    <div className="gantt-chart-container" key={`chart-${chartIndex}`}>
      <h3 className="algorithm_name">{algorithmName}</h3>
      <table className="result-table">
        <thead>
          <tr>
            <th>Average Waiting Time</th>
            <th>Average Turnaround Time</th>
            <th>Throughput</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{resultstat[0].toFixed(2)}</td>
            <td>{resultstat[1].toFixed(2)}</td>
            <td>{resultstat[2].toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div className="gantt-chart" style={{ width: chartWidth }}>
        {data?.map((ranges, rangeIndex) => (
          ranges.map((range, index) => {
            const [start, end] = range;
            const color = colors[rangeIndex % colors.length];
            return (
              <div key={`${rangeIndex}-${index}`}>
                <div
                  className="gantt-bar"
                  style={{
                    left: `${start * timeScale}px`,
                    width: `${(end - start) * timeScale}px`,
                    top: `${30 * rangeIndex}px`,
                    backgroundColor: color
                  }}
                />
                <div
                  className="label"
                  style={{
                    left: `${start * timeScale}px`,
                    top: `${30 * rangeIndex + 20}px` 
                  }}
                >
                  {`${start}-${end}`}
                </div>
              </div>
            );
          })
        ))}
        <div className="grid-lines">{renderGridLines()}</div>
      </div>
    </div>
  );

  return (
    <>
      {showResultButton && (
        <div className="resultbutton">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResultClick}
          >
            Click to compare performance and statistics of different algorithms
          </button>
        </div>
      )}
      {status!="" &&<h4 className="optimized-algorithm-message">
        {optimized_algorithm !== 'Unknown' && 
          <>The most optimized algorithm is <span className="algorithm-name">{optimized_algorithm}</span> because of less average waiting time and less average turnaround time.</>
        }
      </h4>}
      {status!="" && <h1 className="gantt_chart">Gantt Chart</h1>}
      <div className="charts-container">
        {arr[0] && renderGanttChart(arr[0], 0, "First Come First Serve", calculateresult(arr[0]))}
        {arr[1] && renderGanttChart(arr[1], 1, "Shortest Job First", calculateresult(arr[1]))}
        {arr[2] && renderGanttChart(arr[2], 2, "Shortest Remaining Time First", calculateresult(arr[2]))}
        {arr[3] && renderGanttChart(arr[3], 3, "Round Robin", calculateresult(arr[3]))}
      </div>
      
    </>
  );
};

export default Home2;
