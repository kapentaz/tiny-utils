import { useState, useEffect } from "react";
import dayjs from "dayjs";

type FormatTypes = {
  "JavaScript (Day.js)": string[];
  "Java (SimpleDateFormat)": string[];
  "Python (strftime)": string[];
  "SQL": string[];
};

const FORMAT_TYPES: FormatTypes = {
  "JavaScript (Day.js)": [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "MM-DD-YYYY",
    "DD-MM-YYYY",
    "YYYY.MM.DD",
    "MM/DD/YYYY",
    "ddd, MMM D, YYYY",
    "hh:mm A",
    "HH:mm",
    "HH:mm:ss",
    "HH:mm:ss.SSS",
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DD HH:mm:ss",
    "YYYY-MM-DD HH:mm:ss.SSS",
    "dddd, MMMM D, YYYY h:mm A",
    "YYYY-MM-DDTHH:mm:ssZ",
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  ],
  "Java (SimpleDateFormat)": [
    "yyyy-MM-dd",
    "yyyy/MM/dd",
    "MM-dd-yyyy",
    "dd-MM-yyyy",
    "yyyy.MM.dd",
    "MM/dd/yyyy",
    "EEE, MMM d, yyyy",
    "hh:mm a",
    "HH:mm",
    "HH:mm:ss",
    "HH:mm:ss.SSS",
    "yyyy-MM-dd HH:mm",
    "yyyy-MM-dd HH:mm:ss",
    "yyyy-MM-dd HH:mm:ss.SSS",
    "EEEE, MMMM d, yyyy h:mm a",
    "yyyy-MM-dd'T'HH:mm:ssZ",
    "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
  ],
  "Python (strftime)": [
    "%Y-%m-%d",
    "%Y/%m/%d",
    "%m-%d-%Y",
    "%d-%m-%Y",
    "%Y.%m.%d",
    "%m/%d/%Y",
    "%a, %b %d, %Y",
    "%I:%M %p",
    "%H:%M",
    "%H:%M:%S",
    "%H:%M:%S.%f",
    "%Y-%m-%d %H:%M",
    "%Y-%m-%d %H:%M:%S",
    "%Y-%m-%d %H:%M:%S.%f",
    "%A, %B %d, %Y %I:%M %p",
    "%Y-%m-%dT%H:%M:%S%z",
    "%Y-%m-%dT%H:%M:%S.%f%z"
  ],
  "SQL": [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "MM-DD-YYYY",
    "DD-MM-YYYY",
    "YYYY.MM.DD",
    "MM/DD/YYYY",
    "DY, MON DD, YYYY",
    "HH:MI AM",
    "HH24:MI",
    "HH24:MI:SS",
    "HH24:MI:SS.FF3",
    "YYYY-MM-DD HH24:MI",
    "YYYY-MM-DD HH24:MI:SS",
    "YYYY-MM-DD HH24:MI:SS.FF3",
    "DAY, MONTH DD, YYYY HH:MI AM",
    "YYYY-MM-DD\"T\"HH24:MI:SS\"TZH:TZM\"",
    "YYYY-MM-DD\"T\"HH24:MI:SS.FF3\"TZH:TZM\""
  ]
};

interface DateFormatterPreviewProps {
  isDarkMode: boolean;
}

