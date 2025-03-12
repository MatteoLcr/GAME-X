import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GameCard from "../../components/gameCard";

export default function Platform() {
    const { platform } = useParams();
    const [selectedPlatform, setSelectedPlatform] = useState([]);
    const [loading, setLoading] = useState(true);
    const [platformName, setPlatformName] = useState("");


    useEffect(() => {
        async function fetchPlatformName() {
            try {
                const response = await fetch(`https://api.rawg.io/api/platforms/lists/parents?key=8476cc83304c4692a51e258138e70d70`);
                const data = await response.json();
                const foundPlatform = data.results.find(p => p.id.toString() === platform);
                if (foundPlatform) {
                    setPlatformName(foundPlatform.name);
                } else {
                    setPlatformName("Piattaforma Sconosciuta");
                }
            } catch (error) {
                console.error("Errore nel recupero della piattaforma:", error);
                setPlatformName("Errore nel caricamento");
            }
        }
        fetchPlatformName();
    }, [platform]);

    return (
        <div className="container-fluid d-flex justify-content-md-end justify-content-center">
            <div className="row gameCardArea d-flex justify-content-center">
                <div className="col-12">
                    <h3 className="text-white mb-3">Tutti i giochi per: {platformName}</h3>
                </div>
                {loading ? (
                    <p className="text-white">Caricamento in corso...</p>
                ) : (
                    selectedPlatform.map((game) => (
                        <div className="col-12 col-md-3" key={game.id}>
                            <GameCard game={game} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
