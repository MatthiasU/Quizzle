import {motion} from "framer-motion";
import "./styles.sass";

export const Background = () => {
    return (
        <div className="background-container">
            <div className="gradient-background"/>

            <motion.div
                className="circle-tl"
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    scale: {duration: 6, repeat: Infinity, ease: "easeInOut"}
                }}
            />

            <motion.div
                className="rect-br"
                animate={{
                    rotate: [55, 75, 45, 65],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    rotate: {duration: 10, repeat: Infinity, ease: "easeInOut"},
                    scale: {duration: 8, repeat: Infinity, ease: "easeInOut"}
                }}
            />

            <motion.div
                className="accent-circle-1"
                animate={{
                    scale: [1, 1.3, 0.8, 1.1],
                    rotate: [0, 360],
                    x: [0, 30, -20, 0],
                    y: [0, -20, 20, 0],
                }}
                transition={{duration: 15, repeat: Infinity, ease: "easeInOut"}}
            />

            <motion.div
                className="accent-circle-2"
                animate={{
                    scale: [1, 0.7, 1.2, 1],
                    x: [0, -40, 30, 0],
                    y: [0, 25, -15, 0],
                    rotate: [0, -180, 180, 0],
                }}
                transition={{duration: 12, repeat: Infinity, ease: "easeInOut"}}
            />

            <motion.div
                className="dancing-diamond"
                animate={{
                    x: [0, 40, -30, 0],
                    y: [0, -30, 20, 0],
                    rotate: [0, 45, -45, 90, 0],
                    scale: [1, 1.4, 0.8, 1.2, 1],
                }}
                transition={{duration: 7, repeat: Infinity, ease: "easeInOut"}}
            />
        </div>
    );
};
