import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faForward, faHouse, faArrowUp, faArrowDown, faBolt, faTrophy} from "@fortawesome/free-solid-svg-icons";
import Button from "@/common/components/Button";
import {useEffect, useRef, useState} from "react";
import {getCharacterEmoji} from "@/common/data/characters";
import {useSoundManager} from "@/common/utils/SoundManager.js";
import AnimatedCounter from "@/pages/InGameHost/components/AnimatedCounter";

export const Scoreboard = ({scoreboard, nextQuestion, isEnd}) => {
    const prevRanksRef = useRef({});
    const [animatedPlayers, setAnimatedPlayers] = useState([]);
    const [reveal, setReveal] = useState(false);
    const [pointsAnimationPhase, setPointsAnimationPhase] = useState('initial');
    const soundManager = useSoundManager();
    const hasPlayedSoundRef = useRef(false);

    const goHome = () => {
        location.reload();
    }

    const sorted = [...scoreboard].sort((a, b) => b.points - a.points);

    useEffect(() => {
        let isMounted = true;
        const timeouts = [];
        let soundInterval;
        
        const prevRanks = prevRanksRef.current;
        const withChanges = sorted.map((player, index) => {
            const prevRank = prevRanks[player.name];
            const currentRank = index + 1;
            const positionChange = prevRank !== undefined ? prevRank - currentRank : 0;

            const previousPoints = player.points - (player.lastRoundPoints || 0);
            return { ...player, rank: currentRank, positionChange, previousPoints };
        });

        const hasRoundPoints = withChanges.some(p => (p.lastRoundPoints || 0) > 0);

        setAnimatedPlayers(withChanges);
        setPointsAnimationPhase('initial');
        hasPlayedSoundRef.current = false;

        timeouts.push(setTimeout(() => {
            if (isMounted) setReveal(true);
        }, 100));

        timeouts.push(setTimeout(() => {
            if (isMounted) setPointsAnimationPhase('flying');
        }, 400));

        timeouts.push(setTimeout(() => {
            if (!isMounted) return;
            setPointsAnimationPhase('counting');
            if (hasRoundPoints && !hasPlayedSoundRef.current) {
                hasPlayedSoundRef.current = true;
                soundManager.playFeedback('POINTS_ADD');
                let playCount = 0;
                const maxPlays = 6;
                soundInterval = setInterval(() => {
                    if (!isMounted) {
                        clearInterval(soundInterval);
                        return;
                    }
                    playCount++;
                    if (playCount < maxPlays) {
                        soundManager.playFeedback('POINTS_ADD');
                    } else {
                        clearInterval(soundInterval);
                    }
                }, 120);
            }
        }, 1000));

        const newRanks = {};
        sorted.forEach((player, i) => { newRanks[player.name] = i + 1; });
        prevRanksRef.current = newRanks;
        
        return () => {
            isMounted = false;
            timeouts.forEach(t => clearTimeout(t));
            if (soundInterval) clearInterval(soundInterval);
        };
    }, [scoreboard]);

    return (
        <div className="scoreboard">
            <div className="top-area">
                {!isEnd && <Button onClick={nextQuestion} text="Weiter"
                        padding="1rem 1.5rem" icon={faForward}/>}
                {isEnd && <Button onClick={goHome} text="Startseite"
                        padding="1rem 1.5rem" icon={faHouse}/>}
            </div>
            <h1>{isEnd ? "Endstand" : "Scoreboard"}</h1>

            <div className="scoreboard-players">
                {animatedPlayers.map((player, index) => {
                    const hasRoundPoints = (player.lastRoundPoints || 0) > 0;
                    const showFlyingPoints = hasRoundPoints && pointsAnimationPhase === 'flying';
                    const showCounting = pointsAnimationPhase === 'counting';
                    const delayMs = index * 80;
                    
                    return (
                        <div 
                            key={player.name} 
                            className={`scoreboard-player ${reveal ? 'scoreboard-player-reveal' : ''} ${index < 3 ? `scoreboard-top-${index + 1}` : ''}`}
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <div className="player-left">
                                <span className={`player-rank ${index < 3 ? 'rank-podium' : ''}`}>
                                    {index < 3 
                                        ? <FontAwesomeIcon icon={faTrophy} className={`trophy-icon trophy-${index + 1}`} />
                                        : `#${index + 1}`
                                    }
                                </span>
                                <div className="player-character">
                                    {getCharacterEmoji(player.character)}
                                </div>
                                <div className="player-name-section">
                                    <h2>{player.name}</h2>
                                    {player.positionChange !== 0 && (
                                        <span className={`position-change ${player.positionChange > 0 ? 'pos-up' : 'pos-down'}`}>
                                            <FontAwesomeIcon icon={player.positionChange > 0 ? faArrowUp : faArrowDown} />
                                            {Math.abs(player.positionChange)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="player-right">
                                {hasRoundPoints && (
                                    <span 
                                        className={`round-points ${showFlyingPoints ? 'round-points-flying' : ''} ${showCounting ? 'round-points-merged' : ''}`}
                                        style={{ animationDelay: `${delayMs}ms` }}
                                    >
                                        <FontAwesomeIcon icon={faBolt} />+{player.lastRoundPoints}
                                    </span>
                                )}
                                <h2 className="total-points">
                                    {showCounting ? (
                                        <AnimatedCounter 
                                            value={player.points}
                                            previousValue={player.previousPoints}
                                            delay={delayMs}
                                            duration={800}
                                        />
                                    ) : (
                                        player.previousPoints
                                    )}
                                </h2>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}