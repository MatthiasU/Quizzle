import "./styles.sass";

export const TrueFalseClient = ({onSubmit}) => {
    return (
        <div className="true-false-client" role="group" aria-label="Wahr oder Falsch">
            <button className="true-false-option true-option" onClick={() => onSubmit([0])} type="button">
                <span>Wahr</span>
            </button>
            <button className="true-false-option false-option" onClick={() => onSubmit([1])} type="button">
                <span>Falsch</span>
            </button>
        </div>
    );
};