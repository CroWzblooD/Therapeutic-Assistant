import './Day.scss';
import ChatBox from '../../components/ChatBox/ChatBox';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MoodBox from '../../components/MoodBox/MoodBox';
import { Calendar, Brain } from "@phosphor-icons/react";

function Day({ 
    isSideBarOpen, 
    setIsTodaySelected, 
    isTodaySelected, 
    dates, 
    setSelectedDate, 
    selectedDate 
}) {
    const { date } = useParams();
    const navigate = useNavigate();
    const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        if (date === currentDate) {
            setIsTodaySelected(true);
        } else if (!date) {
            navigate(`/${currentDate}`);
        } else if (!dates?.includes(date)) {
            navigate('/not-found');
        } else {
            setIsTodaySelected(false);
        }
        setSelectedDate(date);
    }, [date]);

    return (
        <div className="day">
            <div className="day__header">
                <div className="day__date">
                    <Calendar weight="fill" />
                    <h2>{date === currentDate ? 'Today' : new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</h2>
                </div>
                <div className="day__insights">
                    <Brain weight="fill" />
                    <span>AI-Powered Emotional Support</span>
                </div>
            </div>

            <div className="day__content">
                <div className="day__main">
                    <ChatBox 
                        isSideBarOpen={isSideBarOpen} 
                        isTodaySelected={isTodaySelected} 
                        date={date} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Day;