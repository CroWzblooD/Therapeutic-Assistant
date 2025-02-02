import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Day from './pages/Day/Day';
import NotFound from './pages/NotFound/NotFound';
import Sidebar from './components/Sidebar/Sidebar';
import { Sparkle } from "@phosphor-icons/react";
import AICompanion from './components/AICompanion/AICompanion';
import './App.scss';

function App() {
    const [isOpen, setIsOpen] = useState(true);
    const [isTodaySelected, setIsTodaySelected] = useState(true);
    const [selectedDate, setSelectedDate] = useState('2024-03-10');
    const [dates, setDates] = useState(['2024-03-09', '2024-03-01', '2024-02-29', '2024-02-20']);

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        if (!dates.includes(currentDate)) {
            setDates([currentDate, ...dates]);
        }
    }, [dates]);

    return (
        <BrowserRouter>
            <div className="app">
                
                
                <div className="app__content">
                    <Sidebar 
                        isOpen={isOpen} 
                        setIsOpen={setIsOpen}
                        isTodaySelected={isTodaySelected}
                        dates={dates}
                        setDates={setDates}
                        selectedDate={selectedDate}
                    />

                    <main className="app__main">
                        <Routes>
                            <Route 
                                path="/" 
                                element={
                                    <Day 
                                        isSideBarOpen={isOpen}
                                        setIsTodaySelected={setIsTodaySelected}
                                        isTodaySelected={isTodaySelected}
                                        setSelectedDate={setSelectedDate}
                                    />
                                } 
                            />
                            <Route 
                                path="/:date" 
                                element={
                                    <Day 
                                        isSideBarOpen={isOpen}
                                        setIsTodaySelected={setIsTodaySelected}
                                        isTodaySelected={isTodaySelected}
                                        dates={dates}
                                        setSelectedDate={setSelectedDate}
                                        selectedDate={selectedDate}
                                    />
                                } 
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
                <AICompanion />
            </div>
        </BrowserRouter>
    );
}

export default App;
// 5 emotions: anger, anticipation, joy, sadness, trust, disgust, fear, surprise
