import { BrowserRouter as Router ,Routes,Route } from "react-router-dom"
import Signup from "./components/Pages/Signup"
import Login from "./components/Pages/Login"
import Chat from "./components/Pages/Chat"

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/chat/:username" element={<Chat/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App