// import { createContext, useContext, useState, useEffect } from 'react';
// import { 
//     signInWithEmailAndPassword, 
//     signOut, 
//     onAuthStateChanged,
//     createUserWithEmailAndPassword 
// } from 'firebase/auth';
// // import { auth } from '../firebase/config';
// import {auth} from '../firebase/config'


// const AuthContext = createContext();

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Listen for auth state changes
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUser({
//                     uid: user.uid,
//                     email: user.email,
//                     displayName: user.displayName || 'Admin'
//                 });
//             } else {
//                 setUser(null);
//             }
//             setLoading(false);
//         });

//         return () => unsubscribe();
//     }, []);

//     // Login function with Firebase
//     const login = async (email, password) => {
//         try {
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
            
//             return { 
//                 success: true, 
//                 user: {
//                     uid: user.uid,
//                     email: user.email,
//                     displayName: user.displayName || 'Admin'
//                 }
//             };
//         } catch (error) {
//             let errorMessage = 'Login failed';
            
//             switch (error.code) {
//                 case 'auth/invalid-email':
//                     errorMessage = 'Invalid email address';
//                     break;
//                 case 'auth/user-not-found':
//                     errorMessage = 'No user found with this email';
//                     break;
//                 case 'auth/wrong-password':
//                     errorMessage = 'Incorrect password';
//                     break;
//                 case 'auth/too-many-requests':
//                     errorMessage = 'Too many failed attempts. Try again later';
//                     break;
//                 default:
//                     errorMessage = error.message;
//             }
            
//             return { success: false, error: errorMessage };
//         }
//     };

//     // Register function (for creating admin users)
//     const register = async (email, password, displayName = 'Admin') => {
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
            
//             return { 
//                 success: true, 
//                 user: {
//                     uid: user.uid,
//                     email: user.email,
//                     displayName: displayName
//                 }
//             };
//         } catch (error) {
//             let errorMessage = 'Registration failed';
            
//             switch (error.code) {
//                 case 'auth/email-already-in-use':
//                     errorMessage = 'Email already in use';
//                     break;
//                 case 'auth/weak-password':
//                     errorMessage = 'Password should be at least 6 characters';
//                     break;
//                 case 'auth/invalid-email':
//                     errorMessage = 'Invalid email address';
//                     break;
//                 default:
//                     errorMessage = error.message;
//             }
            
//             return { success: false, error: errorMessage };
//         }
//     };

//     // Logout function
//     const logout = async () => {
//         try {
//             await signOut(auth);
//             setUser(null);
//         } catch (error) {
//             console.error('Logout error:', error);
//         }
//     };

//     // Check if user is admin (you can add role-based logic here)
//     const isAdmin = () => {
//         // For now, any authenticated user is considered admin
//         // You can implement role-based access later
//         return user !== null;
//     };

//     const value = {
//         user,
//         login,
//         register,
//         logout,
//         isAdmin,
//         loading
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            // Hardcoded admin credentials (you can move this to environment variables)
            const ADMIN_EMAIL = 'admin@cusap.com';
            const ADMIN_PASSWORD = 'admin123';

            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                const userData = {
                    id: 1,
                    email: ADMIN_EMAIL,
                    name: 'CUSAP Admin',
                    role: 'admin'
                };
                
                const token = 'admin-auth-token-' + Date.now();
                
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(userData));
                setUser(userData);
                
                return { success: true, user: userData };
            } else {
                return { success: false, error: 'Invalid credentials' };
            }
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setUser(null);
    };

    // Check if user is admin
    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    const value = {
        user,
        login,
        logout,
        isAdmin,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};