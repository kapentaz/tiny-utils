import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

interface HtmlToPdfConverterProps {
    isDarkMode: boolean;
}

const HtmlToPdfConverter: React.FC<HtmlToPdfConverterProps> = ({ isDarkMode }) => {
    const [htmlContent, setHtmlContent] = useState<string>(`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            color: #000000;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            margin: 20px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            color: #000000;
        }
        th {
            background-color: #f2f2f2;
            color: #000000;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sample Document</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="content">
        <h2>Introduction</h2>
        <p>This is a sample HTML document that demonstrates various formatting options.</p>
        
        <h2>Sample Table</h2>
        <table>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Item 1</td>
                <td>First sample item</td>
                <td>100</td>
            </tr>
            <tr>
                <td>Item 2</td>
                <td>Second sample item</td>
                <td>200</td>
            </tr>
        </table>
    </div>
</body>
</html>`);
    const [pdfUrl, setPdfUrl] = useState<string>('');

    const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHtmlContent(e.target.value);
    };

    const convertToPdf = async () => {
        try {
            const element = document.createElement('div');
            element.innerHTML = htmlContent;
            
            const opt = {
                margin: 0.5,
                filename: 'converted.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { 
                    scale: 4,
                    useCORS: true,
                    logging: true,
                    letterRendering: true
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                }
            };

            const pdf = await html2pdf().set(opt).from(element).output('blob');
            const url = URL.createObjectURL(pdf);
            setPdfUrl(url);
        } catch (error) {
            console.error('Error converting to PDF:', error);
            alert('An error occurred while converting to PDF.');
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-8">
            <div className="mb-6">                
                <h2 className="text-3xl font-bold mb-2 text-center">📄 HTML to PDF Converter</h2>
                <p className="text-center text-gray-600 mb-6">
                    Convert your HTML code to PDF format. Enter HTML code in the textarea below and click the convert button.
                </p>
                <textarea
                    className="w-full h-[32rem] p-4 border rounded bg-white text-gray-800 text-base"
                    value={htmlContent}
                    onChange={handleHtmlChange}
                    placeholder="Enter HTML code here..."
                />
            </div>
            
            <div className="flex gap-4 mb-6 justify-center">
                <button
                    onClick={convertToPdf}
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg"
                >
                    Convert to PDF
                </button>
                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        download="converted.pdf"
                        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-lg"
                    >
                        Download PDF
                    </a>
                )}
            </div>

            {pdfUrl && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Preview</h3>
                    <iframe
                        src={pdfUrl}
                        className="w-full h-[48rem] border rounded bg-white"
                        title="PDF Preview"
                    />
                </div>
            )}
        </div>
    );
};

export default HtmlToPdfConverter; 