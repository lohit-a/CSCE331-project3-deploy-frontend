import React, { createContext, useState, useEffect } from 'react';
import { SERVER_URL } from "../constant";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);      
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        fetch(SERVER_URL + "/api/whoami", {
            credentials: "include"  
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setUser(data);  
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch user info:", err);
                setUser({error: "backend-offline"});
                setLoading(false);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};
export default UserContext;