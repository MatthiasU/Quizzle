import {motion} from "framer-motion";
import "./styles.sass";
import {getAnswerColor, getAnswerGradient} from "@/common/utils/AnswerColorUtil.js";
import AnswerShape from "@/common/components/AnswerShape";

export const Answer = ({answer, index, questionType}) => {

    const getTextSize = (content) => {
        if (content.length <= 10) return "2.4em";
        if (content.length <= 20) return "1.7em";
        if (content.length <= 30) return "1.3em";
        return "1em";
    }

    return (
        <>
            {answer.type === "text" && (
                <motion.div className="text-answer"
                            style={{background: getAnswerGradient(answer, index, questionType)}}
                            initial={{scale: 0}} animate={{scale: 1}}
                            transition={{duration: 0.2, delay: index * 0.05}}>
                    <div className="answer-shape-wrap">
                        <AnswerShape index={index} size="2.5rem" questionType={questionType}/>
                    </div>
                    <h2 style={{fontSize: getTextSize(answer.content)}}>{answer.content}</h2>
                </motion.div>
            )}
            {answer.type === "image" && (
                <motion.div className="image-answer-wrap"
                            initial={{scale: 0}} animate={{scale: 1}}
                            transition={{duration: 0.2, delay: index * 0.05}}
                            style={{border: `6px solid ${getAnswerColor(answer, index, questionType)}`}}>
                    <div className="answer-shape-wrap image-shape"
                         style={{background: getAnswerColor(answer, index, questionType)}}>
                        <AnswerShape index={index} size="2rem" questionType={questionType}/>
                    </div>
                    <img src={answer.content} alt="Answer" className="image-answer"/>
                </motion.div>
            )}
        </>
    )
}