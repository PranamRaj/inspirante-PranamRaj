import { useState, useEffect } from 'react';
import '../css/Admin.css';

function AdminPage({ token, onLogout, triggerAlert }) {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, totalRegistrationsCount: 0 });

    // States to control form visibility and input values
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [venue, setVenue] = useState('');
    const [capacity, setCapacity] = useState('');

    const loadAdminData = async () => {
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
                    totalRegistrationsCount: statsData.totalRegistrationsCount || 0
                });
                setEvents(eventsData || []);
            }
        } catch (error) {
            triggerAlert('Network error connecting to backend.');
        }
    };

    useEffect(() => {
        if (token) loadAdminData();
    }, [token]);

    // Handle form submission to create a new event
    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Crucial required header
                },
                body: JSON.stringify({
                    title,
                    date,
                    venue,
                    capacity: Number(capacity) // Convert to true mathematical number
                })
            });

            const data = await response.json();

            if (response.ok) {
                triggerAlert('Event created successfully!');
                setTitle('');
                setDate('');
                setVenue('');
                setCapacity('');
                setShowForm(false);
                loadAdminData();
            } else {
                triggerAlert(data.message || 'Failed to create event.');
            }
        } catch (error) {
            triggerAlert('Network error while creating event.');
        }
    };

    return (
        <div className="adminPage">
            <div className="adminheader">
                <h1>Welcome, Admin!</h1>
                <button className="logout" onClick={onLogout}>Logout</button>
            </div>
            <hr />

            <h3>Events Management
                <span>
                    <button className="createEventButton" onClick={() => setShowForm(!showForm)}>
                         + Create New Event
                    </button>
                </span>
            </h3>

            {showForm && (
                <div className="createEvents" onClick={() => setShowForm(false)}>
                    <form
                        action="Post"
                        className="createEventForm"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleCreateEvent}
                    >
                        <p>Enter Event Name</p>
                        <input
                            type="text"
                            placeholder="Event Name"
                            className="createEventInput"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <p>Enter Event Date</p>
                        <input
                            type="date"
                            placeholder="Event Date"
                            className="createEventInput"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <p>Enter Event Venue</p>
                        <input
                            type="text"
                            placeholder="Event Venue"
                            className="createEventInput"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            required
                        />
                        <p>Enter Maximum Capacity</p>
                        <input
                            type="number"
                            min="1"
                            placeholder="Maximum Capacity"
                            className="createEventInput"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                        />
                        <p>Enter Event Description</p>
                        <textarea
                            placeholder="Event Description"
                            className="createEventInput"
                            required
                        ></textarea>
                        <br />
                        <div className="innerBUtton">
                            <button className="createEventButton" type="submit">
                                Create Event
                            </button>
                            <span><button className="createEventButton" onClick={() => setShowForm(!showForm)}>
                                Cancel
                            </button></span>
                        </div>
                        
                    </form>
                </div>)}

            <div className="counts">
                <div className="countOfEvents"><p>Total Number of Events</p><p>{stats.totalEvents}</p></div>
                <div className="countOfRegistrations"><p>Total Number of Registration</p><p>{stats.totalRegistrationsCount}</p></div>
            </div>

            <div className="eventsList">
                <ul className="events">
                    {events.map((event) => (
                        <li className="event" key={event._id}>
                            <h4>{event.title}</h4>
                            <p>Date: {event.date}</p>
                            <p>Venue: {event.venue}</p>
                            <p>Capacity: {event.capacity}</p>
                        </li>
                    ))}
                    {events.length === 0 && <p style={{ padding: '15px' }}>No events created yet.</p>}
                </ul>
            </div>
        </div>
    );
}

export default AdminPage;
