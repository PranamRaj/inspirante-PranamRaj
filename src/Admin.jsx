import './Admin.css'
import { useState } from 'react';

function Admin({triggerAlert}) {
    const [events,setEvents]=useState(false);
    return (
        <div className="adminPage">
            <h1>Welcome, Admin!</h1>
            <hr />
            <h3>Events Management <span><button className="createEventButton" onClick={() => setEvents(true)}>+Create New Event</button></span>
            </h3>
            <div className="eventsList">
                <ul className="events">
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails">See Details</button>
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails">See Details</button>
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails">See Details</button>
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails">See Details</button>
                    </li>
                </ul>
            </div>
            {events &&(
            <div className="createEvents" onClick={() => setEvents(false)}>
                    <form action="Post" className="createEventForm" onClick={(e) => e.stopPropagation()}>
                    <p>Enter Event Name</p>
                    <input type="text" placeholder="Event Name" className="createEventInput" required />
                    <p>Enter Event Date</p>
                    <input type="date" placeholder="Event Date" className="createEventInput" required />
                    <p>Enter Event Venue</p>
                    <input type="text" placeholder="Event Venue" className="createEventInput" required />
                    <p>Enter Maximum Capacity</p>
                    <input type="number" min="1" placeholder="Maximum Capacity" className="createEventInput" required />
                    <p>Enter Event Description</p>
                    <textarea placeholder="Event Description" className="createEventInput" required></textarea><br />
                    <button className="createEventButton" type="submit" onClick={() => triggerAlert('Event created successfully!')}>
                        Create Event
                    </button>
                </form>
                </div>)}
            </div>
    )
}
export default Admin;