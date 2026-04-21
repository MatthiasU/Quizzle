import {useEffect, useState} from "react";
import {DEFAULT_HOST_BACKGROUND, getHostBackground} from "@/common/data/hostBackgrounds";

const STORAGE_KEY = "quizzle_host_bg";
const EVENT = "quizzle-host-bg-change";

export const getStoredHostBackgroundId = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_HOST_BACKGROUND;
    } catch {
        return DEFAULT_HOST_BACKGROUND;
    }
};

export const setStoredHostBackgroundId = (id) => {
    try {
        localStorage.setItem(STORAGE_KEY, id);
        window.dispatchEvent(new CustomEvent(EVENT, {detail: id}));
    } catch {
        // ignore
    }
};

export const useHostBackground = () => {
    const [id, setId] = useState(() => getStoredHostBackgroundId());

    useEffect(() => {
        const handler = (e) => setId(e.detail || getStoredHostBackgroundId());
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, []);

    return [id, setStoredHostBackgroundId, getHostBackground(id)];
};
