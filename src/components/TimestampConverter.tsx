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
            <p className={`text-center mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Convert Unix timestamps to human-readable dates and times.
            </p>
            <input
                type="text"
                value={timestamp}
                onChange={handleChange}
                className={`border-2 px-2 py-1 rounded w-full shadow-sm outline-none transition-all duration-200
                    ${isDarkMode
                    ? "border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400"
                    : "border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-500 focus:ring-blue-200"
                }
                    focus:ring-2`}
                placeholder="Enter timestamp (e.g., 1625097600)"
            />
            {datetime && (
                <p className={`mt-2 font-bold ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                    {datetime}
                </p>
            )}
        </div>
    );
}