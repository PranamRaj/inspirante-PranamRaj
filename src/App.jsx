import Admin from './Admin.jsx'
import './App.css'
import Login from './Login.jsx'
import Users from './Users.jsx'
import {useState} from 'react'

function App() {
  const [isRole, setIsRole] = useState(null);
  
  return (
    <>
    {isRole === null ? (
      <Login onLoginSuccess={setIsRole}/>
    ) : isRole === "admin" ? (
      <Admin />
    ) : (
      <Users />
    )}
    </>

  )
}

export default App
