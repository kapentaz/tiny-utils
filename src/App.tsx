import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import TimestampConverter from "./components/TimestampConverter";
import DateFormatterPreview from "./components/DateFormatterPreview";
import HtmlToPdfConverter from "./components/HtmlToPdfConverter";
import DuplicateChecker from "./components/DuplicateChecker";
import ListComparator from "./components/ListComparator";
import MarkdownPreview from "./components/MarkdownPreview";

function MainContent() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // 로컬스토리지에서 다크모드 설정을 불러옴
        const savedMode = localStorage.getItem('darkMode');
        // 저장된 값이 있으면 그 값을 사용하고, 없으면 시스템 설정을 따름
        return savedMode !== null ? savedMode === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            // 다크모드 설정을 로컬스토리지에 저장
            localStorage.setItem('darkMode', String(newMode));
            return newMode;
        });
    };

    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("timestamp");

    // URL에 따라 activeTab 설정
    useEffect(() => {
        const path = location.pathname.slice(1) || "timestamp";
        setActiveTab(path);
    }, [location]);

    // 탭 변경 시 URL 업데이트
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        navigate(`/${tab}`);
    };

    return (
        <div className="min-h-screen w-full">
            <div className={`${isDarkMode ? "bg-black text-white" : "bg-white text-black"} min-h-screen w-full transition-colors duration-300 flex flex-col items-center`}>
                {/* 다크모드 버튼 */}
                <div className="absolute top-4 right-4 flex items-center gap-4">
                    <a
                        href="mailto:kapentaz@gmail.com"
                        className="px-4 py-2 rounded border border-gray-400 text-sm"
                        title="Send email"
                    >
                        ✉️ Contact
                    </a>
                    <button
                        onClick={toggleDarkMode}
                        className="px-4 py-2 rounded border border-gray-400 text-sm"
                    >
                        {isDarkMode ? "☀️ Light Mode" : <span className="text-white">🌙 Dark Mode</span>}
                    </button>
                </div>

                {/* 콘텐츠 */}
                <div className="w-full max-w-[95%] mx-auto">
                    <div className="text-center mt-[10vh]">
                        <h1 className="text-2xl font-bold mb-4">TinyUtils</h1>
                    </div>
                    
                    <div className="mt-4">
                        {activeTab === "timestamp" && <div className="max-w-2xl mx-auto"><TimestampConverter isDarkMode={isDarkMode} /></div>}
                        {activeTab === "format" && <DateFormatterPreview isDarkMode={isDarkMode} />}
                        {activeTab === "html2pdf" && <div className="max-w-[80%] mx-auto"><HtmlToPdfConverter isDarkMode={isDarkMode} /></div>}
                        {activeTab === "duplicate" && <DuplicateChecker isDarkMode={isDarkMode} />}
                        {activeTab === "compare" && <ListComparator isDarkMode={isDarkMode} />}
                        {activeTab === "markdown" && <MarkdownPreview isDarkMode={isDarkMode} />}
                    </div>

                    <div className="flex gap-4 mt-8 justify-center">
                        <button
                            onClick={() => handleTabChange("timestamp")}
                            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === "timestamp" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                        >
                            ⏱️ Timestamp Converter
                        </button>
                        <button
                            onClick={() => handleTabChange("format")}
                            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === "format" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                        >
                            📅 DateFormatter Preview
                        </button>
                        <button
                            onClick={() => handleTabChange("html2pdf")}
                            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === "html2pdf" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                        >
                            📄 HTML to PDF
                        </button>
                        <button
                            onClick={() => handleTabChange("duplicate")}
                            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === "duplicate" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                        >
                            🔍 Duplicate Checker
                        </button>
                        <button
                            onClick={() => handleTabChange("compare")}
                            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === "compare" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                        >
                            🔄 List Comparator
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/timestamp" element={<MainContent />} />
                <Route path="/format" element={<MainContent />} />
                <Route path="/html2pdf" element={<MainContent />} />
                <Route path="/duplicate" element={<MainContent />} />
                <Route path="/compare" element={<MainContent />} />
                <Route path="/markdown" element={<MainContent />} />
            </Routes>
        </BrowserRouter>
    );
}