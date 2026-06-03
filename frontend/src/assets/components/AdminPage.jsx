import { useState, useEffect } from 'react';
import '../css/Admin.css';

function AdminPage({ token, onLogout, triggerAlert }) {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, totalRegistrationsCount: 0 });

    // States to control form visibility and input values
    const [showForm, setShowForm] = useState(true);
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
                // Clear out form inputs cleanly
                setTitle('');
                setDate('');
                setVenue('');
                setCapacity('');
                setShowForm(false);
                // Refresh metrics and tables dynamically from database
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Welcome, Admin!</h1>
                <button className="createEventButton" onClick={onLogout} style={{ backgroundColor: '#d9534f', padding: '8px 15px' }}>Logout</button>
            </div>
            <hr />

            <h3>Events Management
                <span>
                    <button className="createEventButton" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Create New Event'}
                    </button>
                </span>
            </h3>

            {/* Event Creation Form Element conditional rendering */}
            {showForm && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', margin: '20px 0', border: '1px solid #ddd' }}>
                    <h4>Create New Event Form</h4>
                    <form onSubmit={handleCreateEvent}>
                        <p>Event Title</p>
                        <input type="text" placeholder="e.g. Tech Seminar" style={{ width: '100%', padding: '8px', margin: '5px 0' }} value={title} onChange={(e) => setTitle(e.target.value)} required />

                        <p>Date</p>
                        <input type="date" style={{ width: '100%', padding: '8px', margin: '5px 0' }} value={date} onChange={(e) => setDate(e.target.value)} required />

                        <p>Venue</p>
                        <input type="text" placeholder="e.g. Conference Hall" style={{ width: '100%', padding: '8px', margin: '5px 0' }} value={venue} onChange={(e) => setVenue(e.target.value)} required />

                        <p>Capacity</p>
                        <input type="number" placeholder="e.g. 100" style={{ width: '100%', padding: '8px', margin: '5px 0' }} value={capacity} onChange={(e) => setCapacity(e.target.value)} required /><br /><br />

                        <button type="submit" className="createEventButton" style={{ width: '100%' }}>Submit Event to Database</button>
                    </form>
                </div>
            )}

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
