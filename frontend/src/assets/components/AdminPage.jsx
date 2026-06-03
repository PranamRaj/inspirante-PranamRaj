import { useState, useEffect } from 'react';
import '../css/Admin.css';

function AdminPage({ token, onLogout, triggerAlert }) {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, totalRegistrationsCount: 0 });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [showRegsModal, setShowRegsModal] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [venue, setVenue] = useState('');
    const [capacity, setCapacity] = useState('');

    const loadAdminData = async () => {
        try {
            const statsRes = await fetch('http://localhost:3000/api/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const statsData = await statsRes.json();

            const eventsRes = await fetch('http://localhost:3000/api/events', {
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

    const openRegistrations = async (event) => {
        if (!event || !event._id) return;
        try {
            const res = await fetch(`http://localhost:3000/api/events/${event._id}/registrations`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setSelectedEvent(event);
                setRegistrations(data.students || []);
                setShowRegsModal(true);
            } else {
                triggerAlert(data.message || `Failed to load registrations (${res.status})`);
            }
        } catch (err) {
            // Network-level error (server down, CORS, etc.)
            triggerAlert('Network error while loading registrations. Is the backend running?');
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    date,
                    venue,
                    capacity: Number(capacity)
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
                <div className="countOfRegistrations"><p>Total Registrations</p><p>{stats.totalRegistrationsCount}</p></div>
            </div>

            <div className="eventsList">
                <ul className="events">
                    {events.map((event) => {
                        const registered = Number(event.registrationCount) || 0;
                        const capacityNum = Number(event.capacity) || 0;
                        const percent = capacityNum > 0 ? Math.min(100, Math.round((registered / capacityNum) * 100)) : 0;
                        const barClass = `capacityBar ${percent < 50 ? 'green' : percent < 80 ? 'amber' : 'red'}`;

                        return (
                            <li className="event" key={event._id} onClick={() => openRegistrations(event)} style={{ cursor: 'pointer' }}>
                                <h4>{event.title}</h4>
                                <p>Date: {event.date}</p>
                                <p>Venue: {event.venue}</p>
                                <p>Capacity: {capacityNum}</p>

                                <div className="capacityBarContainer">
                                    <div
                                        className={barClass}
                                        style={{ width: `${percent}%` }}
                                        title={`${percent}% full`}
                                        role="progressbar"
                                        aria-valuemin={0}
                                        aria-valuemax={capacityNum}
                                        aria-valuenow={registered}
                                    />
                                </div>

                                <p style={{ marginTop: '6px' }}>{registered} / {capacityNum} registered ({percent}%)</p>
                            </li>
                        );
                    })}
                    {events.length === 0 && <p style={{ padding: '15px' }}>No events created yet.</p>}
                </ul>
            </div>

            {showRegsModal && selectedEvent && (
                <div className="createEvents" onClick={() => setShowRegsModal(false)}>
                    <div className="createEventForm" onClick={(e) => e.stopPropagation()} style={{ minWidth: '380px' }}>
                        <h3>Registered Students for: {selectedEvent.title}</h3>
                        <div style={{ maxHeight: '320px', overflow: 'auto', width: '100%' }}>
                            {registrations.length === 0 && <p style={{ padding: '12px' }}>No registrations yet.</p>}
                            <ul className="regsList">
                                {registrations.map((s) => (
                                    <li key={s.id || s._id} className="regsItem">
                                        <div>
                                            <strong>{s.name || s.username}</strong>
                                            <div className="regsMeta">{s.username}</div>
                                        </div>
                                        <div className="regsMeta">{s.registeredAt ? new Date(s.registeredAt).toLocaleString() : ''}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <button className="createEventButton" onClick={() => setShowRegsModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
