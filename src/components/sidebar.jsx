import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SideBar() {
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(false);
    const location = useLocation();

    const importantPlatforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "macOS", "Linux", "Android"];

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://api.rawg.io/api/genres?key=355f36fb0e92466180e287434f6f63c4&page=1');
            const data = await response.json();
            setGenres(data.results);
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://api.rawg.io/api/platforms?key=355f36fb0e92466180e287434f6f63c4&page=1');
            const data = await response.json();
            setPlatforms(data.results);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (location.pathname === '/') {
            setSelectedGenre(null);
        }
    }, [location.pathname]);

    return (
        <div className=''>
            <button
                className="btn btn-dark position-fixed bottom-800 start-0 m-3 d-block d-md-none"
                onClick={() => setIsOpen(!isOpen)}
                style={{ zIndex: 1050 }}
            >
                {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>

            <div className={`sidebar p-4 ${isOpen ? "d-block" : "d-none"} d-md-block`} >
                {/* FILTRO PER GENERE */}
                <div className='genresBox ms-5'>
                    <h3 className="text-warning genName">GENERI</h3>
                    <div className="genreList ms-5 mt-3">
                        {genres.map((genre) => (
                            <h6 key={genre.id}
                                className='p-0 m-0'
                            >
                                <Link
                                    to={`/games/${genre.slug}`}
                                    className={`d-block text-decoration-none p-2 ${location.pathname === `/games/${genre.slug}` || selectedGenre === genre.id ? "text-warning" : "text-white"}`}
                                    onClick={() => setSelectedGenre(genre.id)}
                                >
                                    {genre.name}
                                </Link>
                            </h6>
                        ))}
                    </div>
                </div>

                {/* FILTRO PER CONSOLLE */}
                <div className='consolleBox d-flex justify-content-center align-content-center'>
                    <h3 className="text-warning consolleName">CONSOLE</h3>
                    <div className="consolleList ms-5 mt-3">
                        {platforms
                            .filter((platform) => importantPlatforms.includes(platform.name))
                            .map((platform) => (
                                <h6 key={platform.id}
                                    className='p-0 m-0'>
                                    <Link
                                        to={`/games/${platform.slug}`}
                                        className="d-block text-white text-decoration-none p-2">
                                        {platform.name}
                                    </Link>
                                </h6>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
