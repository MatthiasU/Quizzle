import "./styles.sass";
import {useId} from "react";

export const Input = ({placeholder, onChange, value, textAlign, error, warning, maxLength, onBlur, onKeyDown, disabled, type, label}) => {
    const generatedId = useId();
    const inputId = `input-${generatedId}`;
    const errorId = `error-${generatedId}`;
    const warningId = `warning-${generatedId}`;

    const handleChange = (e) => {
        const newValue = e.target.value;
        if (maxLength && newValue.length > maxLength) return;
        if (onChange) onChange(e);
    };

    const getClassName = () => {
        let className = "custom-input";
        if (error) className += " error";
        if (warning) className += " warning";
        if (disabled) className += " disabled";
        return className;
    };

    const describedBy = [
        error ? errorId : null,
        warning && !error ? warningId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
        <div className="input-wrapper">
            {label && <label htmlFor={inputId} className="input-label">{label}</label>}
            <input
                id={inputId}
                className={getClassName()}
                type={type || "text"}
                placeholder={placeholder}
                autoComplete="off"
                data-form-type="other"
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                disabled={disabled}
                style={{textAlign: textAlign}}
                maxLength={maxLength}
                aria-invalid={!!error}
                aria-describedby={describedBy}
                aria-label={!label ? placeholder : undefined}
            />
            {maxLength && (
                <div className="character-count" aria-live="polite">
                    {(value || "").length}/{maxLength}
                </div>
            )}
            {error && <div id={errorId} className="input-error" role="alert">{error}</div>}
            {warning && !error && <div id={warningId} className="input-warning" role="status">{warning}</div>}
        </div>
    )
}