import { useState, useEffect, useRef } from 'react';
import { 
    Microphone, 
    MicrophoneSlash, 
    Brain,
    Waveform,
    X 
} from "@phosphor-icons/react";
import './AICompanion.scss';

function AICompanion() {
    const [isActive, setIsActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);
    const synth = window.speechSynthesis;
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    const utteranceRef = useRef(null);
    const [canContinue, setCanContinue] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(null);

    const startRecognition = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
                setTimeout(() => {
                    try {
                        recognitionRef.current.start();
                        setIsListening(true);
                    } catch (error) {
                        console.warn('Failed to start recognition:', error);
                        setIsListening(false);
                    }
                }, 100);
            } catch (error) {
                console.warn('Failed to stop recognition:', error);
            }
        }
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
                setIsListening(false);
            } catch (error) {
                console.warn('Failed to stop recognition:', error);
            }
        }
    };

    useEffect(() => {
        if (window.webkitSpeechRecognition) {
            recognitionRef.current = new webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onstart = () => {
                console.log('Recognition started');
                setIsListening(true);
                setError(null);
            };

            recognitionRef.current.onend = () => {
                console.log('Recognition ended');
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                if (event.error === 'aborted') {
                    console.log('Recognition aborted intentionally');
                    return;
                }
                if (event.error === 'no-speech') {
                    console.log('No speech detected');
                    return;
                }
                console.error('Recognition error:', event.error);
                setError(`Recognition error: ${event.error}`);
                setIsListening(false);
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                
                setTranscript(transcript);
                
                if (event.results[event.results.length - 1].isFinal) {
                    processVoiceInput(transcript);
                }
            };
        }

        return () => {
            stopRecognition();
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setVoicesLoaded(true);
                setSelectedVoice(voices.find(voice => 
                    voice.name.includes('Samantha') || 
                    voice.name.includes('Google UK English Female')
                ));
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const processVoiceInput = async (text) => {
        if (!text.trim()) return;

        try {
            setIsProcessing(true);
            // Stop listening while processing
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                    setIsListening(false);
                } catch (error) {
                    console.warn('Error stopping recognition:', error);
                }
            }

            const response = await fetch('http://localhost:8081/voice-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ 
                    message: text.trim(),
                    context: aiResponse
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.message) {
                setAiResponse(data.message);
                await speakResponse(data.message);
            }

        } catch (error) {
            console.error('Processing error:', error);
            setError(error.message);
            // Restart listening if there's an error
            if (recognitionRef.current) {
                setTimeout(() => {
                    try {
                        recognitionRef.current.start();
                        setIsListening(true);
                    } catch (error) {
                        console.warn('Error restarting recognition:', error);
                    }
                }, 1000);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const speakResponse = async (text) => {
        return new Promise((resolve) => {
            window.speechSynthesis.cancel();
            
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            let currentIndex = 0;

            const speakNextChunk = () => {
                if (currentIndex >= sentences.length) {
                    setIsSpeaking(false);
                    setTimeout(startRecognition, 1000);
                    resolve();
                    return;
                }

                const chunk = sentences[currentIndex];
                const utterance = new SpeechSynthesisUtterance(chunk);
                
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                
                utterance.rate = 1.0;
                utterance.pitch = 1.1;
                utterance.volume = 1.0;
                
                utterance.onstart = () => {
                    setIsSpeaking(true);
                    stopRecognition();
                };

                utterance.onend = () => {
                    currentIndex++;
                    if (currentIndex < sentences.length) {
                        setTimeout(speakNextChunk, 250);
                    } else {
                        setIsSpeaking(false);
                        setTimeout(startRecognition, 1000);
                        resolve();
                    }
                };

                utterance.onerror = (event) => {
                    console.error('Speech error:', event);
                    currentIndex++;
                    setTimeout(speakNextChunk, 250);
                };

                try {
                    window.speechSynthesis.speak(utterance);
                } catch (error) {
                    console.error('Speech synthesis error:', error);
                    currentIndex++;
                    setTimeout(speakNextChunk, 250);
                }
            };

            speakNextChunk();
        });
    };

    const toggleConversation = async () => {
        if (!isActive) {
            setIsActive(true);
            setError(null);
            try {
                // Make sure voices are loaded before starting
                if (!voicesLoaded) {
                    await new Promise(resolve => {
                        window.speechSynthesis.onvoiceschanged = () => {
                            setVoicesLoaded(true);
                            resolve();
                        };
                    });
                }

                recognitionRef.current.start();
                await speakResponse("Hello! I'm here to talk with you. How are you feeling today?");
            } catch (e) {
                console.error('Error starting conversation:', e);
                setError('Error starting conversation');
            }
        } else {
            setIsActive(false);
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    console.error('Error stopping recognition:', e);
                }
            }
            window.speechSynthesis.cancel();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopRecognition();
        } else {
            if (!isSpeaking) {
                startRecognition();
            }
        }
    };

    return (
        <>
            {!isActive ? (
                <button 
                    className="ai-companion__trigger"
                    onClick={toggleConversation}
                >
                    <Brain weight="fill" />
                    Start Voice Conversation
                </button>
            ) : (
                <div className="ai-companion">
                    <div className="ai-companion__header">
                        <div className="ai-companion__status">
                            {isSpeaking ? (
                                <Waveform className="speaking" weight="fill" />
                            ) : (
                                <Brain weight="fill" />
                            )}
                            <span>AI Companion</span>
                        </div>
                        <button 
                            className="ai-companion__close"
                            onClick={toggleConversation}
                        >
                            <X weight="bold" />
                        </button>
                    </div>

                    <div className="ai-companion__content">
                        {error && (
                            <div className="ai-companion__error">
                                {error}
                            </div>
                        )}
                        {isListening && (
                            <div className="ai-companion__listening">
                                <Microphone className="pulse" weight="fill" />
                                <p>{transcript || "Listening..."}</p>
                            </div>
                        )}
                        {isSpeaking && (
                            <div className="ai-companion__speaking">
                                <Waveform className="wave" weight="fill" />
                                <p>AI is speaking...</p>
                            </div>
                        )}
                        {!isListening && !isSpeaking && canContinue && (
                            <div className="ai-companion__continue">
                                <button onClick={() => {
                                    if (recognitionRef.current) {
                                        recognitionRef.current.start();
                                    }
                                }}>
                                    <Microphone weight="fill" />
                                    Continue Conversation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default AICompanion; 