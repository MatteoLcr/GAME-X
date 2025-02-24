import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useFetcher } from "react-router-dom";
import { Toaster } from "sonner";
import { FaStar, FaWindows, FaPlaystation, FaXbox, FaApple, FaLinux, FaAndroid } from "react-icons/fa";
import { SiNintendoswitch, SiAtari, SiSega, SiAmazonlumberyard } from "react-icons/si";
import { BsGlobe } from "react-icons/bs";
import supabase from "../../supabase/client";
import SessionContext from "../../context/sessionContext";
import FavouritesGameContext from "../../context/favouritesGame/favouritesGameContext";
// import ReviewContext from "../../context/review/revievContext";
import Chat from "../../pages/game/chat";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const colors = ["#4caf50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"];
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


export default function Game() {
    const location = useLocation();
    const { session } = useContext(SessionContext);
    const { id } = useParams();
    const { favourites, readFavouritesGame, addFavouriteGame, removeFavouriteGame } = useContext(FavouritesGameContext);
    const [game, setGame] = useState(location.state?.game || {});
    const [category_name, setCategory_name] = useState(location.state?.game.genres[0].id);
    const [gameSuggeriti, setGameSuggeriti] = useState([]);
    const [trailer, setTrailer] = useState(null);
    const favouritesContext = useContext(FavouritesGameContext);
    const isFavourite = favourites.some(fav => fav.game_id === game.id);
    const [review, setReview] = useState([]);

    // API YOUTUBE
    // const API_KEY = 'AIzaSyAv_QWajLN5nWFK9dJsPqMLspoKb1Hp1T0';
    const gameName = '';
    useEffect(() => {
        async function fetchTrailer(gameName) {
            if (!gameName) return;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(gameName + ' trailer')}&type=video&key=${API_KEY}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    const videoId = data.items[0].id.videoId;
                    setTrailer(videoId);
                } else {
                    console.log('Nessun trailer trovato');
                }
            } catch (error) {
                console.error('Errore nel recupero del trailer:', error);
            }
        }
        if (game?.name) {
            fetchTrailer(game.name);
        }
    }, [game?.name]);

    // API PER RICERCA GIOCHI SUGGERITI
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://api.rawg.io/api/games?key=ec2872a2f5ac4778a8ca720e3a416946&genres=${category_name}&page=1&page_size=24&ordering=-added`);
            const data = await response.json();
            setGameSuggeriti(data.results);
        }
        fetchData();
    }, []);

    // PER VEDERE I GIOCHI CHE PIACCIONO AD UN DETERMINATO UTENTE
    useEffect(() => {
        const isFavourite = game ? favourites.some(fav => fav.game_id === game.id) : false;
        if (isFavourite) {
            readFavouritesGame(game.id);
        }
    }, [session, game.id]);

    // todo FUNZIONI PER LE RECENSIONI
    // INSERT DATA REVIEW
    const HandleFormSubmit = async (event) => {
        event.preventDefault();
        const review = event.currentTarget;
        const { review_title, review_content, rate } = Object.fromEntries(new FormData(review));
        const { error } = await supabase
            .from("reviews")
            .insert([
                {
                    profile_id: session.user.id,
                    username: session.user.user_metadata.username,
                    game_id: game.id,
                    game_name: game.name,
                    review_title: review_title,
                    review_content: review_content,
                    rate: rate,
                },
            ])
            .select();
        review.reset();
    };
    // READ DATA
    useEffect(() => {
        const readReviews = async () => {
            if (game) {
                let { data: review, error } = await supabase
                    .from("reviews")
                    .select("*, profiles(username)")
                    .eq("game_id", game.id);
                if (error) {
                    console.log(error);
                } else {
                    setReview(review);
                }
            }
        };
        readReviews();
    }, [game]);


    return (
        <div className="container-fluid">
            <div className="row d-flex justify-content-end"
                style={{ whidth: "90%" }}>
                {/* IMMAGINE DI SFONDO */}
                <div
                    className="col-11 immagineSfondo">
                    {game.background_image && (
                        <img
                            src={game.background_image}
                            className="card-img-top immagineSfondo"
                            alt="..."
                        />
                    )}
                </div>

                <div className="row paginaDettaglioBoxInfo d-flex justify-content-center">

                    <div className="col-4 BoxInfoSx d-flex flex-column mt-4">
                        {/* LOGHI CONSOLLE */}
                        <div className="d-flex">
                            {game.parent_platforms && game.parent_platforms.length > 0 && (
                                <div className="d-flex">
                                    {game.parent_platforms.map((platform) => {
                                        const platformName = platform.platform.name;
                                        return (
                                            <span className="me-2 consolleIcons2" key={platform.platform.id}>
                                                {platformIcons[platformName] || platformName}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* NOME GIOCO */}
                        <h3 className="paginaDettaglioTitleGame">{game.name}</h3>

                        {/* BOTTONI PREFE E REVIEW */}
                        <div className="d-flex mb-4">
                            {isFavourite ? (
                                <button
                                    onClick={() => (removeFavouriteGame(game), console.log(game))} className="removePrefeBtn me-3">
                                    Rimuovi dai preferiti
                                </button>
                            ) : (
                                <button onClick={() => addFavouriteGame(game)} className="addPrefeBtn me-3">
                                    Aggiungi ai preferiti
                                </button>
                            )}
                            <button type="button" className="reviewBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Lascia una review
                            </button>
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">Recensione per {game.name}</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={HandleFormSubmit} >
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputTitle1" className="form-label text-dark">Titolo</label>
                                                    <input
                                                        type="text"
                                                        name="review_title"
                                                        area-label="review_title"
                                                        autoComplete="review_title"
                                                        className="form-control"
                                                        required />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputReview1" className="form-label text-dark">Recensione</label>
                                                    <textarea
                                                        type="text"
                                                        name="review_content"
                                                        area-label="review_content"
                                                        autoComplete="review_content"
                                                        className="form-control"
                                                        required />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputRate1" className="form-label text-dark">Valutazione</label>
                                                    <select
                                                        name="rate"
                                                        area-label="rate"
                                                        className="form-control"
                                                        required>
                                                        <option value="">Seleziona una valutazione</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Pubblica</button>
                                            </form>
                                        </div>
                                        {/* <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RANKING */}
                        <div className="d-flex mb-4">
                            <div className="d-flex flex-column align-items-center">
                                <h3 className="">{game.rating}</h3>
                                <p className="">Ranking</p>
                            </div>
                            <div className="d-flex flex-column align-items-center mx-5 centralRankingItem">
                                <h3>{game.reviews_count}</h3>
                                <p>Review</p>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                {game.genres && game.genres.length > 0 ? (
                                    <h3>{game.genres[0].name}</h3>
                                ) : (
                                    <h3>N/A</h3>
                                )}
                                <p>Genere</p>
                            </div>
                        </div>
                        <div>
                            {game.ratings?.map((rating, index) => (
                                <div key={rating.id} className="rating-bar-container">
                                    <div className="rating-bar">
                                        <div className="rating-fill"
                                            style={{
                                                width: `${rating.percent}%`,
                                                backgroundColor: colors[index % colors.length]
                                            }}>
                                            <div className="d-flex">
                                                <p className="me-2">{rating.title}</p>
                                                {rating.percent}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* REVIEWS */}
                        {review && review.length > 0 ? (
                            <div className="boxRecensioni mt-5">
                                <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                                    {review ? review.map((review) => (
                                        <SwiperSlide key={review.id} className="d-flex flex-column justify-content-center align-items-center">
                                            <h3>{review.review_title}</h3>
                                            <p>{review.review_content}</p>
                                            <div className="d-flex">
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <FaStar
                                                        key={index}
                                                        color={index < review.rate ? 'yellow' : 'gray'}
                                                    />
                                                ))}
                                            </div>
                                            <div className="d-flex justify-content-center mt-3">
                                                <p>{review.profiles.username},</p>
                                                <p className="text-secondary ms-2">{new Date(review.created_at).toLocaleString("it-IT", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    )) : <p>Non ci sono recensioni...</p>}
                                </Swiper>
                            </div>
                        ) : (
                            ("")
                        )}

                    </div>

                    <div className="col-5 BoxInfoDx d-flex flex-column justify-content-start">
                        {/* TRAILER YPUTUBE*/}
                        <div className="trailer-container mt-4 ms-2">
                            {trailer ? (
                                <iframe
                                    width="630"
                                    height="350"
                                    src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1`}
                                    title="Game Trailer"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <p>Trailer non disponibile</p>
                            )}
                        </div>
                        {/* SCREENSHOT GIOCO */}
                        <div>
                            {game.short_screenshots ? game.short_screenshots.slice(-6).map((img, index) => (
                                <img
                                    key={img.id}
                                    className="m-2"
                                    src={img.image} alt=""
                                    style={{ width: "200px", height: "100px" }} />
                            )) : <p>Nessuno screenshot disponibile</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center"
                style={{ whidth: "100%" }}>
                <div className="col-7">
                    {session && (
                        <Chat game={game} session={session} />
                    )}
                </div>
            </div>


            {/* <div className="row mt-5">

                {Array.isArray(gameSuggeriti) && gameSuggeriti.length > 5 ? (
                    gameSuggeriti.slice(5).map((game) => (
                        <div className="col-2" key={game.id}>
                            <img src={game.background_image} alt=""
                                style={{ width: "200px", height: "100px" }} />
                            <h5>{game.name}</h5>
                        </div>
                    ))
                ) : (
                    <p>Caricamento giochi...</p>
                )}

            </div> */}
            <Toaster position="top-center" />
        </div>
    );
}
