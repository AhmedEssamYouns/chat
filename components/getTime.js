const getTimeDifference = (datew) => {
    const date = new Date(datew);
    const currentDate = new Date();
    const diff = currentDate - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);
    if (years > 0) {
        return `${years} y`; // Display years if greater than 1 year
    } else if (weeks > 0) {
        return `${weeks} w`; // Display weeks if greater than 1 week
    } else if (days > 0) {
        return `${days} d`; // Display days if greater than 1 day
    } else if (hours > 0) {
        return `${hours} h`; // Display hours if greater than 1 hour
    } else if (minutes > 0) {
        return `${minutes} m`; // Display minutes if greater than 1 minute
    } else {
        return "just now"; // For differences less than a minute
    }
};

export default getTimeDifference;
