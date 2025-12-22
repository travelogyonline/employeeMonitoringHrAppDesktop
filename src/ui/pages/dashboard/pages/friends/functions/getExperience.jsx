function getExperience(doj) {
    if (!doj) return "-";

    const start = new Date(doj);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years <= 0) return `${months} month${months !== 1 ? "s" : ""}`;
    return `${years} yr ${months} mo`;
};

export default getExperience;