import React, { useState, useRef, useEffect } from 'react';
import './App.css';

export default function App() {
  const [currentMode, setCurrentMode] = useState('home');
  const [level, setLevel] = useState('intermediate');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vocabularyList, setVocabularyList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const levels = {
    beginner: 'Pemula (A1-A2)',
    intermediate: 'Menengah (B1-B2)',
    advanced: 'Mahir (C1-C2)'
  };

  const vocabularyLessons = {
    beginner: [
      { word: 'Hello', meaning: 'Halo', example: 'Hello, how are you?' },
      { word: 'Beautiful', meaning: 'Indah', example: 'The sunset is beautiful.' },
      { word: 'Breakfast', meaning: 'Sarapan', example: 'I eat breakfast at 7am.' },
      { word: 'Friend', meaning: 'Teman', example: 'She is my best friend.' },
      { word: 'Coffee', meaning: 'Kopi', example: 'I drink coffee every morning.' }
    ],
    intermediate: [
      { word: 'Eloquent', meaning: 'Fasih/Lancar berbicara', example: 'The eloquent speaker impressed everyone.' },
      { word: 'Persevere', meaning: 'Bertahan/Bersikun', example: 'We must persevere through difficulties.' },
      { word: 'Profound', meaning: 'Mendalam', example: 'That was a profound observation.' },
      { word: 'Meticulous', meaning: 'Teliti/Rapi', example: 'He is meticulous about his work.' },
      { word: 'Ephemeral', meaning: 'Sementara', example: 'Beauty is ephemeral.' }
    ],
    advanced: [
      { word: 'Obfuscate', meaning: 'Membuat bingung/mengkaburkan', example: 'Do not obfuscate the truth.' },
      { word: 'Perspicacious', meaning: 'Memiliki pandangan tajam', example: 'Her perspicacious analysis was remarkable.' },
      { word: 'Mellifluous', meaning: 'Merdu/menyenangkan didengar', example: 'The mellifluous voice enchanted the audience.' },
      { word: 'Sanguine', meaning: 'Optimis/cerah', example: 'Despite challenges, she remained sanguine.' },
      { word: 'Pellucid', meaning: 'Jelas/transparan', example: 'The pellucid explanation helped everyone understand.' }
    ]
  };

  const quizzes = {
    beginner: [
      { question: 'What is the past tense of "go"?', options: ['Gone', 'Went', 'Going', 'Goes'], correct: 1 },
      { question: 'Choose the correct sentence:', options: ['She go to school', 'She goes to school', 'She going to school', 'She gone to school'], correct: 1 },
      { question: 'What does "Happy" mean?', options: ['Sedih', 'Bahagia', 'Marah', 'Lelah'], correct: 1 },
      { question: 'I _____ coffee every morning.', options: ['Drinks', 'Drink', 'Drinking', 'Drunk'], correct: 1 },
      { question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childes', 'Childers'], correct: 1 }
    ],
    intermediate: [
      { question: 'Which sentence uses the present perfect correctly?', options: ['I have went there', 'I have gone there', 'I have go there', 'I gone there'], correct: 1 },
      { question: 'What does "Eloquent" mean?', options: ['Pemalu', 'Fasih berbicara', 'Pendek', 'Kurus'], correct: 1 },
      { question: 'If I had known, I _____ earlier.', options: ['Would come', 'Would have come', 'Will come', 'Have come'], correct: 1 },
      { question: 'The synonym of "Persevere" is:', options: ['Give up', 'Persist', 'Quit', 'Avoid'], correct: 1 },
      { question: 'Which is grammatically correct?', options: ['Despite of the rain', 'Despite the rain', 'Although the rain', 'Though of the rain'], correct: 1 }
    ],
    advanced: [
      { question: 'The author\'s obfuscation of the plot was:', options: ['Brilliant', 'Detrimental', 'Enlightening', 'Simplistic'], correct: 1 },
      { question: 'Her perspicacious observations _____ the fundamental issues.', options: ['Obscured', 'Illuminated', 'Confused', 'Complicated'], correct: 1 },
      { question: 'What is the meaning of "Pellucid"?', options: ['Opaque', 'Clear and transparent', 'Confusing', 'Dark'], correct: 1 },
      { question: 'The mellifluous tone of his voice was:', options: ['Harsh', 'Grating', 'Pleasing to the ear', 'Monotonous'], correct: 1 },
      { question: 'Despite setbacks, she maintained a _____ outlook.', options: ['Pessimistic', 'Sanguine', 'Cynical', 'Gloomy'], correct: 1 }
    ]
  };

  const handleChat = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are an enthusiastic English teacher. The student is at ${levels[level]} level. ${
                currentMode === 'conversation'
                  ? 'Help them practice English conversation. Correct their mistakes gently and ask follow-up questions.'
                  : 'Help them improve their English. Answer their questions and give explanations.'
              }\n\nStudent message: ${input}`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error. Please check your internet connection.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadVocabulary = () => {
    setVocabularyList(vocabularyLessons[level]);
    setCurrentMode('vocabulary');
  };

  const startQuiz = () => {
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setShowResults(false);
    setCurrentMode('quiz');
  };

  const handleQuizAnswer = (selectedIndex) => {
    const currentQuiz = quizzes[level];
    if (selectedIndex === currentQuiz[currentQuizIndex].correct) {
      setQuizScore(quizScore + 1);
    }

    if (currentQuizIndex + 1 < currentQuiz.length) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  // Home Page
  if (currentMode === 'home') {
    return (
      <div className="container home-container">
        <div className="header-home">
          <h1 className="header-title">🌍 English Master</h1>
          <p className="header-subtitle">Belajar bahasa Inggris dengan cara yang menyenangkan!</p>
        </div>

        <div className="section">
          <h2 className="section-title">Pilih Level Anda</h2>
          <div className="level-buttons">
            {Object.entries(levels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLevel(key)}
                className={`level-btn ${level === key ? 'active' : ''}`}
              >
                <div className="level-label">{label}</div>
                <div className="level-desc">
                  {key === 'beginner' && 'Pemula dalam bahasa Inggris'}
                  {key === 'intermediate' && 'Sudah punya dasar yang kuat'}
                  {key === 'advanced' && 'Ingin menguasai sepenuhnya'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={() => { setMessages([]); setCurrentMode('conversation'); }}
            className="btn btn-primary"
          >
            💬 Chat dengan Guru
          </button>
          <button
            onClick={loadVocabulary}
            className="btn btn-secondary"
          >
            📚 Pelajari Vocabulary
          </button>
          <button
            onClick={startQuiz}
            className="btn btn-tertiary"
          >
            🧠 Ikuti Quiz
          </button>
          <button
            onClick={() => { setMessages([]); setCurrentMode('grammar'); }}
            className="btn btn-quaternary"
          >
            ⚡ Pelajari Grammar
          </button>
        </div>
      </div>
    );
  }

  // Chat Mode
  if (currentMode === 'conversation' || currentMode === 'grammar') {
    return (
      <div className="container chat-container">
        <div className="chat-header">
          <button onClick={() => setCurrentMode('home')} className="back-btn">← Kembali</button>
          <div>
            <h1>{currentMode === 'conversation' ? '💬 Conversation Practice' : '📚 Grammar Lesson'}</h1>
            <p>Level: {levels[level]}</p>
          </div>
        </div>

        <div className="chat-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-emoji">{currentMode === 'conversation' ? '💬' : '📖'}</div>
              <p>
                {currentMode === 'conversation'
                  ? 'Mulai percakapan dengan guru AI Anda!'
                  : 'Tanyakan tentang grammar kepada guru AI Anda!'}
              </p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && <div className="loading">Guru sedang mengetik...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Ketik pesan Anda..."
            className="message-input"
          />
          <button onClick={handleChat} disabled={loading || !input.trim()} className="send-btn">
            Kirim
          </button>
        </div>
      </div>
    );
  }

  // Vocabulary Mode
  if (currentMode === 'vocabulary') {
    return (
      <div className="container vocab-container">
        <button onClick={() => setCurrentMode('home')} className="back-btn">← Kembali</button>
        <h1>📚 Vocabulary Lesson</h1>
        <p className="level-info">Level: {levels[level]}</p>

        <div className="vocab-grid">
          {vocabularyList.map((vocab, idx) => (
            <div key={idx} className="vocab-card">
              <div className="vocab-index">{idx + 1}</div>
              <h3 className="vocab-word">{vocab.word}</h3>
              <p className="vocab-meaning">Arti: <strong>{vocab.meaning}</strong></p>
              <p className="vocab-example">🎯 {vocab.example}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setMessages([]); setCurrentMode('conversation'); }}
          className="btn btn-primary"
        >
          Latih dengan Guru AI
        </button>
      </div>
    );
  }

  // Quiz Mode
  if (currentMode === 'quiz') {
    const currentQuiz = quizzes[level];

    if (showResults) {
      const percentage = Math.round((quizScore / currentQuiz.length) * 100);
      return (
        <div className="container result-container">
          <div className="result-content">
            <div className="result-emoji">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </div>
            <h1>Quiz Selesai!</h1>
            <div className="result-score">{quizScore}/{currentQuiz.length}</div>
            <p className="result-percentage">{percentage}%</p>

            <div className="result-stats">
              <div className="stat">
                <p className="stat-label">Benar</p>
                <p className="stat-value">{quizScore}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Salah</p>
                <p className="stat-value">{currentQuiz.length - quizScore}</p>
              </div>
            </div>

            <button onClick={() => setCurrentMode('home')} className="btn btn-primary">
              Kembali ke Home
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="container quiz-container">
        <div className="quiz-header">
          <button onClick={() => setCurrentMode('home')} className="back-btn">← Kembali</button>
          <p>Soal {currentQuizIndex + 1} dari {currentQuiz.length}</p>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${((currentQuizIndex + 1) / currentQuiz.length) * 100}%` }}></div>
        </div>

        <div className="quiz-content">
          <h2 className="question">{currentQuiz[currentQuizIndex].question}</h2>

          <div className="options">
            {currentQuiz[currentQuizIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(idx)}
                className="option-btn"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
