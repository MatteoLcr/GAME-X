import { useState, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaWindows, FaPlaystation, FaXbox, FaApple, FaLinux, FaAndroid } from "react-icons/fa";
import { SiNintendoswitch, SiAtari, SiSega, SiAmazonlumberyard } from "react-icons/si";
import { BsGlobe } from "react-icons/bs";
import { Link } from "react-router-dom";
import FavouritesGameContext from "../context/favouritesGame/favouritesGameContext";
import SessionContext from "../context/sessionContext";
import 'swiper/css';
import 'swiper/css/pagination';

const platformIcons = {
    "PC": <FaWindows />,
    "PS Vita": <FaPlaystation />,
    "PlayStation": <FaPlaystation />,
    "PlayStation 3": <FaPlaystation />,
    "PlayStation 4": <FaPlaystation />,
    "PlayStation 5": <FaPlaystation />,
    "Xbox": <FaXbox />,
    "Xbox 360": <FaXbox />,
    "Xbox One": <FaXbox />,
    "Xbox Series S/X": <FaXbox />,
    "Nintendo": <SiNintendoswitch />,
    "Nintendo 3DS": <SiNintendoswitch />,
    "Nintendo Switch": <SiNintendoswitch />,
    "Apple Macintosh": <FaApple />,
    "macOS": <FaApple />,
    "Linux": <FaLinux />,
    "Android": <FaAndroid />,
    "Web": <BsGlobe />,
    "Atari": <SiAtari />,
    "SEGA": <SiSega />,
    "Amazon Luna": <SiAmazonlumberyard />
};

export default function GameCard({ game, screenshots }) {

    const { favourites, readFavouritesGame, addFavouriteGame, removeFavouriteGame } = useContext(FavouritesGameContext);
    const { session } = useContext(SessionContext);

    const isFavourite = favourites.some(fav => fav.game_id === game.id);
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const cardStyles = {
        position: 'relative',
        transition: 'all 0.3s ease',
        height: isHovered ? 'auto' : '300px',
        overflow: 'hidden',
    };

    const contentStyles = {
        padding: isHovered ? '10px' : '0',
        transition: 'all 0.3s ease',
    };


    const handleAddRemoveFavourite = (e) => {
        e.stopPropagation(); // Evita la navigazione involontaria

        if (isFavourite) {
            removeFavouriteGame(game.id);
        } else {
            addFavouriteGame(game);
        }
    };

    return (
        <div
            className="card gameCard"
            style={cardStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link to={`/show-game/${game.id}/${game.name}`} state={{ game }}>
                <Swiper
                    scrollbar={{
                        hide: true,
                    }}
                    modules={[Scrollbar]}
                    className="mySwiper"
                >
                    {game.short_screenshots.map((screenshot) => (

                        <SwiperSlide key={screenshot.id}>
                            <img src={screenshot.image} className="card-img-top" alt="..." />
                        </SwiperSlide>

                    ))}
                </Swiper>
            </Link>
            <div style={contentStyles}>
                <div>
                    {game.parent_platforms.map((platform) => {
                        const platformName = platform.platform.name;
                        return (
                            <span className="me-2 consolleIcons" key={platform.platform.id}>
                                {platformIcons[platformName] || platformName}
                            </span>
                        );
                    })}
                </div>
                <h4 className="mt-1">{game.name}</h4>

                {/* COMPONENTE CARD VISIBILE SOLO ALL'HOVER */}
                {isHovered && (
                    <div className="gameDetails">
                        <div>
                            {isFavourite ? (
                                <button
                                    onClick={() => (removeFavouriteGame(game), console.log(game))}
                                    className="removePrefeBtnCard my-1 ps-o pe-2">
                                    <FaStar className="text-warning me-1" /> Rimuovi dai preferiti
                                </button>
                            ) : (
                                <button
                                    onClick={() => addFavouriteGame(game)}
                                    className="addPrefeBtnCard my-1 ps-o pe-2">
                                    <FaRegStar className="text-warning me-1" /> Aggiungi ai preferiti
                                </button>
                            )}
                        </div>
                        <div className='d-flex justify-content-between mt-2'>
                            <p className='text-secondary'>Release Date:</p>
                            <p>{game.released}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p className='text-secondary'>Genres:</p>
                            <p>{game.genres?.map(genre => genre.name).join(', ')}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p className='text-secondary'>Rating:</p>
                            <p>{game.rating}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
