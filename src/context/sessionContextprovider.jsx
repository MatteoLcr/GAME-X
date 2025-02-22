import { children, use, useEffect, useState } from "react";
import supabase from "../supabase/client";
import SessionContext from "./sessionContext";

export default function SessionContextProvider({ children }) {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT') {
                    setSession(null)
                } else if (session) {
                    setSession(session)
                }
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        getUser();
    }, [session])


    return (
        <SessionContext.Provider value={{ session, user }}>
            {children}
        </SessionContext.Provider>
    )
}