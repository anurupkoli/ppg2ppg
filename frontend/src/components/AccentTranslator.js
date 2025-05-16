import React, { useState } from 'react';
import AccentSelector from './AccentSelector';
import TranslationResult from './TranslationResult';
import SpeechRecognition from './SpeechRecognition';
import { translateAccent } from '../services/translationService';
import './AccentTranslator.css';

const AccentTranslator = () => {
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [accents, setAccents] = useState({ sourceAccent: '', targetAccent: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voiceInfo, setVoiceInfo] = useState(null);
  const [toneInfo, setToneInfo] = useState(null);

  const handleAccentsSelected = (selectedAccents) => {
    setAccents(selectedAccents);
  };

  const handleTranscriptChange = (transcript) => {
    setOriginalText(transcript);
  };

  const handleTranslate = async () => {
    if (!originalText || !accents.sourceAccent || !accents.targetAccent) {
      setError('Please provide text input and select accents');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await translateAccent(
        originalText,
        accents.sourceAccent,
        accents.targetAccent
      );
      setTranslatedText(result.translatedText || 'No translation returned');
      
      if (result.voiceInfo) {
        setVoiceInfo(result.voiceInfo);
      }
      
      if (result.toneInfo) {
        setToneInfo(result.toneInfo);
      }
    } catch (err) {
      setError('Failed to translate accent. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setOriginalText('');
    setTranslatedText('');
    setError(null);
    setVoiceInfo(null);
    setToneInfo(null);
  };

  return (
    <div className="accent-translator">
      <h1>Accent Translator</h1>
      
      <div className="translator-section">
        <h2>1. Select Accents</h2>
        <AccentSelector onAccentsSelected={handleAccentsSelected} />
      </div>
      
      <div className="translator-section">
        <h2>2. Speak or Type</h2>
        <SpeechRecognition onTranscriptChange={handleTranscriptChange} />
        
        <div className="text-input">
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Or type your text here..."
            rows={4}
          />
        </div>
      </div>
      
      <div className="translator-actions">
        <button 
          onClick={handleTranslate}
          className="translate-button"
          disabled={isLoading || !originalText || !accents.sourceAccent || !accents.targetAccent}
        >
          {isLoading ? 'Translating...' : 'Translate Accent'}
        </button>
        <button 
          onClick={handleClearAll}
          className="clear-button"
        >
          Clear All
        </button>
      </div>
      
      <div className="translator-section">
        <h2>3. Translation Results</h2>
        <TranslationResult
          originalText={originalText}
          translatedText={translatedText}
          isLoading={isLoading}
          error={error}
          voiceInfo={voiceInfo}
          toneInfo={toneInfo}
        />
      </div>
    </div>
  );
};

export default AccentTranslator; 