function Admin(){
    return(
        <>
        <h1>Welcome, Admin!</h1>
        <div className="createEvents">
            <form action="Post" className="createEventForm" >
                <p>Enter Event Name</p>
                <input type="text" placeholder="Event Name" className="createEventInput" required />
                <p>Enter Event Date</p>
                <input type="date" placeholder="Event Date" className="createEventInput" required />
                <p>Enter Event Venue</p>
                <input type="text" placeholder="Event Venue" className="createEventInput" required />
                <p>Enter Maximum Capacity</p>
                <input type="number" placeholder="Maximum Capacity" className="createEventInput" required />
                <p>Enter Event Description</p>
                <textarea placeholder="Event Description" className="createEventInput" required></textarea><br />
                <button className="createEventButton">Create Event</button>
            </form>
        </div>
        </>
    )
}
export default Admin;