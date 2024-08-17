export const validateEmailLowerCase = (value) =>
    value.trimStart().toLowerCase().replace(" ", "");