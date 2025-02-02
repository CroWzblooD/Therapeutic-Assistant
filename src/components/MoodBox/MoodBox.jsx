import './MoodBox.scss';
import { 
    Heart,
    ChatCircleDots 
} from "@phosphor-icons/react";
import happy from '../../assets/mood/happy.png';
import angry from '../../assets/mood/angry.png';
import sad from '../../assets/mood/sad.png';
import calm from '../../assets/mood/calm.png';
import fearful from '../../assets/mood/fearful.png';
import insightful from '../../assets/mood/insightful.png';
import thinking from '../../assets/mood/thinking.png';
import axios from 'axios';

function MoodBox({ mood, setMood, isTodaySelected }) {
    const moodImages = {
        happy,
        angry,
        sad,
        calm,
        fearful,
        insightful,
        thinking
    };

    const moodDescriptions = {
        happy: "You're feeling positive and upbeat!",
        angry: "You're experiencing some frustration.",
        sad: "You're feeling down today.",
        calm: "You're in a peaceful state of mind.",
        fearful: "You're feeling anxious or uncertain.",
        insightful: "You're having meaningful realizations.",
        thinking: "Analyzing your emotional state..."
    };

    const getTodayMood = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/mood`);
            setMood(response.data.mood_of_the_day.toLowerCase());
        } catch (error) {
            console.error("Error fetching mood:", error);
        }
    };

    return (
        <div className="moodbox">
            <div className="moodbox__header">
                <Heart weight="fill" className="moodbox__header-icon" />
                <h2>Today's Mood</h2>
            </div>
            
            <div className="moodbox__content">
                <div className="moodbox__icon-container">
                    <img 
                        src={moodImages[mood]} 
                        alt={`${mood} mood`} 
                        className="moodbox__mood-image"
                    />
                </div>
                
                <p className="moodbox__description">
                    {moodDescriptions[mood]}
                </p>

                {isTodaySelected && mood === 'thinking' && (
                    <button className="moodbox__analyze-btn" onClick={getTodayMood}>
                        <ChatCircleDots weight="fill" />
                        Analyze My Mood
                    </button>
                )}
            </div>
        </div>
    );
}

export default MoodBox;
