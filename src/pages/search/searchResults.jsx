import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GameCard from "../../components/gameCard";
import { useNavigate } from "react-router-dom";
import { useGlitch } from 'react-powerglitch';
import logo from '../../assets/logo.png';

export default function SearchResults() {

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { query } = useParams();
    const navigate = useNavigate();
    const glitch = useGlitch({ glitchTimeSpan: false });

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch(`https://api.rawg.io/api/games?key=8476cc83304c4692a51e258138e70d70&search=${query}&page=1&page_size=24&ordering=-added`);
                const data = await response.json();
                setGames(data.results);
            } catch (error) {
                console.error("Errore nel caricamento dei dati", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [query]);

    return (
        <div className="container-fluid d-flex justify-content-md-end justify-content-center mt-5">
            <div className="row gameCardArea d-flex justify-content-center mt-5">
          
                    <h3 className="text-white mb-3" style={{ marginLeft: '300px' }} >Search results for: {query}</h3>
           
                {loading ? (
                    <div className="col-7 d-flex justify-content-center" style={{ marginTop: '300px', marginRight: '150px' }}>
                        <h1><img src={logo} ref={glitch.ref} style={{ height: '80px' }} /></h1>
                    </div>
                ) : (
                    <>

                        <div className="row gameCardArea d-flex justify-content-center">
                            {games.map((game) => (
                                <div className="col-12 col-md-3"
                                    key={game.id}
                                    onClick={() => navigate(`/show-game/${game.id}/${game.name}`)}>
                                    <GameCard game={game} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
