import { useState, useContext, useEffect } from "react";
import ReviewContext from "./revievContext";
import SessionContext from "../sessionContext";
import supabase from "../../supabase/client";

export default function ReviewContextProvider({ children }) {
    const { session } = useContext(SessionContext);
    const [review, setReview] = useState([]);


    
    // // todo FUNZIONI PER LE RECENSIONI
    // // INSERT DATA
    // const HandleFormSubmit = async (event) => {
    //     event.preventDefault();
    //     const review = event.currentTarget;
    //     const { review_title, review_content, rate } = Object.fromEntries(new FormData(review));
    //     const { error } = await supabase
    //         .from("reviews")
    //         .insert([
    //             {
    //                 profile_id: session.user.id,
    //                 game_id: game.id,
    //                 game_name: game.name,
    //                 review_title: review_title,
    //                 review_content: review_content,
    //                 rate: rate,
    //             },
    //         ])
    //         .select();
    //     review.reset();
    // };
    // // READ DATA
    // useEffect(() => {
    //     const readReviews = async () => {
    //         if (game) {
    //             let { data: review, error } = await supabase
    //                 .from("reviews")
    //                 .select("*")
    //                 .eq("game_id", game.id);
    //             if (error) {
    //                 console.log(error);
    //             } else {
    //                 setReview(review);
    //             }
    //         }
    //     };
    //     readReviews();
    // }, [game]);





    return (
        <ReviewContext.Provider value={{ review, setReview, HandleFormSubmit  }}>
            {children}
        </ReviewContext.Provider>
    );
}