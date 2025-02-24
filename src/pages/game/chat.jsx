import { useState, useEffect } from "react";
import SessionContext from "../../context/sessionContext";
import RealtimeChat from "./realtimeChat";
import supabase from "../../supabase/client";



export default function Chat({ game, session, userProfileImage }) {
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
        <div className="chatContainer my-5">
            <RealtimeChat game={game} userProfileImage={userProfileImage}/>
            <div className="">
                <form onSubmit={HandleMessageSubmit} className="formChat d-flex p-2">
                    <textarea type="text" name="message" className="insertMessage" />
                    <button className="sendChatBtn ms-2">Invia</button>
                </form>
            </div>
        </div>
    );
}