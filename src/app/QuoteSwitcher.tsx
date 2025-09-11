'use client';

import React, { useState, useEffect } from 'react';

interface QuoteSwitcherProps {
  quotes: string[];
  interval?: number; // Interval in milliseconds, defaults to 5000ms
}

const QuoteSwitcher: React.FC<QuoteSwitcherProps> = ({ quotes, interval = 5000 }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
    }, interval);

    return () => clearInterval(timer);
  }, [quotes, interval]);

  return (
    <div style={{
      textAlign: 'center',
      padding: '10px',
      fontSize: '20px',
      color: 'white',
      background: '#ff897d',
      borderRadius: '8px',
      margin: '20px auto',
      maxWidth: '400px',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      <p>{quotes[currentQuoteIndex]}</p>
    </div>
  );
};

export default QuoteSwitcher;
