import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {useState, useRef, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {createPortal} from "react-dom";

export const SelectBox = ({value, onChange, options, placeholder = "Auswählen...", disabled = false}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const selectRef = useRef(null);
    const dropdownRef = useRef(null);

    const updatePosition = useCallback(() => {
        if (!selectRef.current) return;
        const rect = selectRef.current.getBoundingClientRect();
        setDropdownStyle({
            position: 'fixed',
            bottom: window.innerHeight - rect.top,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleScroll = (event) => {
            if (dropdownRef.current && dropdownRef.current.contains(event.target)) return;
            setIsOpen(false);
        };

        const handleResize = () => setIsOpen(false);

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const getSelectedOption = () => {
        return options.find(option => option.value === value);
    };

    const handleOptionClick = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (disabled) return;
        if (!isOpen) updatePosition();
        setIsOpen(!isOpen);
    };

    const selectedOption = getSelectedOption();

    return (
        <div className={`select-box ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`} ref={selectRef}>
            <div
                className={`select-trigger ${isOpen ? 'open' : ''}`}
                onClick={handleToggle}
            >
                <div className="select-content">
                    {selectedOption ? (
                        <div className="selected-option">
                            {selectedOption.icon && (
                                <FontAwesomeIcon icon={selectedOption.icon} className="option-icon"/>
                            )}
                            <span className="option-label">{selectedOption.label}</span>
                        </div>
                    ) : (
                        <span className="placeholder">{placeholder}</span>
                    )}
                </div>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`select-arrow ${isOpen ? 'rotated' : ''}`}
                />
            </div>

            {createPortal(
                <AnimatePresence>
                    {isOpen && !disabled && (
                        <motion.div
                            ref={dropdownRef}
                            className="select-dropdown"
                            style={dropdownStyle}
                            initial={{opacity: 0, y: 10, scale: 0.95}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            exit={{opacity: 0, y: 10, scale: 0.95}}
                            transition={{duration: 0.2}}
                        >
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    className={`select-option ${value === option.value ? 'selected' : ''}`}
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    {option.icon && (
                                        <FontAwesomeIcon icon={option.icon} className="option-icon"/>
                                    )}
                                    <div className="option-content">
                                        <span className="option-label">{option.label}</span>
                                        {option.description && (
                                            <span className="option-description">{option.description}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};