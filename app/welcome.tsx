import { CustomLoginForm } from "@/components/CustomLoginForm";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

export default function WelcomeScreen() {
    return (
        <LinearGradient
            colors={["#7600C5", "#9400AA"]}
            className="items-center justify-center flex-1"
            style={{
                flex: 1,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 5,
            }}
        >
            <CustomLoginForm />
        </LinearGradient>
    );
}
