import {useContext, useEffect} from "react";
import {postRequest} from "@/common/utils/RequestUtil.js";
import {AuthContext} from "@/common/contexts/Auth";
import toast from "react-hot-toast";

export const ResultsDialog = ({isOpen, onClose, practiceCode, onSuccess}) => {
    const {isAuthenticated, requireAuth} = useContext(AuthContext);

    useEffect(() => {
        if (!isOpen) return;

        const access = async () => {
            try {
                await postRequest(`/practice/${practiceCode}/results`, {});
                onClose();
                onSuccess(practiceCode);
            } catch (error) {
                if (error.message?.includes('404')) {
                    toast.error('Übungsquiz nicht gefunden');
                } else if (error.message?.includes('401')) {
                    toast.error('Anmeldung erforderlich');
                } else {
                    toast.error('Fehler beim Laden der Ergebnisse');
                }
            }
        };

        if (isAuthenticated) {
            access();
        } else {
            requireAuth(access);
            onClose();
        }
    }, [isOpen]);

    return null;
};
