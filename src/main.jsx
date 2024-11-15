import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    const errorLog = {
        error: event.reason.toString(),
        timestamp: new Date().toISOString(),
    };
    localStorage.setItem("errorLog", JSON.stringify(errorLog));
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
