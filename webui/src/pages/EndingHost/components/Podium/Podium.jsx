import "./styles.sass";
import {motion} from "framer-motion";
import {getCharacterEmoji} from "@/common/data/characters";

const ORDER = [1, 0, 2];
const HEIGHTS = {0: "20rem", 1: "15rem", 2: "11rem"};
const RANK_COLORS = {
    0: {bg: "#FFD23F", medal: "#FFB800", text: "#3a2500"},
    1: {bg: "#D8DBE2", medal: "#B8BDC7", text: "#2a2f3a"},
    2: {bg: "#E89A5E", medal: "#C77A3E", text: "#3a1f08"}
};

export const Podium = ({scoreboard, analytics, totalQuestions}) => {
    const sorted = [...scoreboard].sort((a, b) => b.points - a.points).slice(0, 3);

    const findAnalytics = (player) => {
        if (!analytics || !analytics.studentAnalytics) return null;
        return analytics.studentAnalytics.find(s => s.name === player.name) || null;
    };

    return (
        <div className="podium">
            {ORDER.map((rankIndex, displayIdx) => {
                const player = sorted[rankIndex];
                if (!player) return <div key={`empty-${rankIndex}`} className="podium-slot podium-empty"/>;
                const stats = findAnalytics(player);
                const rank = rankIndex + 1;
                const colors = RANK_COLORS[rankIndex];
                const delay = 0.4 + displayIdx * 0.35;

                return (
                    <div key={player.name} className={`podium-slot podium-rank-${rank}`}>
                        <motion.div
                            className="podium-head"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.4, delay: delay + 0.25, ease: "easeOut"}}
                        >
                            <span className="podium-character">{getCharacterEmoji(player.character)}</span>
                            <h2>{player.name}</h2>
                        </motion.div>

                        <motion.div
                            className="podium-medal"
                            style={{background: colors.medal, color: colors.text}}
                            initial={{scale: 0, rotate: -180}}
                            animate={{scale: 1, rotate: 0}}
                            transition={{duration: 0.6, delay: delay + 0.45, type: "spring", stiffness: 180, damping: 14}}
                        >
                            {rank}
                        </motion.div>

                        <motion.div
                            className="podium-body"
                            style={{background: colors.bg, color: colors.text, height: HEIGHTS[rankIndex]}}
                            initial={{height: 0}}
                            animate={{height: HEIGHTS[rankIndex]}}
                            transition={{duration: 0.7, delay, ease: [0.22, 1, 0.36, 1]}}
                        >
                            <motion.div
                                className="podium-body-content"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3, delay: delay + 0.55}}
                            >
                                <div className="podium-points">
                                    <strong>{player.points.toLocaleString()}</strong>
                                    <span>Punkte</span>
                                </div>
                                {stats && (
                                    <div className="podium-accuracy">
                                        {stats.correctAnswers} von {totalQuestions || stats.totalAnswered} richtig
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
};