import axios from 'axios';

// Default API URL - should be updated to your actual backend API endpoint
const API_URL = 'https://api.example.com/translate'; 

// Mock data for demo purposes
const MOCK_MODE = true;
const MOCK_DELAY = 1000; // simulate network delay in ms

// Accent definitions with voice preferences for text-to-speech
const mockAccentData = {
  'American': {
    id: 'American',
    displayName: 'American English',
    voiceURI: 'Google US English',
    voiceLang: 'en-US'
  },
  'British': {
    id: 'British',
    displayName: 'British English',
    voiceURI: 'Google UK English Female',
    voiceLang: 'en-GB'
  },
  'Australian': {
    id: 'Australian',
    displayName: 'Australian English',
    voiceURI: 'Google UK English Female', // Fallback since most browsers don't have Australian voice
    voiceLang: 'en-AU'
  },
  'Indian': {
    id: 'Indian',
    displayName: 'Indian English',
    voiceURI: 'Hindi India',
    voiceLang: 'en-IN'
  },
  'Spanish': {
    id: 'Spanish',
    displayName: 'Spanish',
    voiceURI: 'Google español',
    voiceLang: 'es-ES'
  },
  'French': {
    id: 'French',
    displayName: 'French',
    voiceURI: 'Google français',
    voiceLang: 'fr-FR'
  },
  'German': {
    id: 'German',
    displayName: 'German',
    voiceURI: 'Google Deutsch',
    voiceLang: 'de-DE'
  }
};

const mockAccents = Object.keys(mockAccentData);

// Tone markers for preserving emotional context
const toneMarkers = {
  excited: ['!', '!!', '!!!'],
  questioning: ['?', '??', '???'],
  emphasis: ['*', '**', '***'],
  pause: [',', ';', '.', '...'],
  volume: {
    loud: ['!', '!!', '!!!'],
    soft: ['...', '...', '...']
  }
};

/**
 * Count occurrences of a substring in a string
 * @param {string} str - The string to search in
 * @param {string} sub - The substring to count
 * @returns {number} - Number of occurrences
 */
const countOccurrences = (str, sub) => {
  return str.split(sub).length - 1;
};

/**
 * Analyze text for tone and emotional context
 * @param {string} text - The text to analyze
 * @returns {Object} - Tone analysis results
 */
const analyzeTone = (text) => {
  const tone = {
    excitement: 0,
    questioning: 0,
    emphasis: 0,
    pauses: 0,
    volume: 'normal'
  };

  // Count punctuation marks
  Object.entries(toneMarkers).forEach(([key, markers]) => {
    if (key === 'volume') {
      Object.entries(markers).forEach(([vol, marks]) => {
        marks.forEach(mark => {
          if (text.includes(mark)) {
            tone.volume = vol;
          }
        });
      });
    } else {
      markers.forEach(mark => {
        // Use countOccurrences instead of RegExp for special characters
        const count = countOccurrences(text, mark);
        tone[key] += count;
      });
    }
  });

  return tone;
};

/**
 * Apply tone to translated text
 * @param {string} text - The text to apply tone to
 * @param {Object} tone - The tone to apply
 * @returns {string} - Text with applied tone
 */
const applyTone = (text, tone) => {
  let result = text;

  // Apply volume markers
  if (tone.volume === 'loud') {
    result += '!!!';
  } else if (tone.volume === 'soft') {
    result += '...';
  }

  // Apply excitement
  if (tone.excitement > 0) {
    result += '!'.repeat(Math.min(tone.excitement, 3));
  }

  // Apply questioning
  if (tone.questioning > 0) {
    result += '?'.repeat(Math.min(tone.questioning, 3));
  }

  // Apply emphasis
  if (tone.emphasis > 0) {
    result = `*${result}*`;
  }

  return result;
};

/**
 * Send text for accent translation
 * @param {string} text - The text to translate
 * @param {string} sourceAccent - The source accent
 * @param {string} targetAccent - The target accent
 * @returns {Promise} - API response with translated text and tone info
 */
export const translateAccent = async (text, sourceAccent, targetAccent) => {
  // Use mock data in demo mode
  if (MOCK_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Analyze original tone
        const originalTone = analyzeTone(text);
        
        // Generate a mock translation with accent-specific markers
        let translatedText = text;
        
        if (targetAccent === 'British') {
          translatedText = text
            .replace(/mom/gi, 'mum')
            .replace(/apartment/gi, 'flat')
            .replace(/elevator/gi, 'lift')
            .replace(/truck/gi, 'lorry')
            .replace(/trash/gi, 'rubbish')
            .replace(/soccer/gi, 'football')
            .replace(/vacation/gi, 'holiday')
            .replace(/fall/gi, 'autumn')
            .replace(/cookie/gi, 'biscuit');
        } else if (targetAccent === 'Australian') {
          translatedText = text
            .replace(/friend/gi, 'mate')
            .replace(/this afternoon/gi, 'this arvo')
            .replace(/breakfast/gi, 'brekkie')
            .replace(/definitely/gi, 'defo')
            .replace(/thank you/gi, 'ta')
            .replace(/good/gi, 'bonza');
        } else if (targetAccent === 'Indian') {
          translatedText = text
            .replace(/isn't it/gi, 'na?')
            .replace(/isn't that right/gi, 'na?')
            .replace(/right/gi, 'na?')
            .replace(/yes/gi, 'haan')
            .replace(/food/gi, 'khana')
            .replace(/hello/gi, 'namaste');
        }
        
        // Apply original tone to translated text
        translatedText = applyTone(translatedText, originalTone);
        
        // Include voice information for speech synthesis
        const accentVoiceInfo = mockAccentData[targetAccent] || mockAccentData['American'];
        
        resolve({ 
          translatedText,
          voiceInfo: accentVoiceInfo,
          toneInfo: originalTone
        });
      }, MOCK_DELAY);
    });
  }
  
  // Real API call implementation
  try {
    const response = await axios.post(`${API_URL}`, {
      text,
      sourceAccent,
      targetAccent
    });
    return response.data;
  } catch (error) {
    console.error('Error translating accent:', error);
    throw error;
  }
};

/**
 * Get list of available accents
 * @returns {Promise} - API response with available accents
 */
export const getAvailableAccents = async () => {
  // Use mock data in demo mode
  if (MOCK_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          accents: mockAccents,
          accentData: mockAccentData
        });
      }, MOCK_DELAY / 2);
    });
  }
  
  // Real API call implementation
  try {
    const response = await axios.get(`${API_URL}/accents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available accents:', error);
    // Return mock data as fallback
    return { 
      accents: mockAccents,
      accentData: mockAccentData
    };
  }
}; 