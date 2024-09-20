import React, { useState } from "react";
import Papa from "papaparse";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import TablePreview from "./TablePreview";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const ChartComponent = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          setCsvData(results.data);
          setHeaders(Object.keys(results.data[0]));
          setFilteredData(results.data); // Initially, filtered data is the same as csvData
        },
      });
    }
  };

  const handleFilterChange = (filteredData) => {
    setFilteredData(filteredData); // Update filtered data from the table
  };

  const getChartData = () => {
    if (!xAxis || !yAxis) return null;

    const labels = filteredData.map((row) => row[xAxis]);
    const data = filteredData.map((row) => row[yAxis]);

    return {
      labels,
      datasets: [
        {
          label: yAxis,
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: chartType === "bar" ? "rgba(75, 192, 192, 0.2)" : "transparent",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CSV Chart Viewer</h1>
      <input type="file" onChange={handleFileUpload} accept=".csv" />

      {/* Table Preview */}
      {headers.length > 0 && (
        <TablePreview headers={headers} data={csvData} onFilterChange={handleFilterChange} />
      )}

      {/* Dropdown selectors for X-axis, Y-axis, and Chart Type */}
      {headers.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <label>
            X-Axis:
            <select onChange={(e) => setXAxis(e.target.value)} value={xAxis}>
              <option value="">Select X-Axis</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginLeft: "20px" }}>
            Y-Axis:
            <select onChange={(e) => setYAxis(e.target.value)} value={yAxis}>
              <option value="">Select Y-Axis</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginLeft: "20px" }}>
            Chart Type:
            <select onChange={(e) => setChartType(e.target.value)} value={chartType}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
            </select>
          </label>
        </div>
      )}

      {/* Chart display */}
      {filteredData.length > 0 && xAxis && yAxis && (
        <div style={{ marginTop: "20px" }}>
          {chartType === "line" ? <Line data={getChartData()} /> : <Bar data={getChartData()} />}
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
