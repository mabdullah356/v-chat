import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Chat = () => {

  const navigate = useNavigate();

  useEffect(()=>{
  const token  = localStorage.getItem("token");
  if(!token) navigate("/login")
    },[navigate])

  return (
    <div>Chat</div>
  )
}

export default Chat