import PropTypes from 'prop-types'; // Import PropTypes
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loginHappened, setLoginHappened] = useState(false);

    return (
        <AuthContext.Provider value={{ loginHappened, setLoginHappened }}>
            {children}
        </AuthContext.Provider>
    );
};

// Validate the `children` prop using PropTypes
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // `children` should be any renderable React node
};

export const useAuth = () => useContext(AuthContext);
