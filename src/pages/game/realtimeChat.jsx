import { useState, useEffect, useRef } from "react";
import supabase from "../../supabase/client";


export default function RealtimeChat({ game }) {
    const [messages, setMessages] = useState([]);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [error, setError] = useState("");
    const messagesRef = useRef(null);

    function ScrollSmoothToBottom() {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }

    async function getInitialMessage() {
        // setLoadingInitial(true);
        // if (messages.lenght) return

        const { data, error } = await supabase
            .from("messages")
            .select()
            .eq("game_id", game.id)
        if (error) {
            setError(error)
            return
        }
        // setLoadingInitial(false);
        setMessages(data)
    }

    useEffect(() => {
        getInitialMessage();
        const channel = supabase
            .channel("messages")
            .on(
                "postgres_changes", {
                event: "*",
                schema: "public",
                table: "messages"
            },
                () => getInitialMessage()
            )
            .subscribe();

        return () => {
            if (channel) {
                supabase.removeChannel(channel)
            }
            channel.unsubscribe()
        }
    }, []);

    useEffect(() => {
        ScrollSmoothToBottom();
    }, [messages]);


    return (
        <div className="boxAllMessages bg-success" ref={messagesRef}>
            {messages && messages.map((message) => (
                <div key={message.id}>
                    <p>{message.profile_user_name}</p>
                    <p>{message.content}</p>
                    <p>{message.created_at}</p>
                </div>
            ))}
        </div>
    )
}