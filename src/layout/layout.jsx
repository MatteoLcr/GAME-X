import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar'
import SideBar from '../components/sidebar'

export default function Layout() {
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <Navbar />
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="">
                        <SideBar />
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    )
}