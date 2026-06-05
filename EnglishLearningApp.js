import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EnglishLearningApp = () => {
  const [currentMode, setCurrentMode] = useState('home');
  const [level, setLevel] = useState('intermediate');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vocabularyList, setVocabularyList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const scrollViewRef = useRef(null);

  const levels = {
    beginner: 'Pemula (A1-A2)',
    intermediate: 'Menengah (B1-B2)',
    advanced: 'Mahir (C1-C2)',
  };

  const vocabularyLessons = {
    beginner: [
      { word: 'Hello', meaning: 'Halo', example: 'Hello, how are you?' },
      { word: 'Beautiful', meaning: 'Indah', example: 'The sunset is beautiful.' },
      { word: 'Breakfast', meaning: 'Sarapan', example: 'I eat breakfast at 7am.' },
      { word: 'Friend', meaning: 'Teman', example: 'She is my best friend.' },
      { word: 'Coffee', meaning: 'Kopi', example: 'I drink coffee every morning.' },
    ],
    intermediate: [
      { word: 'Eloquent', meaning: 'Fasih/Lancar berbicara', example: 'The eloquent speaker impressed everyone.' },
      { word: 'Persevere', meaning: 'Bertahan/Bersikun', example: 'We must persevere through difficulties.' },
      { word: 'Profound', meaning: 'Mendalam', example: 'That was a profound observation.' },
      { word: 'Meticulous', meaning: 'Teliti/Rapi', example: 'He is meticulous about his work.' },
      { word: 'Ephemeral', meaning: 'Sementara', example: 'Beauty is ephemeral.' },
    ],
    advanced: [
      { word: 'Obfuscate', meaning: 'Membuat bingung/mengkaburkan', example: 'Do not obfuscate the truth.' },
      { word: 'Perspicacious', meaning: 'Memiliki pandangan tajam', example: 'Her perspicacious analysis was remarkable.' },
      { word: 'Mellifluous', meaning: 'Merdu/menyenangkan didengar', example: 'The mellifluous voice enchanted the audience.' },
      { word: 'Sanguine', meaning: 'Optimis/cerah', example: 'Despite challenges, she remained sanguine.' },
      { word: 'Pellucid', meaning: 'Jelas/transparan', example: 'The pellucid explanation helped everyone understand.' },
    ],
  };

  const quizzes = {
    beginner: [
      { question: 'What is the past tense of "go"?', options: ['Gone', 'Went', 'Going', 'Goes'], correct: 1 },
      { question: 'Choose the correct sentence:', options: ['She go to school', 'She goes to school', 'She going to school', 'She gone to school'], correct: 1 },
      { question: 'What does "Happy" mean?', options: ['Sedih', 'Bahagia', 'Marah', 'Lelah'], correct: 1 },
      { question: 'I _____ coffee every morning.', options: ['Drinks', 'Drink', 'Drinking', 'Drunk'], correct: 1 },
      { question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childes', 'Childers'], correct: 1 },
    ],
    intermediate: [
      { question: 'Which sentence uses the present perfect correctly?', options: ['I have went there', 'I have gone there', 'I have go there', 'I gone there'], correct: 1 },
      { question: 'What does "Eloquent" mean?', options: ['Pemalu', 'Fasih berbicara', 'Pendek', 'Kurus'], correct: 1 },
      { question: 'If I had known, I _____ earlier.', options: ['Would come', 'Would have come', 'Will come', 'Have come'], correct: 1 },
      { question: 'The synonym of "Persevere" is:', options: ['Give up', 'Persist', 'Quit', 'Avoid'], correct: 1 },
      { question: 'Which is grammatically correct?', options: ['Despite of the rain', 'Despite the rain', 'Although the rain', 'Though of the rain'], correct: 1 },
    ],
    advanced: [
      { question: 'The author\'s obfuscation of the plot was:', options: ['Brilliant', 'Detrimental', 'Enlightening', 'Simplistic'], correct: 1 },
      { question: 'Her perspicacious observations _____ the fundamental issues.', options: ['Obscured', 'Illuminated', 'Confused', 'Complicated'], correct: 1 },
      { question: 'What is the meaning of "Pellucid"?', options: ['Opaque', 'Clear and transparent', 'Confusing', 'Dark'], correct: 1 },
      { question: 'The mellifluous tone of his voice was:', options: ['Harsh', 'Grating', 'Pleasing to the ear', 'Monotonous'], correct: 1 },
      { question: 'Despite setbacks, she maintained a _____ outlook.', options: ['Pessimistic', 'Sanguine', 'Cynical', 'Gloomy'], correct: 1 },
    ],
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
              }\n\nStudent message: ${input}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error. Please try again. Make sure you have an internet connection.',
        },
      ]);
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

  // Home Screen
  if (currentMode === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.homeScroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerHome}>
            <Text style={styles.headerTitleHome}>🌍 English Master</Text>
            <Text style={styles.headerSubtitleHome}>
              Belajar bahasa Inggris dengan cara yang menyenangkan!
            </Text>
          </View>

          {/* Level Selection */}
          <View style={styles.sectionHome}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="brain" size={24} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Pilih Level Anda</Text>
            </View>

            {Object.entries(levels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setLevel(key)}
                style={[
                  styles.levelButton,
                  level === key && styles.levelButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    level === key && styles.levelButtonTextActive,
                  ]}
                >
                  {label}
                </Text>
                <Text
                  style={[
                    styles.levelButtonDesc,
                    level === key && styles.levelButtonDescActive,
                  ]}
                >
                  {key === 'beginner' && 'Pemula dalam bahasa Inggris'}
                  {key === 'intermediate' && 'Sudah punya dasar yang kuat'}
                  {key === 'advanced' && 'Ingin menguasai sepenuhnya'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feature Cards */}
          <View style={styles.featuresContainer}>
            {[
              { icon: 'chatbubbles', title: 'Chat Guru', desc: 'Berdiskusi dengan guru AI' },
              { icon: 'flash', title: 'Latihan', desc: 'Conversation practice' },
              { icon: 'book', title: 'Vocabulary', desc: 'Pelajari kata-kata baru' },
              { icon: 'school', title: 'Quiz', desc: 'Tes pemahaman Anda' },
            ].map((feature, i) => (
              <View key={i} style={styles.featureCard}>
                <Ionicons name={feature.icon} size={32} color="#4F46E5" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setMessages([]);
                setCurrentMode('conversation');
              }}
              style={[styles.actionButton, styles.buttonBlue]}
            >
              <Ionicons name="chatbubbles" size={20} color="white" />
              <Text style={styles.actionButtonText}>Chat dengan Guru</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={loadVocabulary}
              style={[styles.actionButton, styles.buttonPurple]}
            >
              <Ionicons name="book" size={20} color="white" />
              <Text style={styles.actionButtonText}>Pelajari Vocabulary</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={startQuiz}
              style={[styles.actionButton, styles.buttonOrange]}
            >
              <Ionicons name="school" size={20} color="white" />
              <Text style={styles.actionButtonText}>Ikuti Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMessages([]);
                setCurrentMode('grammar');
              }}
              style={[styles.actionButton, styles.buttonGreen]}
            >
              <Ionicons name="flash" size={20} color="white" />
              <Text style={styles.actionButtonText}>Pelajari Grammar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Chat Screen
  if (currentMode === 'conversation' || currentMode === 'grammar') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderContent}>
            <TouchableOpacity
              onPress={() => setCurrentMode('home')}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.chatHeaderText}>
              <Text style={styles.chatHeaderTitle}>
                {currentMode === 'conversation' ? '💬 Conversation' : '📚 Grammar'}
              </Text>
              <Text style={styles.chatHeaderSubtitle}>Level: {levels[level]}</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>
                {currentMode === 'conversation' ? '💬' : '📖'}
              </Text>
              <Text style={styles.emptyStateText}>
                {currentMode === 'conversation'
                  ? 'Mulai percakapan dengan guru AI Anda!'
                  : 'Tanyakan tentang grammar kepada guru AI Anda!'}
              </Text>
            </View>
          ) : (
            messages.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.messageContainer,
                  msg.role === 'user' && styles.userMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.role === 'user'
                      ? styles.userMessageBubble
                      : styles.assistantMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.role === 'user' && styles.userMessageText,
                    ]}
                  >
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))
          )}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4F46E5" />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ketik pesan Anda..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleChat}
              editable={!loading}
              multiline
              maxHeight={100}
            />
            <TouchableOpacity
              onPress={handleChat}
              disabled={loading || !input.trim()}
              style={[
                styles.sendButton,
                (loading || !input.trim()) && styles.sendButtonDisabled,
              ]}
            >
              <Ionicons
                name="send"
                size={20}
                color={loading || !input.trim() ? '#999' : 'white'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Vocabulary Screen
  if (currentMode === 'vocabulary') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.vocabularyHeader}>
          <TouchableOpacity
            onPress={() => setCurrentMode('home')}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.vocabularyHeaderTitle}>📚 Vocabulary Lesson</Text>
            <Text style={styles.vocabularyHeaderSubtitle}>
              Level: {levels[level]}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.vocabularyScroll}>
          {vocabularyList.map((vocab, idx) => (
            <View key={idx} style={styles.vocabCard}>
              <View style={styles.vocabIndex}>
                <Text style={styles.vocabIndexText}>{idx + 1}</Text>
              </View>
              <Text style={styles.vocabWord}>{vocab.word}</Text>
              <View style={styles.vocabMeaning}>
                <Text style={styles.vocabMeaningLabel}>Arti:</Text>
                <Text style={styles.vocabMeaningText}>{vocab.meaning}</Text>
              </View>
              <View style={styles.vocabExample}>
                <Text style={styles.vocabExampleText}>🎯 {vocab.example}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {
              setMessages([]);
              setCurrentMode('conversation');
            }}
            style={styles.practiceButton}
          >
            <Text style={styles.practiceButtonText}>Latih dengan Guru AI</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Quiz Screen
  if (currentMode === 'quiz') {
    const currentQuiz = quizzes[level];

    if (showResults) {
      const percentage = Math.round((quizScore / currentQuiz.length) * 100);
      return (
        <SafeAreaView style={[styles.container, styles.resultContainer]}>
          <View style={styles.resultContent}>
            <Text style={styles.resultEmoji}>
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </Text>
            <Text style={styles.resultTitle}>Quiz Selesai!</Text>
            <Text style={styles.resultScore}>
              {quizScore}/{currentQuiz.length}
            </Text>
            <Text style={styles.resultPercentage}>{percentage}%</Text>

            <View style={styles.resultStatsContainer}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Benar</Text>
                <Text style={styles.resultStatValue}>{quizScore}</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Salah</Text>
                <Text style={styles.resultStatValue}>
                  {currentQuiz.length - quizScore}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setCurrentMode('home')}
              style={styles.resultButton}
            >
              <Text style={styles.resultButtonText}>Kembali ke Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.quizHeader}>
          <TouchableOpacity
            onPress={() => setCurrentMode('home')}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.quizProgress}>
            <Text style={styles.quizProgressText}>
              Soal {currentQuizIndex + 1} dari {currentQuiz.length}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 4,
            backgroundColor: '#e5e7eb',
            width: width,
          }}
        >
          <View
            style={{
              height: 4,
              backgroundColor: '#f97316',
              width: (width * (currentQuizIndex + 1)) / currentQuiz.length,
            }}
          />
        </View>

        <ScrollView style={styles.quizContent}>
          <View style={styles.questionContainer}>
            <Text style={styles.question}>
              {currentQuiz[currentQuizIndex].question}
            </Text>

            {currentQuiz[currentQuizIndex].options.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleQuizAnswer(idx)}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  homeScroll: {
    flex: 1,
  },
  headerHome: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  headerTitleHome: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  headerSubtitleHome: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  sectionHome: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 10,
  },
  levelButton: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#cbd5e1',
  },
  levelButtonActive: {
    backgroundColor: '#4F46E5',
    borderLeftColor: '#4F46E5',
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  levelButtonTextActive: {
    color: 'white',
  },
  levelButtonDesc: {
    fontSize: 13,
    color: '#64748b',
  },
  levelButtonDescActive: {
    color: '#e0e7ff',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 10,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748b',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonBlue: {
    backgroundColor: '#2563eb',
  },
  buttonPurple: {
    backgroundColor: '#9333ea',
  },
  buttonOrange: {
    backgroundColor: '#ea580c',
  },
  buttonGreen: {
    backgroundColor: '#16a34a',
  },
  // Chat Styles
  chatHeader: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: '#e0e7ff',
    marginTop: 2,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  assistantMessageBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 0,
  },
  userMessageBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 0,
  },
  messageText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  // Vocabulary Styles
  vocabularyHeader: {
    backgroundColor: '#9333ea',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  vocabularyHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  vocabularyHeaderSubtitle: {
    fontSize: 13,
    color: '#e9d5ff',
    marginLeft: 12,
  },
  vocabularyScroll: {
    flex: 1,
    padding: 16,
  },
  vocabCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vocabIndex: {
    backgroundColor: '#9333ea',
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  vocabIndexText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  vocabWord: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  vocabMeaning: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  vocabMeaningLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginRight: 8,
  },
  vocabMeaningText: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600',
  },
  vocabExample: {
    backgroundColor: '#f3e8ff',
    padding: 12,
    borderRadius: 8,
  },
  vocabExampleText: {
    fontSize: 13,
    color: '#4c1d95',
    fontStyle: 'italic',
  },
  practiceButton: {
    backgroundColor: '#9333ea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  practiceButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Quiz Styles
  quizHeader: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizProgress: {
    flex: 1,
    marginLeft: 12,
  },
  quizProgressText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quizContent: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
    lineHeight: 26,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  // Result Styles
  resultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  resultEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  resultScore: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#ea580c',
    marginBottom: 8,
  },
  resultPercentage: {
    fontSize: 20,
    color: '#64748b',
    marginBottom: 24,
  },
  resultStatsContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  resultStat: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultStatLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  resultStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  resultButton: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
  },
  resultButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EnglishLearningApp;
