import React, {useEffect, useState} from 'react';
import '../styles/Calendar.css';
import { useTranslation } from 'react-i18next';

const Calendar = ({ userId }) => {
    const { t } = useTranslation();
    const [contributions, setContributions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const [storiesRes, contributionsRes] = await Promise.all([
                    fetch(`http://localhost:5076/userstories/${userId}`),
                    fetch(`http://localhost:5076/userstories/${userId}/contributions`)
                ]);

                if (!storiesRes.ok || !contributionsRes.ok) {
                    throw new Error(`HTTP error! Status: ${storiesRes.status}/${contributionsRes.status}`);
                }

                const [stories, contributions] = await Promise.all([
                    storiesRes.json(),
                    contributionsRes.json()
                ]);

                console.log("Raw API data:", { stories, contributions });
                
                // Process both stories and contributions (story parts)
                const contributionData = processContributions(stories, contributions);
                console.log("Processed data:", contributionData);
                setContributions(contributionData);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, [userId]);

    const isValidDate = (dateString) => {
        if (!dateString) return false;
        if (dateString.startsWith("0001-01-01") || dateString.includes("NaN")) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && date.getFullYear() > 2000;
    };

    const normalizeDate = (dateString) => {
        if (!isValidDate(dateString)) return null;
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    
    const processContributions = (stories, storyParts) => {
        const data = {};
        
        stories.forEach(story => {
            const createdDate = normalizeDate(story.createdAt);
            if (createdDate) {
                data[createdDate] = (data[createdDate] || 0) + 1;
            }
            
            if (story.updatedAt && story.updatedAt !== story.createdAt) {
                const updatedDate = normalizeDate(story.updatedAt);
                if (updatedDate && updatedDate !== createdDate) {
                    data[updatedDate] = (data[updatedDate] || 0) + 1;
                }
            }
        });

        storyParts.forEach(part => {
            const createdDate = normalizeDate(part.createdAt);
            if (createdDate) {
                data[createdDate] = (data[createdDate] || 0) + 1;
            }
            
            if (part.updatedAt && part.updatedAt !== part.createdAt) {
                const updatedDate = normalizeDate(part.updatedAt);
                if (updatedDate && updatedDate !== createdDate) {
                    data[updatedDate] = (data[updatedDate] || 0) + 1;
                }
            }
        });

        return data;
    };
    const generateCalendarData = () => {
        const weeks = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toISOString().split('T')[0]; // Get today's date string once
        
        // Calculate the start date (Sunday of the week 51 weeks ago)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (51 * 7) - today.getDay());
        startDate.setHours(0, 0, 0, 0);
    
        const monthChanges = [];
        let currentMonth = startDate.getMonth();
        
        // Find month changes
        for (let week = 0; week < 52; week++) {
            const weekDate = new Date(startDate);
            weekDate.setDate(startDate.getDate() + week * 7);
            const weekMonth = weekDate.getMonth();
            
            if (weekMonth !== currentMonth) {
                monthChanges.push({
                    month: weekMonth,
                    week: week
                });
                currentMonth = weekMonth;
            }
        }
    
        // Generate grid data
        for (let week = 0; week < 52; week++) {
            const weekDays = [];
            
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + week * 7 + day);
                
                const dateString = date.toISOString().split('T')[0];
                const count = contributions[dateString] || 0;
                
                let colorLevel = 0;
                if (count > 0) colorLevel = 1;
                if (count > 2) colorLevel = 2;
                if (count > 4) colorLevel = 3;
                if (count > 6) colorLevel = 4;
                
                weekDays.push({
                    date: dateString,
                    count,
                    colorLevel,
                    isToday: dateString === todayString,  // Compare with pre-computed todayString
                    dayOfWeek: day
                });
            }
            
            weeks.push(weekDays);
        }
        
        return { weeks, monthChanges };
    };

    const { weeks, monthChanges } = generateCalendarData();
    const monthNames = [t('Jan'), t('Feb'), t('Mar'), t('Apr'), t('May'), t('Jun'), t('Jul'), t('Aug'), t('Sep'), t('Oct'), t('Nov'), t('Dec')];
    //const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (loading) return <div className="calendar-loading">Loading...</div>;
    if (error) return <div className="calendar-error">Error: {error}</div>;

    return (
        <div className='calendar-container'>
        <div className="compact-calendar">
            <div className="calendar-header">
                <h4>{t('Story Contributions')}</h4>
                <div className="color-scale">
                    <span>{t('Less')}</span>
                    <div className="color-box level-0"></div>
                    <div className="color-box level-1"></div>
                    <div className="color-box level-2"></div>
                    <div className="color-box level-3"></div>
                    <div className="color-box level-4"></div>
                    <span>{t('More')}</span>
                </div>
            </div>
            
            <div className="calendar-grid">
                {/* Month labels */}
                <div className="month-labels">
                    {monthChanges.map((change, i) => (
                        <div 
                            key={i}
                            className="month-label"
                            style={{ gridColumn: change.week + 1 }}
                        >
                            {monthNames[change.month]}
                        </div>
                    ))}
                </div>

                {/* Weekday labels
                <div className="day-labels">
                    {dayNames.map((day, i) => (
                        <div key={i} className="day-label">{day}</div>
                    ))}
                </div> */}
                
                {/* Contribution grid */}
                <div className="contribution-grid">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="week-column">
                            {week.map((day, dayIndex) => (
                                <div 
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={`day-cell level-${day.colorLevel} ${day.isToday ? 'today' : ''}`}
                                    title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
}
export default Calendar;