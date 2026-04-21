import "./styles.sass";
import {motion} from "framer-motion";

export const Question = ({title, image}) => {
    return (
        <>
            {!image && <motion.div className="question-container" initial={{y: -40, opacity: 0}} animate={{y: 0, opacity: 1}}>
                <div className="question">
                    <h1>{title}</h1>
                </div>
            </motion.div>}
            {image && <motion.div className="image-question-container" initial={{y: -40, opacity: 0}} animate={{y: 0, opacity: 1}}>
                <div className="image-question">
                    <h1>{title}</h1>
                </div>
                <img src={image} alt={title} />
            </motion.div>}
        </>
    );
}