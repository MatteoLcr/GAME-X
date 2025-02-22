import {useState, useEffect} from "react"
import { useParams } from "react-router-dom"
import GameCard from "../../components/gameCard"
import { useNavigate } from "react-router-dom"

export default function SearchResults() {
    
    const [games, setGames] = useState([])
    const { query } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://api.rawg.io/api/games?key=355f36fb0e92466180e287434f6f63c4&search=${query}&page=1&page_size=24&ordering=-added`)
            const data = await response.json()
            setGames(data.results)
        }
        fetchData()
    }, [])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h3>Search results for: {query}</h3>
                </div>
                <div className="row">
                    {games.map((game) => (
                        <div className="col-12 col-md-3"
                        key={game.id}
                        onClick={() => navigate(`/show-game/${game.id}/${game.name}`)}>
                            <GameCard game={game}/> 
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}