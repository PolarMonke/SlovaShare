import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { FiSliders } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";
import { FiSun } from "react-icons/fi";

export default function Header() {
    const { user } = useAuth();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    React.useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }
        }, [isDarkMode]);

    return (
        <header>
            <div className="header-container">
                <div className="logo">
                <Link className="logo" to="/">SlovaShare</Link>
                </div>
                <div className="search-area">
                    <input className='search-bar'></input>
                    <button className='search-button'><FiSearch className="icon"/></button>
                    <button className='filter-button'><FiSliders className="icon"/></button>
                </div>
                <div className='right-container'>
                    <div className="theme-toggle" onClick={toggleTheme}>
                    {isDarkMode ? (
                        <FiSun className="icon"/>
                        ) : (
                        <FiMoon className="icon"/>
                    )}
                    </div>
                    <div className="profile">
                        {user ? (
                            <Link to={`/account/${user.id}`}>
                                {/* Show profile image if exists, otherwise default icon */}
                                {user.profileImage ? (
                                    <img 
                                        src={user.profileImage} 
                                        alt="Profile" 
                                        className="profile-picture"
                                    />
                                ) : (
                                    <div className="profile-initial">
                                        {user.login.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <Link to="/login">
                                <FiLogIn className="icon"/>
                            </Link>
                        )}
                    </div>
                    
                </div>
            </div>
        </header>
    )
}