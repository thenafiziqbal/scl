// services/wordExporter.ts
export const exportHtmlToWord = (htmlString: string, filename: string) => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
        xmlns:w='urn:schemas-microsoft-com:office:word' 
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Export HTML to Word</title>
            <style>
                @page {
                    size: A4;
                    margin: 1in;
                }
                body { 
                    font-family: 'Noto Sans Bengali', Cambria, serif; 
                    font-size: 11pt;
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%; 
                }
                th, td { 
                    border: 1px solid black; 
                    padding: 6px; 
                    text-align: left;
                }
                th { 
                    background-color: #EAEAEA; 
                    font-weight: bold;
                }
                h1, h2, h3, p {
                    margin: 5px 0;
                }
            </style>
        </head><body>`;
    const footer = "</body></html>";

    const fullHtml = header + htmlString + footer;

    const blob = new Blob(['\ufeff', fullHtml], {
        type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
