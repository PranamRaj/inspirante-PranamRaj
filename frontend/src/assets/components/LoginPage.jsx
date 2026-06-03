import { useState } from 'react';
import '../css/Login.css';

function LoginPage({ onLoginSuccess, triggerAlert }) {
    const [isAdmin, setIsAdmin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

   
    const handleLogin = async (e) => {
        e.preventDefault();
        const targetRole = isAdmin ? 'admin' : 'user';

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role: targetRole })
            });

            const data = await response.json();

            if (!response.ok) {
                triggerAlert(data.message || 'Login failed.');
                return;
            }

            onLoginSuccess(data.token, data.user.role);
            triggerAlert(`${data.user.role === 'admin' ? 'Admin' : 'User'} logged in successfully!`);

        } catch (error) {
            triggerAlert('Could not connect to the backend server.');
        }
    };


    return (
        <>
            <h1 className='header'>COLLEGE EVENT MANAGER</h1>
            <div className="underline"></div>
            {isAdmin ? (
                <div className="adminLogin">
                    <h1>Admin Login</h1>
                    <form className="adminForm" onSubmit={handleLogin}>
                        <p>Enter your Username</p>
                        <input
                            type="text"
                            placeholder="Username"
                            className="adminInput"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <p>Enter your Password</p>
                        <input
                            type="password"
                            placeholder="Password"
                            className="adminInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        /><br />
                        <button className="adminButton" type='submit'>Login</button>
                    </form>
                    <p className="isUser">
                        User? <a href="#" onClick={() => { setIsAdmin(false); setUsername(''); setPassword(''); }}>Click here</a>
                    </p>
                </div>
            ) : (
                <div className="userLogin">
                    <h1>Student Login / Sign Up</h1>
                    <form className="userForm" onSubmit={handleLogin}>
                        <p>Enter your Name</p>
                        <input
                            type="text"
                            placeholder="Name"
                            className="userInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <p>Enter your Username</p>
                        <input
                            type="text"
                            placeholder="Username"
                            className="userInput"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <p>Enter your Password</p>
                        <input
                            type="password"
                            placeholder="Password"
                            className="userInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        /><br />
                        <button className="userButton" type='submit'>Login</button>
                    </form>
                    <p className="isAdmin">
                        Admin? <a href="#" onClick={() => { setIsAdmin(true); setUsername(''); setPassword(''); }}>Click here</a>
                    </p>
                </div>
            )}
        </>
    );
}

export default LoginPage;
