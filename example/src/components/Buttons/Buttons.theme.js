import createTheme from "../../../../src"; // styled-variant
import shadeColor from "../../utils/shadeColor";
import { APP_TYPES } from "../../App.constants";

const appType = {
    [APP_TYPES.SOFT]: {
        borderRadius: "50px",
    },
    [APP_TYPES.HARD]: {
        borderRadius: "5px",
    },
};

const size = {
    padding: "0.7em 1em",
    fontSize: "1rem",
    small: {
        padding: "0.3em 0.7em",
        fontSize: "0.8rem",
    },
    large: {
        padding: "1em 1.2em",
        fontSize: "1.2rem",
    },
};

const isDisabled = {
    opacity: 0.4,
    cursor: "default",
    "&:focus": {},
    "&:hover": {},
    outline: "none",
};

const primary = {
    border: ({ theme }) => `5px solid ${theme.colors.primary}`,
    backgroundColor: ({ theme }) => theme.colors.white,
    color: ({ theme }) => theme.colors.secondary,
};

const variant = {
    isDisabled,
    primary: {
        ...primary,
        "&:hover": {
            borderColor: ({ theme }) => shadeColor(theme.colors.primary, -20),
        },
        "&:focus": {
            borderColor: ({ theme }) => shadeColor(theme.colors.primary, -40),
        },
        isActive: {
            backgroundColor: ({ theme }) => theme.colors.primary,
            color: ({ theme }) => theme.colors.white,
        },
        isDisabled: {
            ...primary,
            ...isDisabled,
            "&:hover": {
                cursor: "initial",
                borderColor: ({ theme }) => theme.colors.primary,
            },
            "&:focus": {
                cursor: "initial",
                borderColor: ({ theme }) => theme.colors.primary,
            },
            isPurple: {
                backgroundColor: "purple",
            },
        },
    },
    secondary: {
        border: ({ theme }) => `3px solid ${theme.colors.white}`,
        backgroundColor: "transparent",
        color: ({ theme }) => theme.colors.white,
        "&:hover": {
            borderColor: ({ theme }) => shadeColor(theme.colors.primary, -20),
        },
        "&:focus": {
            borderColor: ({ theme }) => shadeColor(theme.colors.primary, -40),
        },
    },
};

export const ButtonTheme = createTheme("Button", {
    "&:hover": {
        borderColor: ({ theme }) => theme.colors.blue,
    },
})
    .addVariant("size", size)
    .addVariant("variant", variant)
    .addGlobalVariant("appType", appType);
