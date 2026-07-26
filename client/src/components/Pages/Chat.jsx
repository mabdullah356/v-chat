import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../OnlineUsers";

const Chat = () => {

  const navigate = useNavigate();

  useEffect(()=>{
  const token  = localStorage.getItem("token");
  if(!token) navigate("/login")
    },[navigate])

  return (
    <main className="flex w-full gap-4 max-h-screen px-4 my-2 overflow-hidden">
      <section className="w-[70%]">
        <UserChat/>
      </section>
      <section className="w-[30%] border-l-2 border-l-gray-400 px-2">
        <OnlineUsers/>
      </section>

    </main>
  )
}

export default Chat;


function UserChat(){
  return (
    <main>
      <h1>UserChat</h1>
    </main>
  )
}