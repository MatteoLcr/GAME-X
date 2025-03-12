import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Layout from "./layout/layout";
import Home from "./pages/home/home";
import Category from "./pages/category/category";
// import Platform from "./pages/platform/platform";
import Game from "./pages/game/game";
import SearchResults from "./pages/search/searchResults";
import Register from "./pages/log_reg/register";
import Login from "./pages/log_reg/login";
import UserProfile from "./pages/userProfile/userProfile";
import SessionContextProvider from "./context/sessionContextprovider";
import SessionContext from "./context/sessionContext";
import FavouritesGameContextProvider from "./context/favouritesGame/favouritesGameContextprovider";
import ReviewContextProvider from "./context/review/reviewContextprovider";

import './App.css'

export function ProtectedRoute() {
  const { session } = useContext(SessionContext)

  if (!session) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/games/:category" element={<Category />} />
          {/* <Route path="/games/:platform" element={<Platform />} /> */}
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/show-game/:id/:game" element={<Game />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/userProfile" element={<UserProfile />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

function Root() {
  return (
    <SessionContextProvider>
      <FavouritesGameContextProvider>
        {/* <ReviewContextProvider> */}
        <App />
        {/* </ReviewContextProvider> */}
      </FavouritesGameContextProvider>
    </SessionContextProvider>
  )
}
export default Root
