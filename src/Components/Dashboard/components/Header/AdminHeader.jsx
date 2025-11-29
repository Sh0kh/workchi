import { NavLink } from 'react-router-dom';
import { LayoutGrid, ShoppingCart, Users } from 'lucide-react';
import Logo from '../../../../images/photo_2025-08-11_07-51-02-removebg-preview.png';

export default function AdminHeader() {
    return (
        <header className=" py-4">
            <div className="Container">
                <div className="flex items-center justify-between">
                    {/* Логотип */}
                    <div className="Logo flex items-center gap-3">
                        <img className="w-[100px]" src={Logo} alt="Logo" />
                    </div>

                    {/* Навигация */}
                    <nav className="flex items-center gap-[40px] text-lg font-medium">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `relative flex items-center gap-2 px-2 pb-1 transition-all duration-500 ease-in-out 
                                 hover:text-MainColor 
                                 ${isActive ? 'text-MainColor' : 'text-gray-700'}`
                            }
                        >
                            <ShoppingCart size={20} />
                            Buyurtmalar
                            {/* Анимированный border */}
                            <span
                                className={({ isActive }) =>
                                    `absolute bottom-0 left-0 h-[2px] bg-MainColor transition-all duration-500 ease-in-out
                                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`
                                }
                            ></span>
                        </NavLink>

                        <NavLink
                            to="/user"
                            className={({ isActive }) =>
                                `relative flex items-center gap-2 px-2 pb-1 transition-all duration-500 ease-in-out 
                                 hover:text-MainColor 
                                 ${isActive ? 'text-MainColor' : 'text-gray-700'}`
                            }
                        >
                            <Users size={20} />
                            Foydalanuvchilar
                            <span
                                className={({ isActive }) =>
                                    `absolute bottom-0 left-0 h-[2px] bg-MainColor transition-all duration-500 ease-in-out
                                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`
                                }
                            ></span>
                        </NavLink>
                        <NavLink
                            to="/app"
                            className={({ isActive }) =>
                                `relative flex items-center gap-2 px-2 pb-1 transition-all duration-500 ease-in-out 
                                 hover:text-MainColor 
                                 ${isActive ? 'text-MainColor' : 'text-gray-700'}`
                            }
                        >
                            <LayoutGrid size={20} />
                            Application
                            <span
                                className={({ isActive }) =>
                                    `absolute bottom-0 left-0 h-[2px] bg-MainColor transition-all duration-500 ease-in-out
                                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`
                                }
                            ></span>
                        </NavLink>
                    </nav>
                </div>
            </div>
        </header>
    );
}
