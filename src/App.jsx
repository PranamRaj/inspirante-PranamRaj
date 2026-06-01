import Admin from './Admin.jsx'
import './App.css'
import Login from './Login.jsx'
import Users from './Users.jsx'
import {useState} from 'react'

function App() {
  const [isRole, setIsRole] = useState(null);
  const [message, setMessage] = useState(null);
  const triggerAlert = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000); // Autoclose after 3s
  };
  return (
    <>
    {isRole === null ? (
      <Login onLoginSuccess={setIsRole} triggerAlert={triggerAlert} />
    ) : isRole === "admin" ? (
      <Admin triggerAlert={triggerAlert} />
    ) : (
      <Users triggerAlert={triggerAlert} />
    )}
    {message && <div className="alert">{message}<div className="load"/></div>}
    </>

  )
}

export default App
