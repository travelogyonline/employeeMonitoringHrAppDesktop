import React from "react";

const StatusPill = ({ status }) => {
    const isOnline = Boolean(status);

    return (
        <div
            style={{
                height: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                padding: "10px 22px 10px 14px",
                borderRadius: "999px",
                backgroundColor: "#000",
                fontFamily: "Roboto, sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "#fff",
                letterSpacing: "1px",
            }}
        >
            {/* Status dot */}
            <span
                style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: isOnline ? "#06ff00" : "#ff0000",
                    flexShrink: 0,
                }}
            />

            {/* Label */}
            <span>
                {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
        </div>
    );
};

export default StatusPill;
