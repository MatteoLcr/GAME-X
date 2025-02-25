import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import supabase from '../supabase/client';
import SessionContext from '../context/sessionContext';


export default function Navbar() {
    const [query, setQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { session, user } = useContext(SessionContext)
    const [avatarUrl, setAvatarUrl] = useState("");
    const [username, setUsername] = useState("");

    async function signOut() {
        await supabase.auth.signOut();
    }

    // RECUPER CREDENZIALI USER (NOT SESSION)
    useEffect(() => {
        let ignore = false;
        async function getProfile() {
            const { user } = session;
            const { data, error } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', user.id)
                .single();

            if (!ignore) {
                if (error) {
                    console.warn(error);
                } else if (data) {
                    setUsername(data.username);
                    setAvatarUrl(data.avatar_url);
                }
            }
        }
        getProfile();
        return () => {
            ignore = true;
        };
    }, [session]);

    return (
        <nav className="navbar navbar-expand-lg fixed-top ">
            <div className="container-fluid navContainer ">

                <Link to={'/'}
                    className="navbar-brand text-white logo">GAME-X
                </Link>

                <form className="d-flex formSearchBar" role="search">
                    <input
                        onChange={(e) => setQuery(e.target.value)}
                        className="form-control searchBar "
                        type="search"
                        placeholder="Search "
                        aria-label="Search" />
                    <Link to={`/search/${query}`}>
                        <button className="btn" type="submit">
                            <Search size={24} color={'white'} />
                        </button>
                    </Link>
                </form>

                {session && user && !isMenuOpen &&
                    <div className="btn-group authNavEl1">

                        <button type="button" className="dropdownUserAuth dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img className='userImg me-2' src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="" />
                            <h6 className='mt-2'>ciao {username} </h6>
                        </button>

                        <ul className="dropdown-menu">
                            <Link to={"/userProfile"}>
                                <h6 className="dropdown-item">Profilo</h6>
                            </Link>
                            <h6 className='dropdown-item'>Preferiti</h6>
                            <li><hr className="dropdown-divider" /></li>
                            <button
                                className='logoutBtn ms-2'
                                onClick={signOut}>
                                <h6 className='mt-1'>Logout</h6>
                            </button>
                        </ul>
                    </div>
                }

                {!isMenuOpen && !user &&
                    <div className='noAuthNavEl1'>
                        <Link to={`/login`}>
                            <h6>Login</h6>
                        </Link>

                        <Link to={`/register`}>
                            <h6>Registrati</h6>
                        </Link>
                    </div>
                }

                <button className="hamburgerBtn d-md-none " type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} color={'white'} /> : <Menu size={24} color={'white'} />}
                </button>

                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show mt-2' : ''}`} id="navbarNav">
                    <ul className="navbar-nav">

                        {!user &&
                            <div className='noAuthNavEl'>
                                <Link to={`/login`}>
                                    <h6>Login</h6>
                                </Link>

                                <Link to={`/register`}>
                                    <h6>Registrati</h6>
                                </Link>
                            </div>
                        }

                        {user &&
                            <div className='authNavEl'>
                                <h6>Profilo</h6>
                                <h6>Preferiti</h6>
                                <button
                                    className='logoutBtn'
                                    onClick={signOut}>
                                    <h6 className='mt-1'>Logout</h6>
                                </button>
                            </div>
                        }

                    </ul>
                </div>
            </div>
        </nav>

    );
}
