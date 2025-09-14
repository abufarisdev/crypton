import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./styles.css";

function SearchableDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Search and select...", 
  searchPlaceholder = "Search...",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOption = options.find(option => option.value === value);

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className={`searchable-dropdown ${className}`} ref={dropdownRef}>
      <div 
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <div className="trigger-content">
          {selectedOption ? (
            <div className="selected-option">
              <img 
                src={selectedOption.image} 
                alt={selectedOption.label}
                className="option-image"
              />
              <div className="option-text">
                <span className="option-label">{selectedOption.label}</span>
                <span className="option-symbol">{selectedOption.symbol}</span>
              </div>
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <KeyboardArrowDownIcon 
          className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="dropdown-menu"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="search-container">
              <SearchIcon className="search-icon" />
              <input
                ref={searchRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="options-container">
              {filteredOptions.length === 0 ? (
                <div className="no-options">
                  <span>No coins found</span>
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    className={`option-item ${value === option.value ? 'selected' : ''}`}
                    onClick={() => handleSelect(option)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ backgroundColor: 'rgba(58, 128, 233, 0.1)' }}
                  >
                    <img 
                      src={option.image} 
                      alt={option.label}
                      className="option-image"
                    />
                    <div className="option-text">
                      <span className="option-label">{option.label}</span>
                      <span className="option-symbol">{option.symbol}</span>
                    </div>
                    {option.price && (
                      <span className="option-price">${option.price.toLocaleString()}</span>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchableDropdown;