export default function DateFormatterPreview({ isDarkMode }: DateFormatterPreviewProps) {
  const [selectedTab, setSelectedTab] = useState<keyof FormatTypes>("JavaScript (Day.js)");
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  useEffect(() => {
    const updateFormats = () => {
      const now = dayjs();
      const formats = FORMAT_TYPES[selectedTab];

      if (selectedTab === "JavaScript (Day.js)") {
        setFormattedDates(
          formats.map((fmt: string) => 
            `<div class="flex justify-between items-center">
              <span class="font-bold mr-4">${fmt}</span>
              <span class="${isDarkMode ? 'text-blue-300' : 'text-blue-600'}">${now.format(fmt)}</span>
             </div>`
          )
        );
        return;
      }

      const formatted = formats.map((fmt: string) => {
        let dayJsFormat = fmt;
        if (selectedTab === "Java (SimpleDateFormat)") {
          dayJsFormat = fmt
            .replace(/yyyy/g, "YYYY")
            .replace(/yy/g, "YY")
            .replace(/MM/g, "MM")
            .replace(/dd/g, "DD")
            .replace(/d(?!d)/g, "D")
            .replace(/HH/g, "HH")
            .replace(/hh/g, "hh")
            .replace(/h(?!h)/g, "h")
            .replace(/mm/g, "mm")
            .replace(/ss/g, "ss")
            .replace(/a/g, "A")
            .replace(/MMMM/g, "MMMM")
            .replace(/MMM/g, "MMM")
            .replace(/EEEE/g, "dddd")
            .replace(/E{1,3}/g, "ddd");
        } else if (selectedTab === "Python (strftime)") {
          dayJsFormat = fmt
            .replace(/%Y/g, "YYYY")
            .replace(/%m/g, "MM")
            .replace(/%d/g, "DD")
            .replace(/%H/g, "HH")
            .replace(/%I/g, "hh")
            .replace(/%M/g, "mm")
            .replace(/%S/g, "ss")
            .replace(/%f/g, "SSS")
            .replace(/%z/g, "Z")
            .replace(/%a/g, "ddd")
            .replace(/%A/g, "dddd")
            .replace(/%b/g, "MMM")
            .replace(/%B/g, "MMMM")
            .replace(/%p/g, "A");
        } else if (selectedTab === "SQL") {
          dayJsFormat = fmt
            // 시간 포맷 (긴 패턴을 먼저 처리)
            .replace(/HH24:MI:SS.FF3/g, "HH:mm:ss.SSS")
            .replace(/HH24:MI:SS/g, "HH:mm:ss")
            .replace(/HH24:MI/g, "HH:mm")
            .replace(/HH24/g, "HH")
            .replace(/HH:MI AM/g, "hh:mm A")
            .replace(/HH:MI/g, "hh:mm")
            .replace(/MI/g, "mm")
            .replace(/SS/g, "ss")
            // 날짜 포맷
            .replace(/YYYY/g, "YYYY")
            .replace(/MM/g, "MM")
            .replace(/DD/g, "DD")
            // 요일과 월 이름 (긴 패턴을 먼저 처리)
            .replace(/MONTH/g, "MMMM")
            .replace(/MON/g, "MMM")
            .replace(/DAY/g, "dddd")
            .replace(/DY/g, "ddd")
            .replace(/ AM/g, " A")
            // ISO 8601 형식 처리
            .replace(/\"T\"/g, "T")
            .replace(/\"TZH:TZM\"/g, "Z");
        }

        return `<div class="flex justify-between items-center">
                  <span class="font-bold mr-4">${fmt}</span>
                  <span class="${isDarkMode ? 'text-blue-300' : 'text-blue-600'}">${now.format(dayJsFormat)}</span>
                </div>`;
      });

      setFormattedDates(formatted);
    };

    updateFormats();
    const interval = setInterval(updateFormats, 1000);
    return () => clearInterval(interval);
  }, [selectedTab]);

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">📅 Date Format Preview</h2>
      <p className="text-center text-gray-600 mb-6">
        Preview date and time formats for different programming languages. Select a language to see its supported formats.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {(Object.keys(FORMAT_TYPES) as Array<keyof FormatTypes>).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1 rounded text-sm ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ul className={`p-4 rounded text-sm font-mono border overflow-auto whitespace-pre-wrap max-w-3xl space-y-2 ${
        isDarkMode
          ? "bg-gray-800 text-gray-100 border-gray-600"
          : "bg-gray-50 text-gray-800 border-gray-300"
      }`}>
        {formattedDates.map((line, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </ul>
    </div>
  );
}