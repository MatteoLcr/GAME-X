import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import GameCard from "../../components/gameCard"
import { useNavigate } from "react-router-dom"

export default function SearchResults() {

    const [games, setGames] = useState([])
    const { query } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://api.rawg.io/api/games?key=29c73f1240e84e6cb1a7ade30e62a09c&search=${query}&page=1&page_size=24&ordering=-added`)
            const data = await response.json()
            setGames(data.results)
        }
        fetchData()
    }, [])

    return (
        <div className="container-fluid">
            <div className="row gameCardArea d-flex justify-content-center">
                <div className="col-12">
                    <h3 className="text-white mb-3">Search results for: {query}</h3>
                </div>
            </div>
            <div className="row gameCardArea d-flex justify-content-center">
                {games.map((game) => (
                    <div className="col-12 col-md-3"
                        key={game.id}
                        onClick={() => navigate(`/show-game/${game.id}/${game.name}`)}>
                        <GameCard game={game} />
                    </div>
                ))}
            </div>
        </div>
    )
}