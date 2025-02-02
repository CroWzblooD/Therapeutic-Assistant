import MoodBox from "../MoodBox/MoodBox";
import { useState, useEffect } from 'react';
import './Sidebar.scss';
import { ReactComponent as CloseX } from '../../assets/icons/closeX.svg';
import { ReactComponent as Hamburger } from '../../assets/icons/hamburger.svg';
import { NavLink } from "react-router-dom";
import { 
    Calendar, 
    X, 
    List,
    Smiley,
    SmileyAngry,
    SmileySad,
    SmileyMeh,
    Brain
} from "@phosphor-icons/react";


function Sidebar({ isOpen, setIsOpen, isTodaySelected, dates, setDates, selectedDate }) {
    const [mood, setMood] = useState('thinking');

    const moodIcons = {
        happy: <Smiley weight="fill" />,
        angry: <SmileyAngry weight="fill" />,
        sad: <SmileySad weight="fill" />,
        calm: <SmileyMeh weight="fill" />,
        thinking: <Brain weight="fill" />
    };

    function formatReadableDate(dateString) {
        const dateWithLocalTime = new Date(dateString + 'T00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateWithLocalTime.getTime() === today.getTime()) {
            return "Today";
        }

        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return dateWithLocalTime.toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        if (selectedDate === '2024-02-20') {
            setMood('fearful')
        } else if (selectedDate === '2024-02-29') {
            setMood('sad')
        } else if (selectedDate === '2024-03-01') {
            setMood('calm')
        } else if (selectedDate === '2024-03-09') {
            setMood('angry')
        }
    }, [selectedDate]);





    if (isOpen) {
        return (
            <div className='sidebar'>
                <div className="sidebar__header">
                    <h2>Journal Entries</h2>
                    <button className="sidebar__close" onClick={() => setIsOpen(false)}>
                        <X weight="bold" />
                    </button>
                </div>

                <div className="sidebar__content">
                    <MoodBox mood={mood} setMood={setMood} isTodaySelected={isTodaySelected} />
                    
                    <div className='sidebar__entries'>
                        <NavLink
                            className="sidebar__entry sidebar__entry--today"
                            to={`/${new Date().toISOString().split('T')[0]}`}
                        >
                            <Calendar weight="fill" />
                            <span>Today</span>
                        </NavLink>

                        <div className="sidebar__divider">Past Entries</div>

                        {dates.map((date, index) => {
                            const currentDate = new Date().toISOString().split('T')[0];
                            if (date === currentDate) return null;
                            
                            return (
                                <NavLink
                                    key={index}
                                    className="sidebar__entry"
                                    to={`/${date}`}
                                    onClick={() => {
                                        window.innerWidth <= 767 && setIsOpen(false);
                                    }}
                                >
                                    <Calendar weight="fill" />
                                    <span>{formatReadableDate(date)}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <button className="sidebar__toggle" onClick={() => setIsOpen(true)}>
                <List weight="fill" />
            </button>
        );
    }


}

export default Sidebar;