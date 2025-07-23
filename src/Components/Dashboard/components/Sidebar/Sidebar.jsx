import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";

export default function Sidebar({ active, onclose }) {
    const [role] = useState("admin");
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const groupedMenuItems = [
        {
            section: "Asosiy",
            items: [
                {
                    id: 1,
                    title: "Buyurtmalar Ro‘yxati",
                    path: "/",
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 9.75L12 3l9 6.75M4.5 10.5v9.75h5.25V15h4.5v5.25H19.5V10.5" />
                        </svg>
                    )
                },
                {
                    id: 1,
                    title: "Foydalanuvchilar",
                    path: "/user",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"></path></svg>
                    )
                },
            ]
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={` fixed inset-0 bg-black/30 backdrop-blur-sm z-[49] transition-opacity duration-300 ${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onclose}
            />

            {/* Mobile Sidebar */}
            <div
                className={` fixed top-0 left-0 h-screen w-[280px] z-50 transform transition-transform duration-300 ease-in-out ${active ? "translate-x-0" : "-translate-x-full"}`}
            >
                <Card
                    className="h-full w-full shadow-xl bg-white/95 backdrop-blur-md border border-white/20 px-6 py-6 overflow-y-auto flex flex-col justify-between"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-md flex items-center justify-center text-black font-bold text-xl">
                                M
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            {groupedMenuItems.map((group) => (
                                <div key={group.section}>
                                    <Typography variant="small" color="gray" className="mb-2 uppercase font-medium text-xs tracking-widest">
                                        {group.section}
                                    </Typography>
                                    <div className="flex flex-col gap-2">
                                        {group.items.map((item) => (
                                            <div key={item.id} onClick={onclose}>
                                                <NavLink
                                                    to={item.path}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 
                                                        ${isActive
                                                            ? "bg-white/80 text-blue-600 font-semibold shadow-md"
                                                            : "text-gray-700 hover:bg-white/40 hover:text-blue-600"}`
                                                    }
                                                >
                                                    <span className="w-6 h-6">{item.icon}</span>
                                                    <span className="text-sm">{item.title}</span>
                                                </NavLink>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-6">
                        <Button
                            onClick={handleLogout}
                            fullWidth
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md"
                        >
                            Chiqish
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}
