import { jwtDecode } from "jwt-decode";
import { Children, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem('loggedUserToken'));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('loggedUserToken');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                return decoded;
            } catch (err) {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        if (!token) return;
        try {
            const decoded = jwtDecode(token);
            const expirationTimeout = decoded.exp * 1000 - Date.now();
            if (expirationTimeout <= 0) {
                logout();
            }
            else {
                const timeout = setTimeout(logout, expirationTimeout);
                return () => clearTimeout(timeout);
            }
        }
        catch (err) {
            logout();
        }
    }, [token]);

    const login = (newToken, navigate) => {
        try {
            const decoded = jwtDecode(newToken);
            localStorage.setItem('loggedUserToken', newToken);
            setToken(newToken);
            setUser(decoded);
            if (decoded.role.toLowerCase() === "admin") {
                navigate("/dashboard");
            } else if (decoded.role.toLowerCase() === "employee") {
                navigate("/employee_dashboard");
            } else {
                logout(navigate); // unknown role, force logout
            }
        }
        catch (error) {
            console.error('Invalid token during login.');
        }
    }

    const logout = (navigate = null) => {
        localStorage.removeItem('loggedUserToken');
        setToken(null);
        setUser(null);
        if (navigate) navigate("/");;
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);