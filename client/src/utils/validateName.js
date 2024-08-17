export const validateName = (value) =>
    value
      .trimStart()
      .replace(/[^a-zA-Z\s]/g, "")
      .replace("  ", " ");