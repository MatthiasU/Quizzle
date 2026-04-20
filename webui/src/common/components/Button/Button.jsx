import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Button = ({icon, text, padding, onClick, type, disabled, ariaLabel}) => {
    const types = type ? type.split(' ') : ['default'];
    const typeClasses = types.map(t => `btn-${t}`).join(' ');
    
    return (
        <button
            type="button"
            className={`btn ${typeClasses}`}
            style={{padding: padding}}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel || text || undefined}
        >
            {icon && <FontAwesomeIcon icon={icon} aria-hidden="true"/>}
            {text}
        </button>
    )
}