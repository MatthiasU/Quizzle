import "./styles.sass";

export const AnswerContent = ({answer, index, className = "answer-content"}) => {
    if (answer.type === "image") {
        return (
            <img
                src={answer.content}
                alt={`Antwort ${index + 1}`}
                className={`${className}-image`}
            />
        );
    }
    return (
        <span className={`${className}-text`}>
            {answer.content}
        </span>
    );
};
