import React, { useState, useEffect, useRef } from 'react';
import { translateAccent } from '../services/translationService';

const TranslationResult = ({ 
  originalText, 
  translatedText, 
  isLoading, 
  error,
  voiceInfo,
  toneInfo
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechSynthRef = useRef(null);
  const speechQueueRef = useRef([]);
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    // Initialize speech synthesis
    speechSynthRef.current = window.speechSynthesis;
    
    // Load available voices
    const loadVoices = () => {
      const voices = speechSynthRef.current.getVoices();
      setAvailableVoices(voices);
    };

    // Load voices when they become available
    if (speechSynthRef.current.getVoices().length === 0) {
      speechSynthRef.current.addEventListener('voiceschanged', loadVoices);
    } else {
      loadVoices();
    }

    // Handle speech synthesis events
    const handleEnd = () => {
      setIsPlaying(false);
      speechQueueRef.current = [];
    };

    speechSynthRef.current.addEventListener('end', handleEnd);
    
    return () => {
      speechSynthRef.current.removeEventListener('end', handleEnd);
      speechSynthRef.current.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Handle speech synthesis when translated text changes
  useEffect(() => {
    if (translatedText && voiceInfo && availableVoices.length > 0) {
      // Stop any ongoing speech
      if (speechSynthRef.current.speaking) {
        speechSynthRef.current.cancel();
      }

      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(translatedText);
      
      // Find the matching voice
      const selectedVoice = availableVoices.find(voice => 
        voice.lang === voiceInfo.voiceLang || 
        voice.name === voiceInfo.voiceURI
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Set language
      utterance.lang = voiceInfo.voiceLang || 'en-US';
      
      // Apply tone-based speech parameters
      if (toneInfo) {
        // Adjust rate for excitement
        if (toneInfo.excitement > 0) {
          utterance.rate = 1.2;
        }
        
        // Adjust pitch for questioning
        if (toneInfo.questioning > 0) {
          utterance.pitch = 1.2;
        }
        
        // Adjust volume for loud/soft markers
        if (toneInfo.volume === 'loud') {
          utterance.volume = 1.2;
        } else if (toneInfo.volume === 'soft') {
          utterance.volume = 0.8;
        }
      }

      // Add to queue and start speaking
      speechQueueRef.current = [utterance];
      speechSynthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  }, [translatedText, voiceInfo, toneInfo, availableVoices]);

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
    }
  };

  return (
    <div className="translation-result">
      {isLoading ? (
        <div className="loading">Translating...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {originalText && (
            <div className="original-text">
              <h3>Original Text:</h3>
              <p>{originalText}</p>
            </div>
          )}
          {translatedText && (
            <div className="translated-text">
              <h3>Translated Text:</h3>
              <p>{translatedText}</p>
              <div className="actions">
                <button 
                  onClick={handleCopy}
                  className="copy-button"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TranslationResult; 