import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState('manager');

    // TODO: Add API fetch to get role from userID
    useEffect(() => {
        setUserRole('manager'); 
    }, []);

    return (
        <UserContext.Provider value={{ userRole }}>
            {children}
        </UserContext.Provider>
    );
};