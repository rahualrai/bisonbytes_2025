'use client';

import { useState, useEffect } from 'react';
import './styles/LoadingScreen.css';

const loadingMessages = [
  "Connecting to health sensors...",
  "Loading patient data...",
  "Analyzing vital signs...",
  "Preparing dashboard..."
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    
    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <svg className="heartbeat-monitor" viewBox="0 0 400 100" preserveAspectRatio="none">
            <polyline 
              className="heartbeat-line"
              points="0,50 30,50 45,50 55,20 65,80 75,50 85,50 95,50 105,50 120,50 130,10 140,90 150,50 160,50 180,50 190,50 200,50 215,50 230,70 240,30 250,50 260,50 280,50 290,50 300,50 310,50 340,50 360,50 400,50"
            />
          </svg>
        </div>
        
        <h1 className="app-title">Guardian</h1>
        
        <div className="circular-progress">
          <svg viewBox="0 0 100 100">
            <circle className="progress-bg" cx="50" cy="50" r="40" />
            <circle 
              className="progress-circle" 
              cx="50" 
              cy="50" 
              r="40" 
              style={{ 
                strokeDashoffset: 251.2 - (251.2 * progress / 100) 
              }} 
            />
            <text x="50" y="55" className="progress-text">{progress}%</text>
          </svg>
        </div>
        
        <p className="loading-message">{loadingMessages[messageIndex]}</p>
        
        <div className="floating-icons">
          <div className="float-icon heart-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="float-icon lung-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6.081 20c2.988 0 2.988-4 2.988-4V9c0-1 .5-1 1-1s1 .5 1 1v7s0 4 2.988 4C16.793 20 17 15 17 15V6c0-1 .5-1 1-1s1 .5 1 1v6c0 1 1 1 1 1s1 0 1-1V7c0-4-3.231-4-4-4-6 0-6 4-6 4v8s-.081 5-3.081 5C7 20 6 19 6 19s-.012-3 0-7c0-1-.833-1.5-1.838-1C2.088 11.5 2 15 2 17c0 3 2.081 3 4.081 3z" />
            </svg>
          </div>
          <div className="float-icon brain-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15.5 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM8.5 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM15.5 22a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM8.5 22a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM8.5 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM15.5 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}