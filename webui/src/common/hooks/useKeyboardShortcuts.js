import {useEffect} from "react";

export const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handler = (e) => {
            const tag = e.target.tagName;
            const isInput = tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;

            for (const shortcut of shortcuts) {
                const ctrl = shortcut.ctrl ?? false;
                const shift = shortcut.shift ?? false;
                const alt = shortcut.alt ?? false;
                const allowInInput = shortcut.allowInInput ?? false;

                if (isInput && !allowInInput) continue;

                const ctrlMatch = (e.ctrlKey || e.metaKey) === ctrl;
                const shiftMatch = e.shiftKey === shift;
                const altMatch = e.altKey === alt;
                const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

                if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                    e.preventDefault();
                    shortcut.handler(e);
                    return;
                }
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [shortcuts]);
};
