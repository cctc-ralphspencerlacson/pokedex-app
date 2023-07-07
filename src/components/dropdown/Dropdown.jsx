import React, { useState } from 'react';
import { capitalize } from '../../utils/StringUtils';
import './Dropdown.css';

const Dropdown = ({ header, options, selectedOption, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionSelect = (option) => {
        onSelect(option);
        toggleDropdown();
    }

    const toggleDropdown = () => setIsOpen(!isOpen);
    
    return (
        <div className='dropdown' onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <div className='header'>
                {selectedOption ? selectedOption.name : header}
                 <i className={`arrow ${isOpen ? 'up' : 'down'}`} />
            </div>
            {isOpen && (
                <ul className="options">
                    {options.map(({name, value}) => (
                        <li
                            key={name}
                            className={`option ${value === selectedOption?.value ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(value === selectedOption ? '' : {name, value})}
                        >
                        {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}

export default Dropdown;