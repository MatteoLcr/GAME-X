import { useState, useEffect, useRef } from "react";
import supabase from "../../supabase/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function RealtimeChat({ game, userProfileImage }) {
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
        <div className="boxAllMessages" ref={messagesRef}>
            {messages && messages.length > 0 ? (
                messages.map((message) => (
                    <div key={message.id} className="boxMessage my-1 d-flex">
                        <img
                            className="userImg"
                            src={userProfileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt=""
                        />
                        <div>
                            <div className="d-flex">
                                <p className="mx-2 text-warning">{message.profile_user_name}</p>
                                <p className="ms-2">{dayjs(message.created_at).fromNow()}</p>
                            </div>
                            <p className="ms-2 text-white">{message.content}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-white textoStartChatBox">Dai il via alla chat dedicata a {game.name}</p>
            )}
        </div>
    )
}