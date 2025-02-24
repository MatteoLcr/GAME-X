import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import GameCard from "../../components/gameCard";

export default function Category() {

    const { category } = useParams();
    const [selectedGenre, setSelectedGenre] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://api.rawg.io/api/games?key=ec2872a2f5ac4778a8ca720e3a416946&genres=${category}&page=1&page_size=24&ordering=-added`)
            const data = await response.json()
            setSelectedGenre(data.results)
        }
        fetchData()
    }, [ selectedGenre ])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h3>Tutti i giochi della categoria: {category}</h3>
                </div>
                <div className="row">
                    {selectedGenre.map((game) => (
                        <div className="col-12 col-md-3" key={game.id}>
                            <GameCard game={game}/> 
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}