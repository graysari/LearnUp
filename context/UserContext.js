
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const [subjectDailyTask, setSubjectDailyTask] = useState([]);

    const [token, setToken] = useState(null);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider 
        value={{ 
            user,
             setUser,
              login,
               logout,
                subjectDailyTask,
                 setSubjectDailyTask,
                 token,
                 setToken
                  }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
