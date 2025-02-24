import supabase from "../../supabase/client";
import { Toaster, toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/navbar";


export default function Login() {

    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const HandleLogin = async (event) => {
        event.preventDefault();
        console.log("HandleLogin chiamato!");
        const formRegister = event.currentTarget;
        const { email, password } = Object.fromEntries(new FormData(formRegister));
        console.log("Email:", email, "Password:", password);


        if (!email || !password) {
            toast.error("Email e password sono obbligatori!");
            return;
        }
    
        let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
    
        if (error) {
            console.error("Errore di login:", error);
            toast.error(error.message);
        } else {
            console.log("Login effettuato con successo!", data);
            formRegister.reset();
            toast.success("Login successful");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            navigate("/");
        }
    };

    return (
        <div className="container">
            <Navbar />
            <div className="row d-flex flex-column justify-content-center align-items-center vh-100">
            <Toaster position="top-center" />
                <div className="col-5 ">
                    <form className="formRegister"
                        onSubmit={HandleLogin}>

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

                        <p className="mt-4">Not registered yet?
                            <Link to="/register" className="ms-2">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>

    )
}