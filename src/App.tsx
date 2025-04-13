import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import TimestampConverter from "./components/TimestampConverter";
import DateFormatterPreview from "./components/DateFormatterPreview";
import HtmlToPdfConverter from "./components/HtmlToPdfConverter";
import DuplicateChecker from "./components/DuplicateChecker";
import ListComparator from "./components/ListComparator";

// 레이아웃 컴포넌트
function Layout({ children, isDarkMode, toggleDarkMode }: { 
    children: React.ReactNode;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}) {
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
                        {children}
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
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode !== null ? savedMode === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            localStorage.setItem('darkMode', String(newMode));
            return newMode;
        });
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
                        <div className="max-w-2xl mx-auto">
                            <TimestampConverter isDarkMode={isDarkMode} />
                        </div>
                    </Layout>
                } />
                <Route path="/timestamp" element={
                    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
                        <div className="max-w-2xl mx-auto">
                            <TimestampConverter isDarkMode={isDarkMode} />
                        </div>
                    </Layout>
                } />
                <Route path="/format" element={
                    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
                        <DateFormatterPreview isDarkMode={isDarkMode} />
                    </Layout>
                } />
                <Route path="/html2pdf" element={
                    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
                        <div className="max-w-[80%] mx-auto">
                            <HtmlToPdfConverter isDarkMode={isDarkMode} />
                        </div>
                    </Layout>
                } />
                <Route path="/duplicate" element={
                    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
                        <DuplicateChecker isDarkMode={isDarkMode} />
                    </Layout>
                } />
                <Route path="/compare" element={
                    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
                        <ListComparator isDarkMode={isDarkMode} />
                    </Layout>
                } />
            </Routes>
        </BrowserRouter>
    );
}