import { createContext, useState } from "react";

export const currUser = createContext();

function CurrUser({ children }) {
  const [currentUser, setCurrentUser] = useState({
    fullName: null,
    username: null,
    avatar: null
  });

  return (
    <currUser.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </currUser.Provider>
  );
}

export default CurrUser;