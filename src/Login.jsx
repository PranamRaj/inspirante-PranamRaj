import { useState } from 'react'
import './Login.css'

function Login() {
    const [isAdmin, setIsAdmin] = useState(true);
    return (
        <>
            {(isAdmin) ?
                <div className="adminLogin">
                    <h1>Login</h1>
                    <form action="Post" className="adminForm">
                        <p>Enter your Username</p>
                        <input type="text" placeholder="Username" className="adminInput" />
                        <p>Enter your Password</p>
                        <input type="password" placeholder="Password" className="adminInput" /><br />
                        <button className="adminButton">Login</button>
                    </form>
                    <p className="isUser">
                        User? <a href="#" onClick={() => setIsAdmin(false)} >Click here</a>
                    </p>
                </div> :
                <div className="userLogin">
                    <h1>Login</h1>
                    <form action="Post" className="userForm">
                        <p>Enter your Name</p>
                        <input type="text" placeholder="Name" className="userInput" />
                        <p>Enter your Username</p>
                        <input type="text" placeholder="Username" className="userInput" />
                        <p>Enter your Password</p>
                        <input type="password" placeholder="Password" className="userInput" /><br />
                        <button className="userButton">Login</button>
                    </form>
                    <p className="isAdmin">
                        Admin? <a href="#" onClick={() => setIsAdmin(true)}  >Click here</a>
                    </p>
                </div>}
        </>
    )

}
export default Login;