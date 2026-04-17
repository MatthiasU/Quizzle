import {createContext, useEffect, useState} from "react";
import {jsonRequest} from "@/common/utils/RequestUtil.js";
import Loading from "@/pages/Loading";
import SetupWizard from "@/common/components/SetupWizard";
export const BrandingContext = createContext({});

export const BrandingProvider = ({children}) => {
    const [branding, setBranding] = useState({});
    const [showSetup, setShowSetup] = useState(false);

    const updateBranding = () => {
        jsonRequest("/branding")
            .then((data) => {
                setBranding(data);
                if (data.setupComplete === false) {
                    setShowSetup(true);
                }
            })
            .catch(() => setTimeout(updateBranding, 5000));
    }

    useEffect(() => {
        document.documentElement.style.setProperty("--primary-color", "#6547EE");
        setTimeout(updateBranding, 1300);
    }, []);

    useEffect(() => {
        if (!branding) return;

        document.title = branding.name || "Quizzle";

        const primaryColor = branding.color;

        if (primaryColor) {
            document.documentElement.style.setProperty("--primary-color", primaryColor);
        }

        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) favicon.href = "data:image/png;base64," + branding.logo;
    }, [branding]);

    const handleSetupComplete = () => {
        window.location.reload();
    };

    return (
        <BrandingContext.Provider value={{...branding, titleImg: "data:image/png;base64," + branding.title,
            logoImg: "data:image/png;base64," + branding.logo, refreshBranding: updateBranding}}>
            {Object.keys(branding).length < 1 && <Loading />}
            {Object.keys(branding).length >= 1 && showSetup && <SetupWizard onComplete={handleSetupComplete}/>}
            {Object.keys(branding).length >= 1 && children}
        </BrandingContext.Provider>
    );
}