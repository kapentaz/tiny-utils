import { useState, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown.css';

interface MarkdownPreviewProps {
    isDarkMode?: boolean;
}

function MarkdownPreview({ isDarkMode }: MarkdownPreviewProps) {
    const [markdown, setMarkdown] = useState('');
    const [previewHtml, setPreviewHtml] = useState('');

    const convertMarkdown = async () => {
        try {
            marked.setOptions({
                highlight: function(code: string, lang: string) {
                    if (lang && hljs.getLanguage(lang)) {
                        return hljs.highlight(code, { language: lang }).value;
                    }
                    return hljs.highlightAuto(code).value;
                }
            } as any);
            const convertedHtml = await marked(markdown);
            setPreviewHtml(convertedHtml);
        } catch (error) {
            console.error('Error converting markdown:', error);
            setPreviewHtml('<p class="text-red-500">변환 중 오류가 발생했습니다.</p>');
        }
    };

    // 마크다운이 변경될 때마다 자동으로 변환
    useEffect(() => {
        if (markdown) {
            convertMarkdown();
        }
    }, [markdown]);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Markdown Preview</h2>
            <p className="text-center text-gray-600 mb-6">
                Convert your Markdown text to HTML and preview it in real-time.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Markdown</h3>
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Enter your Markdown text here..."
                        className="w-full h-[24rem] p-4 border rounded bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Preview</h3>
                    <div
                        className="w-full h-[24rem] p-4 border rounded overflow-auto bg-white"
                        style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                            backgroundColor: 'white',
                            color: '#24292e'
                        }}
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                </div>
            </div>
        </div>
    );
}

export default MarkdownPreview; 