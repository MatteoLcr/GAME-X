import { useState, useEffect, useCallback } from 'react';
import GameCard from '../../components/gameCard';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from "react-intersection-observer";

export default function Home() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [pageSize] = useState(20);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const fetchData = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://api.rawg.io/api/games?key=493fa9296bbc488eb279a7b3f8b6f53c&dates=2019-09-01,2024-12-31&page=${page}&page_size=${pageSize}&ordering=-added`);
            const data = await response.json();

            if (data.results) {
                setGames(prevGames => {
                    const newGames = [...prevGames, ...data.results];
                    return Array.from(new Map(newGames.map(game => [game.id, game])).values());
                });
            } else {
                throw new Error("Errore nel caricamento dei dati");
            }
        } catch (err) {
            console.error(err);
            setError("Impossibile caricare i giochi. Riprova più tardi.");
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        if (inView) {
            setPage(prevPage => prevPage + 1);
        }
    }, [inView]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className='container-fluid d-flex justify-content-md-end justify-content-center'>
            <div>
                
            </div>
            <div className="row gameCardArea d-flex justify-content-center">
                {games.map((game) => (
                    <div className="col-12 col-md-3"
                        key={game.id}>
                            <GameCard game={game} />
                    </div>
                ))}

                {error && <p className="text-danger text-center">{error}</p>}

                {loading && (
                    <div className="col-7 d-flex justify-content-center">
                        <div className="spinner-border text-primary my-5" role="status" ref={ref}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
