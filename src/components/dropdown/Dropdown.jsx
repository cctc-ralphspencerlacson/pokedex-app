import React, { useState } from 'react';
import { capitalize } from '../../utils/StringUtils';
import './Dropdown.css';

const Dropdown = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        toggleDropdown();
    }

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className='dropdown' onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <div className='header'>
                {selectedOption ? capitalize(selectedOption) : 'Filter by Type'}
                 <i className={`arrow ${isOpen ? 'up' : 'down'}`} />
            </div>

            {isOpen && (
                <ul className="options">
                {options.map(({name}) => (
                    <li
                      key={name}
                      className={`option ${name === selectedOption ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(name)}
                    >
                      {capitalize(name)}
                    </li>
                ))}
                </ul>
            )}
        </div>
    )

}

export default Dropdown;