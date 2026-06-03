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
            }
        } catch (error) {
            triggerAlert('Network error connecting to backend.');
        }
    };

    useEffect(() => {
        if (token) loadStudentData();
    }, [token]);

    // NEW ACTION: Submit registration data to the backend API
    const registerEventHandler = async (eventId) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Pass session token securely
                    'Content-Type': 'application/json' // Crucial content-type header
                },
                body: JSON.stringify({ eventId })
            });

            const data = await response.json();

            if (response.ok) {
                triggerAlert('Registered for the event successfully!');
                loadStudentData(); // Refresh metrics and lists dynamically from the database
            } else {
                triggerAlert(data.message || 'Registration failed.');
            }
        } catch (error) {
            triggerAlert('Could not process registration request.');
        }
    };

    // Helper check to determine if the student already registered for a specific event
    const isUserRegistered = (eventId) => {
        return myRegistrations.some(regEvent => regEvent._id === eventId);
    };

    return (
        <div className="userPage">
            <div className="studentheader">
                <h1>Welcome, Student!</h1>
                <button className="logout" onClick={onLogout}>Logout</button>
            </div>
            <hr />
            <h3>Events</h3>
            <div className="counts">
                <div className="countOfEvents"><p>Total Number of Events</p><p>{stats.totalEvents}</p></div>
                <div className="countOfRegistrations"><p>Your Registration</p><p>{stats.userRegistrationCount}</p></div>
            </div>

            <div className="eventsList">
                <ul className="events">
                    {events.map((event) => {
                        const registered = isUserRegistered(event._id);
                        return (
                            <li className="event" key={event._id}>
                                <h4>{event.title}</h4>
                                <p>Date: {event.date}</p>
                                <p>Venue: {event.venue}</p>
                                <p>Capacity: {event.capacity}</p>
                                {/* Alter button text, styling, and action based on live database registrations */}
                                <button
                                    className={registered ? 'registered' : 'register'}
                                    onClick={() => !registered && registerEventHandler(event._id)}
                                    disabled={registered}
                                >
                                    {registered ? 'Registered' : 'Register'}
                                </button>
                            </li>
                        );
                    })}
                    {events.length === 0 && <p style={{ padding: '15px' }}>No active events available.</p>}
                </ul>
            </div>

            {/* NEW VISUAL LIST: Displays events the user successfully registered for */}
            <h3>Your Confirmed Registrations</h3>
            <div className="eventResgistered">
                <ul className="events">
                    {myRegistrations.map((event) => (
                        <li className="event" key={event._id}>
                            <h4>{event.title}</h4>
                            <p>Date: {event.date}</p>
                            <p>Venue: {event.venue}</p>
                            <p>Capacity: {event.capacity}</p>
                        </li>
                    ))}
                    {myRegistrations.length === 0 && (
                        <p style={{ margin: '15px', color: '#777' }}>You haven't signed up for any events yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default StudentPage;

