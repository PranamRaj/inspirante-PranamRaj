import { useState } from 'react'
import './Login.css'
import Admin from './Admin.jsx'
import Users from './Users.jsx'

function Login({onLoginSuccess, triggerAlert}) {
    const [isAdmin, setIsAdmin] = useState(true);
    const handleLogin = (e) => {
        e.preventDefault();
        const currentFormClass = e.currentTarget.className;
        if (currentFormClass.includes('adminForm')) {
            onLoginSuccess('admin');
            triggerAlert('Admin logged in successfully!');
        } else {
            onLoginSuccess('user');
            triggerAlert('User logged in successfully!');
        }
    }
    return (
        <>
            {(isAdmin) ?
                <div className="adminLogin">
                    <h1>Login</h1>
                    <form action="Post" className="adminForm" onSubmit={handleLogin}>
                        <p>Enter your Username</p>
                        <input type="text" placeholder="Username" className="adminInput" />
                        <p>Enter your Password</p>
                        <input type="password" placeholder="Password" className="adminInput" /><br />
                        <button className="adminButton" type='submit' >Login</button>
                    </form>
                    <p className="isUser">
                        User? <a href="#" onClick={() => setIsAdmin(false)} >Click here</a>
                    </p>
                </div> :
                <div className="userLogin">
                    <h1>Login</h1>
                    <form action="Post" className="userForm" onSubmit={handleLogin}>
                        <p>Enter your Name</p>
                        <input type="text" placeholder="Name" className="userInput" />
                        <p>Enter your Username</p>
                        <input type="text" placeholder="Username" className="userInput" />
                        <p>Enter your Password</p>
                        <input type="password" placeholder="Password" className="userInput" /><br />
                        <button className="userButton" type='submit' >Login</button>
                    </form>
                    <p className="isAdmin">
                        Admin? <a href="#" onClick={() => setIsAdmin(true)}  >Click here</a>
                    </p>
                </div>}
                
        </>
    )

}
export default Login;