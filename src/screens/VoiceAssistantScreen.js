import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
  Keyboard,
  PanResponder,
  Vibration,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { BlurView } from 'expo-blur';
import { FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mock data for initial messages and market rates
const initialMessages = [
  {
    id: '1',
    text: 'नमस्कार किसान मित्र! मैं आपका कृषि सहायक हूं। आप मंडी भाव, फसल की जानकारी और अन्य कृषि सम्बंधित प्रश्न पूछ सकते हैं। आपकी कैसे मदद कर सकता हूँ?',
    isUser: false,
    timestamp: new Date().toISOString(),
  },
];

const mockMarketData = {
  'गेहूं': { min: '2,580', max: '2,750', trend: 'up' },
  'चावल': { min: '3,200', max: '3,450', trend: 'down' },
  'बाजरा': { min: '1,980', max: '2,100', trend: 'stable' },
  'मक्का': { min: '1,850', max: '1,950', trend: 'up' },
  'सोयाबीन': { min: '4,200', max: '4,380', trend: 'up' },
};

// Character typing speed (ms)
const TYPING_SPEED = 30;

export const VoiceAssistantScreen = ({ navigation }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [conversationId, setConversationId] = useState(Date.now().toString());
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(TYPING_SPEED);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [responseBoxScale] = useState(new Animated.Value(1));
  const responseTextColorAnim = useRef(new Animated.Value(0)).current;
  const [voiceAmplitude, setVoiceAmplitude] = useState([0, 0, 0, 0, 0]);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const voiceWaveAnim = useRef(new Animated.Value(0)).current;
  const recordingTimeoutRef = useRef(null);
  const voiceAmplitudeIntervalRef = useRef(null);
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [activeCrop, setActiveCrop] = useState(null);
  const priceChartAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [lastMessageIndex, setLastMessageIndex] = useState(null);
  const [inputHeight, setInputHeight] = useState(44);
  const [isFocused, setIsFocused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(null);
  
  const dotOpacity = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const micPulseAnim = useRef(new Animated.Value(1)).current;
  const typingDotsAnim = useRef(new Animated.Value(0)).current;

  // Add cursor animation value and its effect at the component top-level
  const cursorAnim = useRef(new Animated.Value(0)).current;

  const [ambientBubblesVisible, setAmbientBubblesVisible] = useState(true);
  const [backgroundDots, setBackgroundDots] = useState([]);
  const [longPressActivated, setLongPressActivated] = useState(false);
  const bubblePositions = useRef(Array(5).fill().map(() => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * height / 3),
    scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    opacity: new Animated.Value(Math.random() * 0.3 + 0.1),
  }))).current;

  // Create panResponder for enhanced input interaction
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 2) {
          // Two finger press - start new conversation
          Vibration.vibrate(100);
          handleNewConversation();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // Long press detection
        if (gestureState.dx < 5 && gestureState.dy < 5 && !isRecording) {
          // Start recording on long press
          if (!longPressActivated && evt.nativeEvent.touches.length === 1) {
            setTimeout(() => {
              setLongPressActivated(true);
              Vibration.vibrate(50);
              handleVoiceInput();
            }, 500);
          }
        } else {
          setLongPressActivated(false);
        }
      },
      onPanResponderRelease: () => {
        if (longPressActivated && isRecording) {
          // Stop recording when touch is released
          handleVoiceInput();
          setLongPressActivated(false);
        }
      },
    })
  ).current;

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    );
    if (isTyping) {
      blinkAnimation.start();
    } else {
      blinkAnimation.stop();
      cursorAnim.setValue(0);
    }
    return () => {
      blinkAnimation.stop();
    };
  }, [isTyping]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  // Load chat history when the component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        // Get the list of conversation IDs
        const conversationList = await AsyncStorage.getItem('chat_conversations');
        const conversations = conversationList ? JSON.parse(conversationList) : [];
        
        if (conversations.length > 0) {
          // Use the most recent conversation ID
          const latestConversationId = conversations[conversations.length - 1];
          setConversationId(latestConversationId);
          
          // Load messages for this conversation
          const savedMessages = await AsyncStorage.getItem(`chat_${latestConversationId}`);
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
          }
        } else {
          // Start a new conversation
          const newId = Date.now().toString();
          setConversationId(newId);
          await saveConversationId(newId);
          // Save initial message
          await saveMessages(initialMessages);
        }
        
        setHasLoadedHistory(true);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setHasLoadedHistory(true);
      }
    };

    loadChatHistory();
  }, []);

  // Save conversation ID to the list
  const saveConversationId = async (id) => {
    try {
      // Get existing conversation list
      const conversationList = await AsyncStorage.getItem('chat_conversations');
      const conversations = conversationList ? JSON.parse(conversationList) : [];
      
      // Add the new conversation ID if it doesn't exist
      if (!conversations.includes(id)) {
        conversations.push(id);
        // Keep only the last 5 conversations
        const recentConversations = conversations.slice(-5);
        await AsyncStorage.setItem('chat_conversations', JSON.stringify(recentConversations));
      }
    } catch (error) {
      console.error('Error saving conversation ID:', error);
    }
  };

  // Save messages to AsyncStorage
  const saveMessages = async (messageList) => {
    try {
      await AsyncStorage.setItem(`chat_${conversationId}`, JSON.stringify(messageList));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  // Start a new conversation
  const handleNewConversation = async () => {
    const newId = Date.now().toString();
    setConversationId(newId);
    setMessages(initialMessages);
    setSuggestions(initialSuggestions);
    setShowSuggestions(true);
    await saveConversationId(newId);
    await saveMessages(initialMessages);
  };

  // Update the useEffect for typing animation
  useEffect(() => {
    if (typingMessage && isTyping) {
      if (typingIndex < typingMessage.length) {
        // Clear any existing timer
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
        }
        
        // Randomize typing speed to make it more natural
        const nextCharSpeed = Math.random() > 0.7 
          ? typingSpeed * (Math.random() * 2 + 1) 
          : typingSpeed;
        
        // Set a timer to add the next character
        typingTimerRef.current = setTimeout(() => {
          setCurrentTypingText(typingMessage.substring(0, typingIndex + 1));
          setTypingIndex(typingIndex + 1);
          
          // Pulse animation for each character typed
          Animated.sequence([
            Animated.timing(responseBoxScale, {
              toValue: 1.01,
              duration: 50,
              useNativeDriver: true
            }),
            Animated.timing(responseBoxScale, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true
            })
          ]).start();
          
        }, nextCharSpeed);
        
        return () => {
          if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
          }
        };
      } else {
        // Typing complete, add the message to the list
        const botMessage = {
          id: Date.now().toString(),
          text: typingMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        
        // Highlight the important words in message
        Animated.timing(responseTextColorAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false
        }).start();
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setTypingMessage('');
        setCurrentTypingText('');
        setTypingIndex(0);
        
        // Save messages to history
        saveMessages([...messages, botMessage]);
        
        // Final scroll after message is added
        if (listRef.current) {
          setTimeout(() => {
            listRef.current.scrollToOffset({
              offset: Number.MAX_SAFE_INTEGER,
              animated: false
            });
          }, 100);
        }
      }
    }
  }, [typingMessage, typingIndex, isTyping]);

  // Add cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (listRef.current) {
      // Delay to ensure FlatList has laid out
      setTimeout(() => {
        listRef.current.scrollToEnd({ animated: false });
      }, 0);
    }
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardVisible(true);
        setShowSuggestions(false);
        
        // Scroll to bottom when keyboard appears
        if (listRef.current) {
          setTimeout(() => {
            listRef.current.scrollToOffset({
              offset: Number.MAX_SAFE_INTEGER,
              animated: false
            });
          }, 100);
        }
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        if (inputText === '' && messages.length <= 2) {
          setShowSuggestions(true);
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [messages.length, inputText]);

  // Update suggestions with more agriculture-focused options
  const initialSuggestions = [
    "गेहूं का भाव क्या है?",
    "मक्का का भाव बताएं",
    "आज की मंडी में क्या भाव है?",
    "किसान सम्मान निधि के बारे में बताएं",
    "मुझे फसल बीमा के बारे में बताएं"
  ];

  // Add crop-specific follow-up suggestions
  const cropFollowUpSuggestions = {
    'गेहूं': [
      "इस साल गेहूं की पैदावार कैसी है?",
      "गेहूं की अच्छी किस्में क्या हैं?",
      "गेहूं के लिए उचित उर्वरक क्या हैं?",
      "गेहूं के भाव में कल क्या बदलाव आया?"
    ],
    'चावल': [
      "चावल की अच्छी किस्में बताएं",
      "चावल के लिए पानी की मात्रा कितनी होनी चाहिए?",
      "बासमती चावल की खेती कैसे करें?",
      "चावल के भाव में कल क्या बदलाव आया?"
    ],
    'मक्का': [
      "मक्का को कब बोना चाहिए?",
      "मक्का की फसल में कौन से कीट लगते हैं?",
      "मक्का के भाव में कल क्या बदलाव आया?",
      "मक्का की उन्नत खेती कैसे करें?"
    ],
    'सोयाबीन': [
      "सोयाबीन की फसल में पानी कितना देना चाहिए?",
      "सोयाबीन की अच्छी उपज के लिए क्या करें?",
      "सोयाबीन के भाव में कल क्या बदलाव आया?",
      "सोयाबीन की उन्नत खेती कैसे करें?"
    ],
    'बाजरा': [
      "बाजरा बोने का सही समय क्या है?",
      "बाजरे की फसल को कौन से रोग होते हैं?",
      "बाजरे के भाव में कल क्या बदलाव आया?",
      "बाजरे की उन्नत खेती कैसे करें?"
    ]
  };

  // General follow-up suggestions
  const generalFollowUpSuggestions = [
    "अन्य फसलों का भाव क्या है?",
    "इस साल मौसम कैसा रहेगा?",
    "फसल बीमा के बारे में जानकारी दें",
    "सरकारी योजनाओं के बारे में बताएं"
  ];

  // Seasonal farming suggestions
  const seasonalSuggestions = {
    'summer': [
      "गर्मी की फसलों के बारे में बताएं",
      "सिंचाई के नए तरीके क्या हैं?",
      "गर्मी में फसलों की देखभाल कैसे करें?",
      "खरीफ फसलों की बुवाई कब करें?"
    ],
    'winter': [
      "रबी फसलों के लिए सुझाव दें",
      "सर्दियों में फसल सुरक्षा कैसे करें?",
      "ठंढ से फसल को बचाने के उपाय बताएं",
      "सर्दियों में उगाई जाने वाली फसलें कौन सी हैं?"
    ],
    'monsoon': [
      "बारिश में फसल की देखभाल कैसे करें?",
      "मानसून में कौन सी फसलें उगाएं?",
      "अधिक बारिश से फसल को कैसे बचाएं?",
      "खरीफ फसलों के लिए उर्वरक सुझाव दें"
    ]
  };

  // Update useState to include dynamicSuggestions
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [currentSeason, setCurrentSeason] = useState('summer'); // Default season

  // Determine season based on current month in useEffect
  useEffect(() => {
    const date = new Date();
    const month = date.getMonth();
    
    // India-specific seasons
    // Winter: November to February (10-1)
    // Summer: March to June (2-5)
    // Monsoon: July to October (6-9)
    if (month >= 2 && month <= 5) {
      setCurrentSeason('summer');
    } else if (month >= 6 && month <= 9) {
      setCurrentSeason('monsoon');
    } else {
      setCurrentSeason('winter');
    }
  }, []);

  // Update generateResponse to set contextual suggestions
  const generateResponse = (query) => {
    query = query.toLowerCase();
    let responseText = '';
    
    // Reset chart state
    setShowPriceChart(false);
    setActiveCrop(null);
    
    // Check for market rate related queries
    if (query.includes('मंडी') || 
        query.includes('भाव') || 
        query.includes('rate') || 
        query.includes('price') ||
        query.includes('market')) {
      
      // Extract crop name
      let cropName = null;
      for (const crop in mockMarketData) {
        if (query.includes(crop.toLowerCase())) {
          cropName = crop;
          break;
        }
      }
      
      if (cropName) {
        const data = mockMarketData[cropName];
        const trendIcon = data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→';
        responseText = `${cropName} का आज का भाव:\n₹${data.min} - ₹${data.max} प्रति क्विंटल ${trendIcon}\n\nक्या आप किसी अन्य फसल का भाव जानना चाहते हैं?`;
        
        // Show chart animation after response
        setActiveCrop(cropName);
        setTimeout(() => {
          setShowPriceChart(true);
          Animated.timing(priceChartAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false
          }).start();
        }, 1000);
        
        // Set crop-specific follow-up suggestions
        if (cropFollowUpSuggestions[cropName]) {
          setSuggestions([...cropFollowUpSuggestions[cropName]]);
        }
      } else {
        // Generic market rates response
        responseText = "निम्न फसलों के आज के भाव:\n\n";
        for (const crop in mockMarketData) {
          const data = mockMarketData[crop];
          const trendIcon = data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→';
          responseText += `${crop}: ₹${data.min} - ₹${data.max} प्रति क्विंटल ${trendIcon}\n`;
        }
        responseText += "\nकिसी विशेष फसल के बारे में और जानकारी के लिए पूछें।";
        
        // Set general market follow-up suggestions
        setSuggestions([
          "गेहूं का भाव क्या है?",
          "चावल का भाव बताएं",
          "मक्का की फसल कब बोई जाती है?",
          "अन्य फसलों के भाव बताएं"
        ]);
      }
    } else if (query.includes('धन्यवाद') || query.includes('thank') || query.includes('ok')) {
      responseText = "आपका स्वागत है! कृषि संबंधित किसी भी प्रश्न के लिए मुझसे पूछें।";
      
      // Show seasonal suggestions
      setSuggestions(seasonalSuggestions[currentSeason]);
    } else if (query.includes('फसल') || query.includes('खेती') || query.includes('बुवाई')) {
      responseText = "फसल संबंधी प्रश्नों के लिए विशेष फसल का नाम बताएं। जैसे 'गेहूं की खेती' या 'मक्का की फसल के लिए उर्वरक'।";
      
      // Show farming-related suggestions
      setSuggestions([
        "खरीफ फसलों के बारे में बताएं",
        "रबी फसलों के बारे में बताएं",
        "जैविक खेती कैसे करें?",
        "फसलों के लिए उर्वरक सुझाव दें"
      ]);
    } else if (query.includes('योजना') || query.includes('सरकारी') || query.includes('सब्सिडी')) {
      responseText = "कृषि योजनाओं की जानकारी के लिए कृपया विशेष योजना का नाम बताएं या अपने राज्य का नाम बताएं।";
      
      // Show scheme-related suggestions
      setSuggestions([
        "प्रधानमंत्री किसान सम्मान निधि क्या है?",
        "फसल बीमा योजना कैसे मिलेगी?",
        "सिंचाई के लिए सब्सिडी मिलती है क्या?",
        "ट्रैक्टर के लिए सब्सिडी कैसे मिलेगी?"
      ]);
    } else {
      responseText = "मुझे क्षमा करें, मैं आपका प्रश्न समझ नहीं पाया। क्या आप मंडी भाव के बारे में जानना चाहते हैं? उदाहरण के लिए 'गेहूं का भाव क्या है?' या 'आज की मंडी में दामों का क्या हाल है?'";
      
      // Set default suggestions
      setSuggestions(initialSuggestions);
    }
    
    // Start typing animation
    setTypingMessage(responseText);
    setCurrentTypingText('');
    setTypingIndex(0);
    
    // Always show suggestions after response
    setShowSuggestions(true);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording
      startMicPulseAnimation();
      setRecordingStartTime(Date.now());
      
      // Animate the voice wave
      Animated.loop(
        Animated.timing(voiceWaveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        })
      ).start();
      
      // Simulate voice amplitude changes
      voiceAmplitudeIntervalRef.current = setInterval(() => {
        setVoiceAmplitude([
          Math.random() * 0.8 + 0.2,
          Math.random() * 0.8 + 0.2,
          Math.random() * 0.8 + 0.2,
          Math.random() * 0.8 + 0.2,
          Math.random() * 0.8 + 0.2,
        ]);
      }, 150);
      
      // Simulating voice recording for demo purposes
      recordingTimeoutRef.current = setTimeout(() => {
        setIsRecording(false);
        stopMicPulseAnimation();
        setVoiceAmplitude([0, 0, 0, 0, 0]);
        clearInterval(voiceAmplitudeIntervalRef.current);
        setInputText('गेहूं का भाव क्या है?');
        
        // Show recognition animation
        Animated.sequence([
          Animated.timing(voiceWaveAnim, {
            toValue: 2,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(voiceWaveAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          })
        ]).start();
      }, 3000);
    } else {
      // Stop recording
      stopMicPulseAnimation();
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      if (voiceAmplitudeIntervalRef.current) {
        clearInterval(voiceAmplitudeIntervalRef.current);
      }
      setVoiceAmplitude([0, 0, 0, 0, 0]);
      voiceWaveAnim.setValue(0);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: suggestion,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setIsTyping(true);
    
    // Instantly scroll to bottom after suggestion tap
    if (listRef.current) {
      listRef.current.scrollToEnd({ animated: false });
    }
    
    // Simulate bot thinking
    setTimeout(() => {
      generateResponse(suggestion);
    }, 1000);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);
    
    // Instantly scroll to bottom after sending
    if (listRef.current) {
      listRef.current.scrollToEnd({ animated: false });
    }
    
    // Simulate bot thinking before typing
    setTimeout(() => {
      generateResponse(inputText);
    }, 1000);
  };

  // Add useEffect for initial suggestions
  useEffect(() => {
    if (hasLoadedHistory && messages.length <= 1) {
      // Only set initial suggestions when first loading
      setSuggestions([
        ...initialSuggestions,
        ...seasonalSuggestions[currentSeason].slice(0, 2) // Add two seasonal suggestions
      ]);
      setShowSuggestions(true);
    }
  }, [hasLoadedHistory, messages, currentSeason]);

  const renderMessage = useCallback(({ item, index }) => {
    const isUser = item.isUser;
    const isLast = index === messages.length - 1;
    
    return (
      <Animated.View
        entering={FadeIn.duration(300).delay(50).springify()}
        style={[
          styles.messageRow,
          isUser ? styles.userMessageRow : styles.botMessageRow,
        ]}
      >
        {!isUser && (
          <View style={styles.botAvatarContainer}>
            <View style={styles.botAvatar}>
              <Ionicons name="leaf" size={18} color="white" />
            </View>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.botMessageBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.botMessageText,
          ]}>
            {isLast && !isUser && isTyping ? currentTypingText : item.text}
            {isLast && !isUser && isTyping && cursorVisible && (
              <Text style={styles.blinkingCursor}>|</Text>
            )}
          </Text>
        </View>
        
        {isUser && (
          <View style={styles.userAvatarContainer}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={16} color="white" />
            </View>
          </View>
        )}
      </Animated.View>
    );
  }, [messages, isTyping, currentTypingText, cursorVisible]);

  const renderTypingIndicator = () => {
    if (!isTyping || (messages.length > 0 && messages[messages.length - 1].isUser === false)) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.botAvatarContainer}>
          <View style={styles.botAvatar}>
            <Ionicons name="leaf" size={18} color="white" />
          </View>
        </View>
        <View style={styles.typingBubble}>
          <Animated.View
            style={[styles.typingDot, { opacity: typingDotsAnim }]}
          />
          <Animated.View
            style={[styles.typingDot, { 
              opacity: typingDotsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.3],
              })
            }]}
          />
          <Animated.View
            style={[styles.typingDot, { 
              opacity: typingDotsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              })
            }]}
          />
        </View>
      </View>
    );
  };

  const renderSuggestions = () => {
    if (!showSuggestions) return null;
    
    const suggestionList = 
      messages.length === 1 ? initialSuggestions :
      messages.length > 0 && messages[messages.length - 1].isUser === false ? 
        getFollowUpSuggestions(messages[messages.length - 1].text) : [];
    
    if (suggestionList.length === 0) return null;
    
    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>सुझाव:</Text>
        <View style={styles.chipContainer}>
          {suggestionList.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionChipText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderMarketTrends = () => {
    // Only show market trends initially
    if (messages.length > 2) return null;
    
    return (
      <View style={styles.marketTrendsContainer}>
        <View style={styles.marketTrendsHeader}>
          <MaterialIcons name="trending-up" size={18} color="#1E6F41" />
          <Text style={styles.marketTrendsTitle}>आज के बाज़ार भाव</Text>
        </View>
        
        <View style={styles.trendsTable}>
          <View style={styles.trendHeaderRow}>
            <Text style={styles.trendHeaderText}>फसल</Text>
            <Text style={styles.trendHeaderText}>भाव (₹/क्विंटल)</Text>
            <Text style={styles.trendHeaderText}>तुलना</Text>
          </View>
          {Object.keys(mockMarketData).slice(0, 4).map((crop, index) => {
            const data = mockMarketData[crop];
            const trendIcon = data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→';
            const trendColor = data.trend === 'up' ? styles.trendUp : data.trend === 'down' ? styles.trendDown : {};
            
            return (
              <View key={crop} style={[styles.trendRow, index % 2 === 1 && styles.trendRowAlternate]}>
                <Text style={styles.trendCropText}>{crop}</Text>
                <Text style={styles.trendPriceText}>₹{data.min} - ₹{data.max}</Text>
                <Text style={[styles.trendChangeText, trendColor]}>{trendIcon}</Text>
              </View>
            );
          })}
        </View>
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => handleSuggestionPress("सभी फसलों के भाव दिखाएं")}
        >
          <Text style={styles.viewAllButtonText}>सभी फसलों के भाव देखें</Text>
          <Ionicons name="chevron-forward" size={16} color="#1E6F41" />
        </TouchableOpacity>
      </View>
    );
  };

  // Animation for showing new messages
  const animateNewMessage = () => {
    // Reset animation values
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    // Run parallel animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate typing dots
  const animateTypingDots = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingDotsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(typingDotsAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Start mic pulse animation
  const startMicPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micPulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(micPulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Stop mic pulse animation
  const stopMicPulseAnimation = () => {
    micPulseAnim.stopAnimation();
    micPulseAnim.setValue(1);
  };

  // Handle start recording
  const handleStartRecording = () => {
    handleVoiceInput();
  };

  // Handle stop recording
  const handleStopRecording = () => {
    handleVoiceInput();
  };

  // When adding a new message, trigger animation
  useEffect(() => {
    if (messages.length > 0) {
      animateNewMessage();
    }
  }, [messages.length]);

  // Add a function to render recording time
  const renderRecordingTime = () => {
    if (!isRecording || !recordingStartTime) return null;
    
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    
    return (
      <View style={styles.recordingTimeContainer}>
        <View style={styles.recordingDot} />
        <Text style={styles.recordingTimeText}>{`${minutes}:${seconds}`}</Text>
      </View>
    );
  };

  // Render voice wave animation
  const renderVoiceWave = () => {
    if (!isRecording) return null;
    
    return (
      <View style={styles.voiceWaveContainer}>
        {voiceAmplitude.map((amplitude, index) => (
          <Animated.View
            key={index}
            style={[
              styles.voiceWaveLine,
              {
                height: voiceWaveAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, 30 * amplitude, 40],
                }),
                backgroundColor: voiceWaveAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: ['#00A400', '#00A400', '#FFD700'],
                }),
                opacity: voiceWaveAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0.3, 0.7, 1],
                }),
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // Render price chart animation
  const renderPriceChart = () => {
    if (!showPriceChart || !activeCrop || !cropPriceData[activeCrop]) return null;
    
    const priceData = cropPriceData[activeCrop];
    const maxPrice = Math.max(...priceData);
    const minPrice = Math.min(...priceData);
    const range = maxPrice - minPrice;
    
    const trend = mockMarketData[activeCrop].trend;
    const trendColor = trend === 'up' ? '#1E6F41' : trend === 'down' ? '#FF4500' : '#888';
    
    return (
      <Animated.View 
        style={[
          styles.priceChartContainer,
          {
            opacity: priceChartAnim,
            transform: [{ 
              translateY: priceChartAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}
      >
        <View style={styles.priceChartHeader}>
          <Text style={styles.priceChartTitle}>{activeCrop} - पिछले 6 दिनों का भाव</Text>
        </View>
        <View style={styles.chartContent}>
          <View style={styles.yAxisLabels}>
            <Text style={styles.axisLabel}>₹{maxPrice}</Text>
            <Text style={styles.axisLabel}>₹{Math.floor(maxPrice - range/2)}</Text>
            <Text style={styles.axisLabel}>₹{minPrice}</Text>
          </View>
          <View style={styles.chartArea}>
            <View style={styles.gridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>
            <View style={styles.chartLines}>
              {priceData.map((price, index) => {
                if (index === 0) return null;
                const prevPrice = priceData[index - 1];
                const prevHeight = ((prevPrice - minPrice) / range) * 100;
                const currHeight = ((price - minPrice) / range) * 100;
                
                return (
                  <Animated.View 
                    key={index}
                    style={[
                      styles.chartLine,
                      {
                        left: `${(index - 1) * 20}%`,
                        height: priceChartAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, `${Math.abs(prevHeight - currHeight)}%`]
                        }),
                        bottom: `${Math.min(prevHeight, currHeight)}%`,
                        backgroundColor: trendColor,
                        width: priceChartAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 2]
                        }),
                      }
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.chartPoints}>
              {priceData.map((price, index) => {
                const pointHeight = ((price - minPrice) / range) * 100;
                return (
                  <Animated.View 
                    key={index}
                    style={[
                      styles.chartPoint,
                      {
                        left: `${index * 20}%`,
                        bottom: `${pointHeight}%`,
                        backgroundColor: trendColor,
                        transform: [{ 
                          scale: priceChartAnim.interpolate({
                            inputRange: [0, 0.8, 1],
                            outputRange: [0, 1.3, 1]
                          })
                        }]
                      }
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>
        <View style={styles.xAxisLabels}>
          <Text style={styles.axisLabel}>6 दिन पहले</Text>
          <Text style={styles.axisLabel}>आज</Text>
        </View>
      </Animated.View>
    );
  };

  // Generate ambient background dots
  useEffect(() => {
    if (ambientBubblesVisible) {
      const dots = [];
      for (let i = 0; i < 20; i++) {
        dots.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.15 + 0.05,
        });
      }
      setBackgroundDots(dots);
    }
  }, [ambientBubblesVisible, width, height]);

  // Animate ambient bubbles
  useEffect(() => {
    if (ambientBubblesVisible) {
      bubblePositions.forEach((bubble, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(bubble.y, {
                toValue: Math.random() * height / 3,
                duration: 15000 + i * 1000,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.x, {
                toValue: Math.random() * width,
                duration: 20000 + i * 1000,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.opacity, {
                toValue: Math.random() * 0.3 + 0.1,
                duration: 10000,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(bubble.y, {
                toValue: Math.random() * height / 3,
                duration: 15000 + i * 1000,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.x, {
                toValue: Math.random() * width,
                duration: 20000 + i * 1000,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.opacity, {
                toValue: Math.random() * 0.3 + 0.1,
                duration: 10000,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });
    }
  }, [ambientBubblesVisible]);

  // Render ambient background elements
  const renderAmbientElements = () => {
    if (!ambientBubblesVisible) return null;
    
    return (
      <>
        {/* Ambient floating bubbles */}
        {bubblePositions.map((bubble, index) => (
          <Animated.View
            key={`bubble-${index}`}
            style={[
              styles.ambientBubble,
              {
                transform: [
                  { translateX: bubble.x },
                  { translateY: bubble.y },
                  { scale: bubble.scale }
                ],
                opacity: bubble.opacity,
              },
            ]}
          />
        ))}
        
        {/* Static background dots */}
        {backgroundDots.map((dot) => (
          <View
            key={`dot-${dot.id}`}
            style={[
              styles.backgroundDot,
              {
                left: dot.x,
                top: dot.y,
                width: dot.size,
                height: dot.size,
                opacity: dot.opacity,
              },
            ]}
          />
        ))}
      </>
    );
  };

  const renderVoiceIntroScreen = () => {
    if (messages.length > 1) return null;
    
    return (
      <View style={styles.voiceIntroContainer}>
        <View style={styles.voiceIntroCircle}>
          <Ionicons name="mic" size={36} color="white" />
        </View>
        <Text style={styles.voiceIntroText}>बटन दबाकर सवाल बोलना शुरू करें...</Text>
        <View style={styles.quickOptionsContainer}>
          <TouchableOpacity 
            style={styles.quickOptionButton}
            onPress={() => handleSuggestionPress("आज का मौसम")}
          >
            <Text style={styles.quickOptionText}>आज का मौसम</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickOptionButton}
            onPress={() => handleSuggestionPress("गेहूं का भाव")}
          >
            <Text style={styles.quickOptionText}>गेहूं का भाव</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickOptionButton}
            onPress={() => handleSuggestionPress("खाद की जानकारी")}
          >
            <Text style={styles.quickOptionText}>खाद की जानकारी</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Update the bottom input area styling
  const renderBottomControls = () => {
    return (
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          {!isRecording ? (
            <>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                autoCorrect={false}
                onContentSizeChange={e => {
                  setInputHeight(Math.min(120, Math.max(44, e.nativeEvent.contentSize.height)));
                }}
                onFocus={() => {
                  setIsFocused(true);
                  if (listRef.current) {
                    listRef.current.scrollToEnd({ animated: true });
                  }
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
              />
              <Pressable
                style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]}
                disabled={!inputText.trim()}
                onPress={handleSend}
              >
                <Ionicons 
                  name="send" 
                  size={18} 
                  color={inputText.trim() ? "white" : "#CCC"} 
                />
              </Pressable>
            </>
          ) : (
            <View style={styles.recordingInputContainer}>
              <View style={styles.recordingStatusContainer}>
                <Animated.View style={[styles.recordingDot, { opacity: dotOpacity }]} />
                <Text style={styles.recordingStatusText}>
                  {recordingDuration ? formatTime(recordingDuration) : 'Listening...'}
                </Text>
              </View>
              <Pressable 
                style={styles.stopRecordingButton} 
                onPress={handleStopRecording}
              >
                <Ionicons name="square" size={18} color="white" />
              </Pressable>
            </View>
          )}

          {!isRecording && !isFocused && (
            <Pressable
              style={styles.micButton}
              onPress={handleStartRecording}
            >
              <Ionicons name="mic" size={22} color="#2E7D32" />
            </Pressable>
          )}
        </View>
        
        <Text style={styles.disclaimer}>
          KrishiAI may display inaccurate info. Verify instructions before following.
        </Text>
      </View>
    );
  };

  // Animation for the recording dot
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      dotOpacity.setValue(1);
    }
  }, [isRecording]);

  // Recording duration tracker
  useEffect(() => {
    let interval;
    if (isRecording) {
      setRecordingDuration(0);
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(null);
    }
    return () => clearInterval(interval);
  }, [isRecording]);
  
  // Helper function to format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {renderAmbientElements()}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>कृषि विशेषज्ञ</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.languageSelector}>
              <Text style={styles.languageText}>हिंदी</Text>
              <Ionicons name="chevron-down" size={16} color="#333" />
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            ListHeaderComponent={messages.length <= 1 ? renderVoiceIntroScreen : null}
            ListFooterComponent={
              <>
                {renderTypingIndicator()}
                {renderPriceChart()}
                {showSuggestions && renderSuggestions()}
              </>
            }
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              if (listRef.current) {
                listRef.current.scrollToOffset({ offset: contentHeight, animated: false });
              }
            }}
          />

          {!isRecording && (
            <TouchableOpacity 
              style={styles.floatingMicButton}
              onPress={handleVoiceInput}
              activeOpacity={0.7}
            >
              <Ionicons name="mic" size={28} color="white" />
            </TouchableOpacity>
          )}

          {isRecording && (
            <View style={styles.recordingWaveContainer}>
              <Text style={styles.recordingInstructionText}>बटन दबाकर सवाल बोलना शुरू करें...</Text>
              {renderVoiceWave()}
            </View>
          )}

          {renderBottomControls()}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  assistantStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00A400',
    marginRight: 4,
  },
  assistantStatus: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  languageText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 4,
  },
  newChatButton: {
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  userMessageBubble: {
    backgroundColor: '#2E7D32',
    borderBottomRightRadius: 4,
    marginLeft: 40,
  },
  botMessageBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    marginRight: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
  userAvatarContainer: {
    width: 30,
    height: 30,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatarContainer: {
    width: 30,
    height: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginHorizontal: 3,
  },
  blinkingCursor: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  recordingTimeContainer: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingTimeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4500',
    marginRight: 6,
  },
  voiceWaveContainer: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  voiceWaveLine: {
    width: 3,
    marginHorizontal: 3,
    borderRadius: 1.5,
    backgroundColor: '#1E6F41',
  },
  disclaimer: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  typingMessageContent: {
    minWidth: 50,
    minHeight: 40,
  },
  voiceIntroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  voiceIntroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  voiceIntroText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 40,
  },
  quickOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  quickOptionButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  quickOptionText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginVertical: SPACING.md,
    paddingHorizontal: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#1E6F41',
    marginLeft: 6,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F8FA',
    borderWidth: 1,
    borderColor: 'rgba(30,111,65,0.2)',
    marginBottom: 8,
    maxWidth: '48%',
  },
  suggestionChipText: {
    color: '#1E6F41',
    fontSize: 14,
    textAlign: 'center',
  },
  primarySuggestionChip: {
    backgroundColor: 'rgba(30,111,65,0.1)',
    borderColor: 'rgba(30,111,65,0.3)',
  },
  primarySuggestionChipText: {
    fontWeight: '500',
  },
  marketTrendsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  marketTrendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  marketTrendsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E6F41',
    marginLeft: 8,
  },
  trendsTable: {
    marginVertical: 4,
  },
  trendHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  trendHeaderText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
    color: '#555',
  },
  trendRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  trendRowAlternate: {
    backgroundColor: 'rgba(30,111,65,0.04)',
  },
  trendCropText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  trendPriceText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  trendChangeText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  trendUp: {
    color: '#1E6F41',
  },
  trendDown: {
    color: '#FF4500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewAllButtonText: {
    color: '#1E6F41',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  priceChartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  priceChartHeader: {
    marginBottom: 10,
  },
  priceChartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E6F41',
    textAlign: 'center',
  },
  chartContent: {
    height: 150,
    flexDirection: 'row',
  },
  yAxisLabels: {
    width: 45,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: '#777',
  },
  chartArea: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  chartLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartLine: {
    position: 'absolute',
    width: 2,
  },
  chartPoints: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 45,
    paddingTop: 5,
  },
  ambientBubble: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  backgroundDot: {
    position: 'absolute',
    borderRadius: 4,
    backgroundColor: 'rgba(30,111,65,0.1)',
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-end',
    position: 'relative',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    bottom: 18,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  disabledSendButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  micButton: {
    position: 'absolute',
    right: 24,
    bottom: 18,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  recordingInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  recordingStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingStatusText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 8,
  },
  stopRecordingButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 