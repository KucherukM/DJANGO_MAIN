import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import * as React from "react";
import {Link, Outlet} from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetUserQuery, useTestAuthQuery } from "../../services/apiAuth";
import {APP_ENV} from "../../env";

const navigation = [
    { name: 'Dashboard', href: '/', current: true },
    { name: 'Додати', href: '/categories/create', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
    { name: 'Reports', href: '#', current: false },
]
const userNavigation = [
    { name: 'Профіль', href: '/profile' },
    { name: 'Налаштування', href: '#' },
    { name: 'Sign out', href: '#' },
]

//@ts-ignore
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Layout : React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Отримуємо інформацію про користувача
    const { data: user, isLoading: isLoadingUser, error: userError } = useGetUserQuery(undefined, {
        skip: !accessToken,
    });

    // Тестовий запит для діагностики
    const { data: testAuthData, error: testAuthError } = useTestAuthQuery(undefined, {
        skip: !accessToken,
    });

    // Перевіряємо авторизацію при завантаженні
    useEffect(() => {
        const token = localStorage.getItem('access');
        setIsAuthenticated(!!token);
        setAccessToken(token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
        setAccessToken(null);
    };

    // Функція для тестування доступності фотографії
    const testPhotoUrl = async (url: string) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    // Функція для відкриття фотографії в новій вкладці
    const openPhotoInNewTab = (url: string) => {
        window.open(url, '_blank');
    };

    // Функція для відображення аватара користувача
    const renderUserAvatar = (size: 'sm' | 'md' = 'sm') => {
        const sizeClasses = size === 'sm' ? 'size-8' : 'size-10';
        
        if (user?.photo && !userError && user.photo !== '' && user.photo !== null) {
            // Формуємо повний URL для фотографії
            const photoUrl = user.photo.startsWith('http') ? user.photo : `${APP_ENV.API_BASE_URL}${user.photo}`;
            
            return (
                <div className={`${sizeClasses} rounded-full relative`}>
                    <img 
                        src={photoUrl} 
                        alt={user.username}
                        className={`${sizeClasses} rounded-full object-cover`}
                        onError={(e) => {
                            // Якщо фото не завантажується, показуємо fallback
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // Показуємо fallback аватар
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                                fallback.style.display = 'flex';
                            }
                        }}
                        onLoad={() => {
                            // Photo loaded successfully
                        }}
                    />
                    {/* Fallback avatar */}
                    <div 
                        className={`${sizeClasses} rounded-full bg-gray-600 flex items-center justify-center absolute top-0 left-0`}
                        style={{ display: 'none' }}
                    >
                        <span className="text-white text-sm font-medium">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>
            );
        }
        
        return (
            <div className={`${sizeClasses} rounded-full bg-gray-600 flex items-center justify-center`}>
                <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
            </div>
        );
    };

    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <img
                                        alt="Your Company"
                                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                        className="size-8"
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                aria-current={item.current ? 'page' : undefined}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium',
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    {isAuthenticated ? (
                                        <>
                                            <button
                                                type="button"
                                                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                            >
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon aria-hidden="true" className="size-6" />
                                            </button>

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">Open user menu</span>
                                                        {renderUserAvatar('sm')}
                                                    </MenuButton>
                                                </div>
                                                <MenuItems
                                                    transition
                                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                >
                                                    {userNavigation.map((item) => (
                                                        <MenuItem key={item.name}>
                                                            {item.name === 'Sign out' ? (
                                                                <button
                                                                    onClick={handleLogout}
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                                                >
                                                                    {item.name}
                                                                </button>
                                                            ) : (
                                                                <Link
                                                                    to={item.href}
                                                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            )}
                                                        </MenuItem>
                                                    ))}
                                                </MenuItems>
                                            </Menu>
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-4">
                                            <Link
                                                to="/login"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                            >
                                                Увійти
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-md px-3 py-2 text-sm font-medium"
                                            >
                                                Реєстрація
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium',
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                        {isAuthenticated ? (
                            <div className="border-t border-gray-700 pt-4 pb-3">
                                <div className="flex items-center px-5">
                                    <div className="shrink-0">
                                        {renderUserAvatar('md')}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base/5 font-medium text-white">{user?.username || 'Користувач'}</div>
                                        <div className="text-sm font-medium text-gray-400">{user?.username || 'user@example.com'}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon aria-hidden="true" className="size-6" />
                                    </button>
                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    {userNavigation.map((item) => (
                                        <DisclosureButton
                                            key={item.name}
                                            as={item.name === 'Sign out' ? 'button' : Link}
                                            onClick={item.name === 'Sign out' ? handleLogout : undefined}
                                            to={item.name !== 'Sign out' ? item.href : undefined}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            {item.name}
                                        </DisclosureButton>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-gray-700 pt-4 pb-3">
                                <div className="space-y-1 px-2">
                                    <DisclosureButton
                                        as={Link}
                                        to="/login"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        Увійти
                                    </DisclosureButton>
                                    <DisclosureButton
                                        as={Link}
                                        to="/register"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        Реєстрація
                                    </DisclosureButton>
                                </div>
                            </div>
                        )}
                    </DisclosurePanel>
                </Disclosure>


                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    )
}

export default Layout;