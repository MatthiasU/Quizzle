import {useState, useRef, useCallback} from "react";
import {generateUuid} from "@/common/utils/UuidUtil.js";
import toast from "react-hot-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";

export const useAIGeneration = ({setQuestions, setActiveQuestion}) => {
    const [generating, setGenerating] = useState(false);
    const abortRef = useRef(null);

    const stop = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
    }, []);

    const generate = useCallback(async (topic, questionCount) => {
        if (!topic.trim() || generating) return;

        setGenerating(true);

        const controller = new AbortController();
        abortRef.current = controller;
        let isFirstQuestion = true;

        const renderToast = (msg, count) => (
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <span>{msg}{count > 0 ? ` (${count})` : ''}</span>
                <button
                    onClick={() => stop()}
                    style={{
                        background: 'none', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '0.4rem',
                        padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                        color: '#EC5555', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif'
                    }}
                >Stopp
                </button>
            </div>
        );

        const toastId = toast.loading(renderToast("KI generiert Fragen...", 0), {
            icon: <FontAwesomeIcon icon={faWandMagicSparkles} style={{color: '#8B5CF6'}}/>,
            duration: Infinity
        });

        try {
            const body = {topic: topic.trim()};
            if (questionCount && questionCount >= 1 && questionCount <= 50) body.questionCount = questionCount;

            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
                signal: controller.signal
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Fehler bei der Generierung.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let count = 0;

            while (true) {
                const {done: readerDone, value} = await reader.read();
                if (readerDone) break;

                buffer += decoder.decode(value, {stream: true});
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith('data: ')) continue;

                    try {
                        const event = JSON.parse(trimmed.slice(6));

                        if (event.type === 'question') {
                            const q = event.data;
                            const newQuestion = {
                                uuid: q.uuid || generateUuid(),
                                title: q.title,
                                type: q.type,
                                answers: q.answers || []
                            };

                            setQuestions(prev => {
                                const hasContent = prev.length > 1 || prev[0]?.title !== "" || prev[0]?.answers?.length > 0;
                                if (isFirstQuestion && !hasContent) {
                                    isFirstQuestion = false;
                                    return [newQuestion];
                                }
                                isFirstQuestion = false;
                                return [...prev, newQuestion];
                            });

                            setActiveQuestion(newQuestion.uuid);
                            count++;
                            toast.loading(renderToast("KI generiert Fragen...", count), {
                                id: toastId,
                                icon: <FontAwesomeIcon icon={faWandMagicSparkles} style={{color: '#8B5CF6'}}/>
                            });
                        } else if (event.type === 'error') {
                            throw new Error(event.message);
                        }
                    } catch (e) {
                        if (e.message && !e.message.includes('JSON')) throw e;
                    }
                }
            }

            toast.success(`${count} Frage${count !== 1 ? 'n' : ''} generiert!`, {id: toastId});
        } catch (e) {
            if (e.name !== 'AbortError') {
                toast.error(e.message || "Fehler bei der KI-Generierung.", {id: toastId});
            } else {
                toast.dismiss(toastId);
            }
        }

        setGenerating(false);
        abortRef.current = null;
    }, [generating, stop, setQuestions, setActiveQuestion]);

    return {generating, generate, stop};
};
