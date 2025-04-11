import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../api/i18n';

import { FiSliders, FiSearch, FiLogIn, FiMoon, FiSun, FiChevronDown, FiPlus } from "react-icons/fi";

export default function Header() {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
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
                    <input className='search-bar' placeholder={t('Search Placeholder')}></input>
                    <button className='search-button'><FiSearch className="icon"/></button>
                    <button className='filter-button'><FiSliders className="icon"/></button>
                </div>
                <div className='right-container'>
                {user && (
                    <div className='new-story-button'>
                        <Link to="/story/new">
                            <button className="story-button">
                                <FiPlus className="icon"/>
                            </button>
                        </Link>
                    </div>
                )}
                <div className="language-switcher">
                    <button 
                        className="language-button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        {i18n.language.toUpperCase()}
                        <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="language-dropdown">
                        <button 
                            onClick={() => changeLanguage('en')}
                            className={i18n.language === 'en' ? 'active' : ''}
                        >
                            English
                        </button>
                        <button 
                            onClick={() => changeLanguage('be')}
                            className={i18n.language === 'be' ? 'active' : ''}
                        >
                            Беларуская
                        </button>
                        </div>
                    )}
                </div>
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