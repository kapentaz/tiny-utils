import { useState } from "react";

export default function TimestampConverter() {
    const [timestamp, setTimestamp] = useState("");
    const [datetime, setDatetime] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTimestamp(value);

        const ts = parseInt(value);
        if (!isNaN(ts)) {
            const date = new Date(ts * 1000);
            setDatetime(date.toISOString().slice(0, 19).replace("T", " "));
        } else {
            setDatetime("");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Unix Timestamp 변환기</h2>
            <input
                type="text"
                value={timestamp}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
                placeholder="예: 1712900000"
            />
            {datetime && <p className="mt-2 text-green-700">📅 {datetime}</p>}
        </div>
    );
}