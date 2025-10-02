import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth most be used within an AuthProvider")
    }
    return context 
}

export const AuthProvider = ({children}) => {

    const [session, setSession] = useState(undefined)
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Sign Up
    const signUp = async (email, password, name, bussines) => {
        const {data: newUserData, error: newUserError} = await  supabase.auth.signUp({
            email: email,
            password: password,
        }, {
            redirectTo: 'http://localhost:5173/dashboard' 
        })

        if (newUserError) {
            console.error('There was a problem singing up:', newUserData)
            return { success: false, newUserData }
        }

        if (newUserData.user) {
            const { data, error } = await supabase.from('profile').insert([{
                user_id: newUserData.user.id,
                user_name: name,
                bussines_name: bussines,
            }]).select()

            setUser(data)

            if (error) {
                await supabase.auth.admin.deleteUser(newUserData.user.id)
                throw error
            }
        }

        return { susccess: true, newUserData }

    }

    // Sign In
    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if (error) {
                console.error('Sign in error ocurred: ', error)
                return { success: false, error: error.message}
            }

            setSession(data.session)
            return { success: true, data}

        } catch (error) {
            console.error('An error ocurred: ', error)
        }
    }

    const getProfile = async (id) => {
        try {
            const { data, error } = await supabase
            .from("profile")
            .select()
            .eq("user_id", id)
            .single();

            if (error) throw error;

            setUser(data);
            localStorage.setItem("userData", JSON.stringify(data));
        } catch (error) {
            console.error("An error occurred while getting profile:", error);
        }
    };


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                localStorage.setItem("session", JSON.stringify(session));
                getProfile(session.user.id);
            }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                localStorage.setItem("session", JSON.stringify(session));
                getProfile(session.user.id);
            } else {
                localStorage.removeItem("session");
                localStorage.removeItem("userData");
                setUser(null);
            }
        });
    }, []);


    

    // Sign Out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("There was an error:", error);
        } else {
            setUser(null);
            localStorage.removeItem("userData"); // 👈 limpiar el localStorage
        }
    };



    return (
        <AuthContext.Provider value={{
                session, 
                signUp, 
                signIn, 
                signOut, 
                user
            }}>
            {children}
        </AuthContext.Provider>
    )
}

