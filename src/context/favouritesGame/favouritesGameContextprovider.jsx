import { useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import FavouritesGameContext from "./favouritesGameContext";
import SessionContext from "../sessionContext";
import supabase from "../../supabase/client";

export default function FavouritesGameContextProvider({ children }) {
    const { session } = useContext(SessionContext);
    const [favourites, setFavourites] = useState([]);

    async function readFavouritesGame() {
        if (!session?.user?.id) return;
        const { data, error } = await supabase
            .from('favourites_game')
            .select('*')
            .eq('profile_id', session.user.id);
        if (error) {
            console.error("Errore nella lettura dei preferiti:", error);
            toast.error("Errore nella lettura della lista dei preferiti!");
            return;
        }
        setFavourites(data || []);
    }


    async function addFavouriteGame(game) {
        if (!session?.user?.id) return;
        const { data, error } = await supabase
            .from('favourites_game')
            .insert({
                profile_id: session.user.id,
                game_id: game.id,
                game_name: game.name,
                game_image: game.background_image
            })
            .select();
        if (error) {
            toast.error("Errore nell'inserimento del gioco fra i preferiti!");
            return;
        }
        toast.success("Il gioco è stato aggiunto ai preferiti!");
        setFavourites(prevFavourites => [...prevFavourites, ...data]);
    }

    async function removeFavouriteGame(game) {
        if (!session?.user?.id) return;
        const { error } = await supabase
            .from('favourites_game')
            .delete()
            .eq('profile_id', session.user.id)
            .eq('game_id', game.id);
        if (error) {
            toast.error("Errore nella rimozione del gioco dai preferiti!");
            return;
        }
        toast.success("Il gioco è stato rimosso dai preferiti!");
        setFavourites(prevFavourites => prevFavourites.filter(fav => fav.game_id !== game.id));
    }

    // FUNZIONE RIMOZIONE PAGINA PROFILO UTENTE
    async function removeFavouriteGame2(game) {
        if (!session?.user?.id) return;
        const { error } = await supabase
            .from('favourites_game')
            .delete()
            .eq('profile_id', session.user.id)
            .eq('game_id', game.game_id);
        if (error) {
            toast.error("Errore nella rimozione del gioco dai preferiti!");
            return;
        }
        toast.success("Il gioco è stato rimosso dai preferiti!");
        setFavourites(prevFavourites => prevFavourites.filter(fav => fav.game_id !== game.game_id));
    }



    useEffect(() => {
        if (session?.user?.id) {
            readFavouritesGame();
        } else {
            setFavourites([]);
        }
    }, [session]);

    return (
        <FavouritesGameContext.Provider value={{ favourites, readFavouritesGame, addFavouriteGame, removeFavouriteGame, removeFavouriteGame2 }}>
            {children}
        </FavouritesGameContext.Provider>
    );
}
