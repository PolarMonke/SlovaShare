import React, { useState } from 'react'

import { FiUserCheck } from "react-icons/fi";
import { FiSliders } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";
import { FiSun } from "react-icons/fi";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const toggleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
    };
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
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
                <div className="logo">Logo</div>
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
                    <div className="profile" onClick={toggleLogin}>
                    {isLoggedIn ? (
                        <FiUserCheck className="icon"/>
                        ) : (
                        <FiLogIn className="icon"/>
                    )}
                    </div>
                    
                </div>
            </div>
        </header>
    )
}