import {useCallback, useRef, useState} from "react";

const MAX_HISTORY = 50;

export const useUndoRedo = (initialState) => {
    const [current, setCurrent] = useState(initialState);
    const pastRef = useRef([]);
    const futureRef = useRef([]);
    const [, forceRender] = useState(0);
    const skipSnapshotRef = useRef(false);

    const set = useCallback((updater) => {
        setCurrent(prev => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            if (!skipSnapshotRef.current) {
                pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), structuredClone(prev)];
                futureRef.current = [];
            }
            skipSnapshotRef.current = false;
            return next;
        });
        forceRender(v => v + 1);
    }, []);

    const silentSet = useCallback((updater) => {
        skipSnapshotRef.current = true;
        set(updater);
    }, [set]);

    const undo = useCallback(() => {
        if (pastRef.current.length === 0) return;
        setCurrent(prev => {
            const previous = pastRef.current.at(-1);
            pastRef.current = pastRef.current.slice(0, -1);
            futureRef.current = [...futureRef.current, structuredClone(prev)];
            return previous;
        });
        forceRender(v => v + 1);
    }, []);

    const redo = useCallback(() => {
        if (futureRef.current.length === 0) return;
        setCurrent(prev => {
            const next = futureRef.current.at(-1);
            futureRef.current = futureRef.current.slice(0, -1);
            pastRef.current = [...pastRef.current, structuredClone(prev)];
            return next;
        });
        forceRender(v => v + 1);
    }, []);

    const canUndo = pastRef.current.length > 0;
    const canRedo = futureRef.current.length > 0;

    const clearHistory = useCallback(() => {
        pastRef.current = [];
        futureRef.current = [];
        forceRender(v => v + 1);
    }, []);

    return {current, set, silentSet, undo, redo, canUndo, canRedo, clearHistory};
};
