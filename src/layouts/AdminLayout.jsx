import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Dashboard/components/Sidebar/Sidebar";
import AdminHeader from "../Components/Dashboard/components/Header/AdminHeader";
import { useEffect, useState } from "react";



export default function AdminLayout() {

    const [active, setActive] = useState(false)
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated !== 'true') {
            navigate('/login');
            localStorage.clear()
        } else {
            console.log("Error")
        }
    }, [isAuthenticated])

    return (
        <div className="flex w-[100%] overflow-hidden  bg-[#FAFAFA] relative">
            <Sidebar active={active} onclose={() => setActive(false)} />
            <div className="mt-[10px] w-full min-h-screen">
                <AdminHeader active={() => setActive(!active)} />
                <Outlet />
            </div>
        </div>
    )
}