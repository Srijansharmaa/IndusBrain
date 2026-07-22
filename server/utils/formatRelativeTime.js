const UNITS = [
    { label: "yr", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
];

/**
 * Formats a Date as a short relative string, e.g. "12 min ago", "2 hr ago".
 * Falls back to "just now" for anything under a minute.
 */
const formatRelativeTime = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) {
        return "just now";
    }

    for (const unit of UNITS) {
        const value = Math.floor(seconds / unit.seconds);
        if (value >= 1) {
            return `${value} ${unit.label}${value > 1 && unit.label !== "min" && unit.label !== "hr" ? "s" : ""} ago`;
        }
    }

    return "just now";
};

export default formatRelativeTime;
