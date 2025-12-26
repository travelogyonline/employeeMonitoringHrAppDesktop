import React from "react";

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

function formatBirthday(dob) {
    if (!dob) return "-";

    const date = new Date(dob);
    const day = date.getDate();
    const month = date.toLocaleString("en-IN", { month: "long" });
    const suffix = getDaySuffix(day);

    return (
        <span>
            {day}
            <sup style={{ fontSize: "0.65em", marginLeft: 1 }}>
                {suffix}
            </sup>{" "}
            {month}
        </span>
    );
}

export default formatBirthday;
