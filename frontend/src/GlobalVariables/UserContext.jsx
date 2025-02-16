import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    const loginUser = (userData) => {
        const userInfo = {
            userId: userData.userId,
            username: userData.username,
            password: userData.password,
            name: userData.name,
            purchased: userData.purchased || []
        };
        setCurrentUser(userInfo);
    };

    const logoutUser = () => {
        setCurrentUser(null);
    };

    const addOrder = (newOrder) => {
        setCurrentUser(prevUser => ({
            ...prevUser,
            purchased: [...prevUser.purchased, newOrder]
        }));
    };

    return (
        <UserContext.Provider value={{
            currentUser,
            loginUser,
            logoutUser,
            addOrder
        }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}