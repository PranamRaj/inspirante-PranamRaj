import { useState, useEffect } from 'react';
import '../css/Users.css';

function StudentPage({ token, onLogout, triggerAlert }) {
    const [events, setEvents] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, userRegistrationCount: 0 });

    const loadStudentData = async () => {
        try {
            const statsRes = await fetch('http://localhost:5000/api/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const statsData = await statsRes.json();

            const eventsRes = await fetch('http://localhost:5000/api/events', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const eventsData = await eventsRes.json();

            if (statsRes.ok && eventsRes.ok) {
                setStats({
                    totalEvents: statsData.totalEvents || 0,
                    userRegistrationCount: statsData.userRegistrationCount || 0
                });
                setMyRegistrations(statsData.registeredEvents || []);
                setEvents(eventsData || []);
            } else {
                triggerAlert('Failed to load student data.');
            }
        } catch (error) {
            triggerAlert('Network error connecting to backend.');
        }
    };

    useEffect(() => {
        if (token) loadStudentData();
    }, [token]);

    return (
        <div className="userPage">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Welcome, Student!</h1>
                <button className="register" onClick={onLogout} style={{ backgroundColor: '#d9534f', color: '#fff', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>Logout</button>
            </div>
            <hr />
            <h3>Events</h3>
            <div className="counts">
                <div className="countOfEvents"><p>Total Number of Events</p><p>{stats.totalEvents}</p></div>
                <div className="countOfRegistrations"><p>Your Registration</p><p>{stats.userRegistrationCount}</p></div>
            </div>
            <div className="eventsList">
                <ul className="events">
                    {events.map((event) => (
                        <li className="event" key={event._id}>
                            <h4>{event.title}</h4>
                            <p>Date: {event.date}</p>
                            <p>Venue: {event.venue}</p>
                            <p>Capacity: {event.capacity}</p>
                            <button className="register" onClick={() => triggerAlert("Registration features coming up next!")}>Register</button>
                        </li>
                    ))}
                    {events.length === 0 && <p style={{ padding: '15px' }}>No active events available.</p>}
                </ul>
            </div>
        </div>
    );
}

export default StudentPage;
