import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getStoredToken = () => {
        return( 
            localStorage.getItem('loggedUserToken') || sessionStorage.getItem('loggedUserToken')
        );
    };
    const [token, setToken] = useState(() => getStoredToken());
    const [user, setUser] = useState(() => {
        const storedToken = getStoredToken();
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

    const login = (newToken, rememberMe, navigate) => {
        try {
            const decoded = jwtDecode(newToken);
            // console.log(decoded);

            if(rememberMe){
                localStorage.setItem('loggedUserToken', newToken);
                sessionStorage.removeItem("loggedUserToken");
            } else {
                sessionStorage.setItem('loggedUserToken', newToken);
                localStorage.removeItem("loggedUserToken");
            };

            setToken(newToken);
            setUser(decoded);
            if (decoded.role.toLowerCase() === "admin") {
                navigate("/dashboard");
            } else if (decoded.role.toLowerCase() === "employee") {
                navigate("/employee_dashboard");
            } else {
                logout(navigate); // unknown role, force logout
            };
        }
        catch (error) {
            console.error('Invalid token during login.');
        }
    }

    const logout = (navigate = null) => {
        localStorage.removeItem('loggedUserToken');
        sessionStorage.removeItem("loggedUserToken");
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