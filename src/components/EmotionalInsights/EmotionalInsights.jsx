import { useState } from 'react';
import { 
    ChartLine, 
    Brain, 
    Heart, 
    Lightbulb,
    ArrowRight 
} from "@phosphor-icons/react";
import './EmotionalInsights.scss';

function EmotionalInsights({ mood }) {
    const [activeTab, setActiveTab] = useState('patterns');

    const insights = {
        patterns: {
            icon: <ChartLine weight="fill" />,
            title: "Emotional Patterns",
            content: "Your emotional journey shows a pattern of resilience and growth."
        },
        triggers: {
            icon: <Brain weight="fill" />,
            title: "Potential Triggers",
            content: "Understanding what affects your mood can help you maintain emotional balance."
        },
        suggestions: {
            icon: <Lightbulb weight="fill" />,
            title: "Suggestions",
            content: "Try mindful breathing or journaling when feeling overwhelmed."
        }
    };

    return (
        <div className="insights">
            <div className="insights__header">
                <Heart weight="fill" />
                <h3>Emotional Insights</h3>
            </div>

            <div className="insights__tabs">
                {Object.keys(insights).map(tab => (
                    <button
                        key={tab}
                        className={`insights__tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {insights[tab].icon}
                        {insights[tab].title}
                    </button>
                ))}
            </div>

            <div className="insights__content animate-fade-up">
                <div className="insights__card">
                    {insights[activeTab].icon}
                    <p>{insights[activeTab].content}</p>
                </div>

                <button className="insights__action">
                    Learn More
                    <ArrowRight weight="bold" />
                </button>
            </div>
        </div>
    );
}

export default EmotionalInsights; 