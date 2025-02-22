import { useState, useEffect } from "react";
import SessionContext from "../../context/sessionContext";
import RealtimeChat from "./realtimeChat";
import supabase from "../../supabase/client";



export default function Chat({ game, session }) {

    async function HandleMessageSubmit(event) {
        event.preventDefault();
        const inputMessage = event.currentTarget
        const { message } = Object.fromEntries(new FormData(inputMessage));
        if (typeof message === "string" && message.trim().length !== 0) {
            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    profile_id: session.user.id,
                    profile_user_name: session.user.user_metadata.username,
                    game_id: game.id,
                    content: message
                }
                ])
                .select()
            if (error) {
                console.log(error);
            }
            inputMessage.reset();
        }
    }


    return (
        <div className="chatGaeContainer">
            <RealtimeChat game={game} />
            <div className="formChat">
                <form onSubmit={HandleMessageSubmit}>
                    <textarea type="text" name="message" />
                    <button>Invia</button>
                </form>
            </div>
        </div>
    );
}