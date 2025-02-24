import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabase/client";
import { useState } from "react";
import { Toaster, toast } from 'sonner';
import Navbar from "../../components/navbar";


export default function Register() {

    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const HandleRegister = async (event) => {
        event.preventDefault();
        const formRegister = event.currentTarget
        const { email, password, first_name, last_name, username } = Object.fromEntries(new FormData(formRegister));

        const file = formRegister.avatar_url.files[0];
        let avatarUrl = null;
        if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `avatars/${fileName}`;
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);
            if (error) {
                toast.error("Errore durante il caricamento dell'immagine");
                return;
            }
            avatarUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;
        }
        
        // INSERIMENTO DI TUTTI I DATI DEL FORM NEL DATABASE
        let { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name,
                    last_name,
                    username,
                    avatar_url: avatarUrl
                }
            }
        });

        if (error) {
            toast.error(error.message);
        } else {
            formRegister.reset();
            console.log(data);
            toast.success("Registrazione avvenuta con successo");
            await new Promise((resolve) => { setTimeout(resolve, 2000) });
            navigate("/");
        }
    }


    return (
        <div className="container">
            <Navbar />
            <div className="row d-flex flex-column justify-content-center align-items-center vh-100">
                <Toaster position="top-center" />
                <div className="col-5">
                    <form className="formRegister"
                        onSubmit={HandleRegister}>

                        <div>
                            <label htmlFor="imputImage" className="form-label">Avatar</label>
                            <input
                                type="file"
                                name="avatar_url"
                                accept="image/*"
                                placeholder="Avatar"
                                area-label="Avatar"
                                autoComplete="Avatar"
                                className="form-control"
                            />
                        </div>

                        <div>
                            <label htmlFor="exampleInputEmail1" className="form-label">First name</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First name"
                                area-label="First name"
                                autoComplete="First name"
                                className="form-control"
                                required />
                        </div>

                        <div>
                            <label htmlFor="exampleInputEmail1" className="form-label">Last name</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last name"
                                area-label="Last name"
                                autoComplete="Last name"
                                className="form-control"
                                required />
                        </div>

                        <div>
                            <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                area-label="Username"
                                autoComplete="Username"
                                className="form-control"
                                required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                area-label="Email"
                                autoComplete="Email"
                                className="form-control"
                                required />
                            <div id="emailHelp" className="form-text text-white">We'll never share your email with anyone else.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                area-label="Password"
                                autoComplete="Password"
                                className="form-control"
                                required />
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>

                        <p className="mt-4">Already register?
                            <Link to="/login" className="ms-2">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}