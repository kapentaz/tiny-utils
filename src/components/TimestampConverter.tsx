import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function TimestampConverter({ isDarkMode = false }: { isDarkMode?: boolean } = {}) {
    const [timestamp, setTimestamp] = useState<string>("");
    const [datetime, setDatetime] = useState<string>("");

    useEffect(() => {
        const currentTimestamp = Math.floor(Date.now() / 1000).toString();
        setTimestamp(currentTimestamp);
        setDatetime(dayjs.unix(Number(currentTimestamp)).format("YYYY-MM-DD HH:mm:ss"));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTimestamp(value);

        if (!value) {
            setDatetime("");
            return;
        }

        const numValue = Number(value);
        if (isNaN(numValue)) {
            setDatetime("Invalid timestamp");
            return;
        }

        // Check if the timestamp is in seconds (10 digits) or milliseconds (13 digits)
        const date = numValue.toString().length === 10 
            ? dayjs.unix(numValue) 
            : dayjs(numValue);

        if (!date.isValid()) {
            setDatetime("Invalid timestamp");
            return;
        }

        setDatetime(date.format("YYYY-MM-DD HH:mm:ss"));
    };

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-2 text-center">⏰ Unix Timestamp Converter</h2>
            <p className="text-center text-gray-600 mb-6">
                Convert Unix timestamps to human-readable dates and times. Enter a Unix timestamp to see its corresponding date and time.
            </p>
            <input
                type="text"
                value={timestamp}
                onChange={handleChange}
                className="border-2 border-gray-300 px-2 py-1 rounded w-full bg-white text-black shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                placeholder="Enter timestamp (e.g., 1625097600)"
            />
            {datetime && <p className="mt-2 text-green-700 font-bold">{datetime}</p>}
        </div>
    );
}