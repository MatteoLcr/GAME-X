import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import GameCard from "../../components/gameCard";

export default function Category() {

    const { category } = useParams();
    const [selectedGenre, setSelectedGenre] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://api.rawg.io/api/games?key=29c73f1240e84e6cb1a7ade30e62a09c&genres=${category}&page=1&page_size=24&ordering=-added`)
            const data = await response.json()
            setSelectedGenre(data.results)
        }
        fetchData()
    }, [selectedGenre])

    return (
        <div className="container-fluid d-flex justify-content-md-end justify-content-center">
            <div className="row gameCardArea d-flex justify-content-center">
                <div className="col-12">
                    <h3 className="text-white mb-3">Tutti i giochi della categoria: {category}</h3>
                </div>
                {selectedGenre.map((game) => (
                    <div className="col-12 col-md-3" key={game.id}>
                        <GameCard game={game} />
                    </div>
                ))}
            </div>
        </div>
    );
}