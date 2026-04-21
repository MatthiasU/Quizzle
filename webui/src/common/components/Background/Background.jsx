import "./styles.sass";
import {motion} from "framer-motion";
import {useHostBackground} from "@/common/hooks/useHostBackground";

export const Background = ({positionCircle, variant = 'default'}) => {
    const [, , hostBg] = useHostBackground();

    if (variant === 'host') {
        return (
            <div className="background-container host-bg">
                <div
                    className="host-bg-image"
                    style={{backgroundImage: `url(${hostBg.image})`}}
                />
                <div className="host-bg-overlay"/>
            </div>
        );
    }

    return (
        <div className="background-container">
            <div className="gradient-background"/>

            <motion.div
                className="circle-tl"
                animate={{
                    inset: positionCircle,
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    inset: {duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55]},
                    scale: {duration: 6, repeat: Infinity, ease: "easeInOut"}
                }}
            />

            <motion.div
                className="rect-br"
                animate={{
                    right: ["-25rem", "-9rem"],
                    bottom: ["-25rem", "-9rem"],
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
                transition={{duration: 12, repeat: Infinity, ease: "easeInOut"}}/>

            <motion.div
                className="dancing-diamond"
                animate={{
                    x: [0, 40, -30, 0],
                    y: [0, -30, 20, 0],
                    rotate: [0, 45, -45, 90, 0],
                    scale: [1, 1.4, 0.8, 1.2, 1],
                }}
                transition={{duration: 7, repeat: Infinity, ease: "easeInOut"}}/>
        </div>
    );
}