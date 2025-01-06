// UserContext.js
import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userEmail, setUserEmail] = useState('');

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
}
