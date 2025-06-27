import {Dropdown} from "../ui/dropdown/Dropdown.tsx";
import {DropdownItem} from "../ui/dropdown/DropdownItem.tsx";
import {Link} from "react-router";
import {useState} from "react";
import {useGetUserQuery} from "../../services/apiAuth";
import {useNavigate} from "react-router";

export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('access');
    const {data: user, error} = useGetUserQuery(undefined, {skip: !token});

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsOpen(false);
        navigate('/login');
        window.location.reload();
    };

    if (!token || !user || error || !user.username || user.username === 'Гість') {
        return (
            <div className="flex gap-2">
                <Link to="/login" className="flex items-center text-gray-700 dark:text-gray-400">
                    <span className="block font-medium text-theme-sm">Увійти</span>
                </Link>
                <Link to="/register" className="flex items-center text-gray-700 dark:text-gray-400">
                    <span className="block font-medium text-theme-sm">Реєстрація</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
            >
                <span className="mr-3 overflow-hidden rounded-full h-11 w-11 relative">
                    {user.photo ? (
                        <img src={user.photo} alt={user.username} className="h-11 w-11 object-cover rounded-full" />
                    ) : (
                        <span className="h-11 w-11 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">{user.username[0]}</span>
                    )}
                </span>
                <span className="font-medium">{user.username}</span>
            </button>
            {isOpen && (
                <Dropdown onClose={() => setIsOpen(false)}>
                    <DropdownItem onClick={handleLogout}>Вийти</DropdownItem>
                </Dropdown>
            )}
        </div>
    );
}
