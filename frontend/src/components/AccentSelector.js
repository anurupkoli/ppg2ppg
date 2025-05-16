import React, { useState, useEffect } from 'react';
import { getAvailableAccents } from '../services/translationService';

const AccentSelector = ({ onAccentsSelected }) => {
  const [accents, setAccents] = useState([]);
  const [sourceAccent, setSourceAccent] = useState('');
  const [targetAccent, setTargetAccent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccents = async () => {
      try {
        setIsLoading(true);
        const data = await getAvailableAccents();
        setAccents(data.accents || []);
        
        // Set defaults if available
        if (data.accents && data.accents.length > 0) {
          setSourceAccent(data.accents[0]);
          setTargetAccent(data.accents.length > 1 ? data.accents[1] : data.accents[0]);
        }
        
      } catch (err) {
        setError('Failed to load available accents');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccents();
  }, []);

  useEffect(() => {
    if (sourceAccent && targetAccent) {
      onAccentsSelected({ sourceAccent, targetAccent });
    }
  }, [sourceAccent, targetAccent, onAccentsSelected]);

  const handleSourceAccentChange = (e) => {
    setSourceAccent(e.target.value);
  };

  const handleTargetAccentChange = (e) => {
    setTargetAccent(e.target.value);
  };

  if (isLoading) {
    return <div>Loading available accents...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="accent-selector">
      <div className="selector-group">
        <label htmlFor="source-accent">Source Accent:</label>
        <select
          id="source-accent"
          value={sourceAccent}
          onChange={handleSourceAccentChange}
        >
          {accents.map((accent) => (
            <option key={`source-${accent}`} value={accent}>
              {accent}
            </option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <label htmlFor="target-accent">Target Accent:</label>
        <select
          id="target-accent"
          value={targetAccent}
          onChange={handleTargetAccentChange}
        >
          {accents.map((accent) => (
            <option key={`target-${accent}`} value={accent}>
              {accent}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AccentSelector; 