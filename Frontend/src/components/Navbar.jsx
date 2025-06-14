import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, File } from 'react-feather';

function Navbar() {
    return (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-center">
            <ul className="flex gap-8">
                <li>
                    <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded transition-colors ${isActive ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:bg-teal-100'}`}>
                        <FileText size={18} />
                        Send Text
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/addFile" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded transition-colors ${isActive ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:bg-teal-100'}`}>
                        <File size={18} />
                        Add File
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
