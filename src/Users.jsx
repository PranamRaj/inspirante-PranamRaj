import './Users.css'
import { useState } from 'react';
function Users({triggerAlert}) {
    const [isRegistered, setIsRegistered] = useState(false);
    const registerEventHandler = () => {
        setIsRegistered(true);    
        triggerAlert('Registered for the event successfully!');    
    };
    return (
        <div className="userPage">
            <h1>Welcome, Users!</h1>
            <hr />
            <h3>Events</h3>
            <div className="eventsList">
                <ul className="events">
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails" onClick={registerEventHandler}>
                            {isRegistered ? 'Registered' : 'Register'}
                        </button>
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails" onClick={registerEventHandler}>
                            {isRegistered ? 'Registered' : 'Register'}
                        </button>
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails" onClick={registerEventHandler}>
                            {isRegistered ? 'Registered' : 'Register'}
                        </button>
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        <button className="seeDetails" onClick={registerEventHandler}>
                            {isRegistered ? 'Registered' : 'Register'}
                        </button>
                    </li>
                </ul>
            </div>
            <h3>Your Registrations</h3>
            <div className="eventResgistered">
                <ul className="events">
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        
                    </li>
                    <li className="event">
                        <h4>Event 1</h4>
                        <p>Date: 2023-10-15</p>
                        <p>Venue: Conference Room</p>
                        <p>Capacity: 100</p>
                        
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default Users;