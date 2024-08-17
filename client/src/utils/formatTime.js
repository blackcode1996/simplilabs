export const formatTime = (seconds) => {
    // const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${secs} sec`;
  };