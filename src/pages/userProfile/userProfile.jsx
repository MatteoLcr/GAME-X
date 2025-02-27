import { useContext, useEffect } from "react"
import FavouritesGameContext from "../../context/favouritesGame/favouritesGameContext"
import SessionContext from "../../context/sessionContext"

export default function UserProfile() {

    const { favourites, removeFavouriteGame2 } = useContext(FavouritesGameContext);
    const { session } = useContext(SessionContext);

    useEffect(() => {
    }, [favourites]);

    return (
        <div className="container-fluid">
            <div className="row profiloUtenteContainer">
                <div className="col-11 col-md-6 slotter">
                    <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="pills-fav-tab" data-bs-toggle="pill" data-bs-target="#pills-fav" type="button" role="tab" aria-controls="pills-fav" aria-selected="true">Favourites Games</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-review-tab" data-bs-toggle="pill" data-bs-target="#pills-review" type="button" role="tab" aria-controls="pills-review" aria-selected="false">Review</button>
                        </li>
                    </ul>

                    <div className="tab-content" id="pills-tabContent">

                        {/* PREFERITI */}
                        <div className="col-12 tab-pane fade show active" id="pills-fav" role="tabpanel" aria-labelledby="pills-fav-tab" tabIndex="0">
                            {favourites.map((game, index) => (
                                <div
                                    key={`${game.id}-${index}`}
                                    className="col-12 favItem rounded-2 d-flex justify-content-end my-1 mt-3 align-items-center "
                                    style={{
                                        backgroundImage: `url(${game.game_image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div
                                        className="d-flex flex-column justify-content-center align-items-end rounded-2"
                                        style={{
                                            height: "100px",
                                            width: "400px",
                                            backgroundColor: "transparent",
                                            backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 100%)"
                                        }}>

                                        <h5 className="text-white me-3">{game.game_name}</h5>

                                        <p className="text-secondary me-3 m-0">{new Date(game.created_at).toLocaleString("it-IT", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                        </p>

                                        <button
                                            className="userProfileFavBtn me-3 mt-2"
                                            onClick={() => (removeFavouriteGame2(game))}>
                                            rimuovi
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PROFILO */}
                        <div className="boxInfoUser col-12 tab-pane fade d-flex justify-content-evenly " id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex="0">
                            <img
                            className="rounded-circle imgProfiloBoxUser"
                                src={session?.user?.user_metadata?.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt="User Avatar"
                            />
                            <div>
                                <div>
                                    <p className="text-secondary">Nome</p>
                                    <h5>{session.user.user_metadata.first_name}</h5>
                                </div>
                                <div>
                                    <p className="text-secondary">Cognome</p>
                                    <h5>{session.user.user_metadata.last_name}</h5>
                                </div>
                                <div>
                                    <p className="text-secondary">Username</p>
                                    <h5>{session.user.user_metadata.username}</h5>
                                </div>
                                <div>
                                    <p className="text-secondary">Email</p>
                                    <h5>{session.user.user_metadata.email}</h5>
                                </div>
                            </div>
                        </div>

                        {/* REVIEW */}
                        <div className="col-12 tab-pane fade" id="pills-review" role="tabpanel" aria-labelledby="pills-review-tab" tabIndex="0">
                            <h3>queste sono le mie review</h3>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}