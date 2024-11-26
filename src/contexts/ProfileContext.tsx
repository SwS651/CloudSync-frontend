import { useContext, useState,createContext, ReactNode } from "react";
import { getFirebaseAuth } from "../firebase";
import React from "react";
type ProfileContextType = {
    profile: { displayName: string; email: string };
    updateProfile: (updatedProfile: { displayName: string; email: string }) => void;
};
const ProfileContext = createContext<ProfileContextType>({
    
    profile: { displayName: "", email: "" },
    updateProfile: () => {}, // No-op function as a placeholder
});
const auth = await getFirebaseAuth()
export const ProfileProvider = ({ children }: { children: ReactNode }) => {

    const user = auth?.currentUser;

    const [profile, setProfile] = useState({
        displayName: user?.displayName || "",
        email: user?.email || "",
    });

    const updateProfile = (updatedProfile: { displayName: string; email: string }) => {
        setProfile((prev) => ({ ...prev, ...updatedProfile }));
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);