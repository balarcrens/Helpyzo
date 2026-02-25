import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    User,
    Grid,
    Briefcase,
    CalendarCheck,
    LogOut,
    Contact, X
} from "lucide-react";
import AuthContext from "../../context/Auth/AuthContext";
import { useContext } from "react";

const menus = {
    superadmin: [
        { name: "Dashboard", path: "/superadmin", icon: LayoutDashboard },
        { name: "Partners", path: "/superadmin/partners", icon: User },
        { name: "Categories", path: "/superadmin/categories", icon: Grid },
        { name: "Users", path: "/superadmin/users", icon: Users },
        { name: "All Bookings", path: "/superadmin/bookings", icon: CalendarCheck },
        { name: "Contact", path: "/superadmin/contact", icon: Contact },
        { name: "Home", path: "/", icon: LogOut },
    ],
    admin: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Services", path: "/admin/services", icon: Briefcase },
        { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
        { name: "Home", path: "/", icon: LogOut },
    ],
};

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation().pathname;
    const { user } = useContext(AuthContext);
    const role = user?.role === "partner" ? "admin" : user?.role;
    const roleMenus = menus?.[role] || [];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-60 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://helpyzo.netlify.app/helpyZo.png"
                            alt="HelpyZo"
                            className="h-8 object-contain"
                        />
                    </div>

                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-3 py-2 space-y-1.5">
                    {roleMenus.map((item) => {
                        const Icon = item.icon;
                        const active = location === item.path;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end
                                onClick={onClose}
                                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                transition-all duration-200
                                ${active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {/* Active left indicator */}
                                {active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-[#9fe870]" />
                                )}

                                {/* Icon container */}
                                <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all
                                    ${active
                                            ? "bg-[#9fe870]/30 text-gray-900"
                                            : "bg-gray-100 text-gray-400 group-hover:text-gray-700"
                                        }`}
                                >
                                    <Icon size={18} />
                                </div>

                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="mt-auto px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
                    © {new Date().getFullYear()} HelpyZo
                </div>
            </aside>
        </>
    );
}