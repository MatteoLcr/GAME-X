import { useState, useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import { useGlitch } from 'react-powerglitch';
import GameCard from '../../components/gameCard';
import logo from '../../assets/logo.png';

export default function Home() {
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const pageSize = 20;

    const glitch = useGlitch({ glitchTimeSpan: false });

    const { ref, inView } = useInView({ threshold: 0.5 });



    useEffect(() => {
        async function fetchData() {
            if (loading) return;
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://api.rawg.io/api/games?key=8476cc83304c4692a51e258138e70d70&dates=2019-09-01,2024-12-31&page=${page}&page_size=${pageSize}&ordering=-added`);
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
        }

        fetchData();
    }, [page]);

    useEffect(() => {
        if (inView && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    }, [inView, loading]);

    return (
        <div className='container-fluid d-flex justify-content-md-end justify-content-center mt-5'>
            <div className="row gameCardArea d-flex justify-content-center mt-5">
                
                {games.map((game) => (
                    <div className="col-12 col-md-3" key={game.id}>
                        <GameCard game={game} />
                    </div>
                ))}

                {error && <p className="text-danger text-center">{error}</p>}

                <div className="col-7 d-flex justify-content-center" ref={ref} style={{ marginTop: '300px', marginRight: '150px' }}>
                    {loading && (
                        <h1><img src={logo} ref={glitch.ref} style={{ height: '100px' }} /></h1>

                    )}
                </div>
            </div>
        </div>
    );
}
