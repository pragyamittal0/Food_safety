// PowerBIReport.jsx
import React from 'react';

export default function PowerBIReport({ onClose }) {
  return (
    <div className="report-container">
      <button className="close-button" onClick={onClose}>✖ Close Report</button>
      <iframe
        title="Power BI Report"
        width="100%"
        height="600"
        src="https://app.powerbi.com/reportEmbed?reportId=3576a470-aeb2-48eb-aec2-b84c597198e4&autoAuth=true&ctid=68f381e3-46da-47b9-ba57-6f322b8f0da1"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}
