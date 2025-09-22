import React from 'react';
import { Student, SchoolSettings } from '../types';
import { exportHtmlToWord } from '../services/wordExporter';

declare const html2canvas: any;

interface IDCardModalProps {
    student: Student;
    settings: SchoolSettings;
    onClose: () => void;
}

const IDCardModal: React.FC<IDCardModalProps> = ({ student, settings, onClose }) => {

    const handleWordDownload = () => {
        const cardHtml = `
            <div style="width: 288px; height: 450px; border: 2px solid #4f46e5; border-radius: 8px; padding: 12px; background-color: #f9fafb; font-family: 'Noto Sans Bengali', sans-serif;">
                <table style="width: 100%; height: 100%; border-collapse: collapse; font-family: 'Noto Sans Bengali', sans-serif;">
                    <!-- Header Row -->
                    <tr style="height: 1px;">
                        <td style="vertical-align: top; padding: 0; border: none;">
                            <table style="width: 100%; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; border-collapse: collapse;">
                                <tr>
                                    <td style="width: 56px; border: none; padding: 0;">
                                        <img src="${settings.schoolLogoUrl}" alt="Logo" style="width: 48px; height: 48px; object-fit: contain;" />
                                    </td>
                                    <td style="border: none; padding: 0; text-align: center;">
                                        <h3 style="color: #4f46e5; font-weight: bold; font-size: 14px; line-height: 1.2; margin: 0;">${settings.schoolName}</h3>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Body Row -->
                    <tr>
                        <td style="vertical-align: top; padding: 0; border: none; text-align: center;">
                            <div style="margin-top: 12px;">
                              <img 
                                src="${student.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff&size=128`}" 
                                alt="${student.name}" 
                                style="width: 112px; height: 128px; object-fit: cover; border: 4px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 6px; margin: 0 auto;"
                              />
                            </div>
                            <div style="margin-top: 8px;">
                              <h4 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0;">${student.name}</h4>
                              <p style="font-size: 14px; color: #374151; margin: 2px 0;">ক্লাস: ${student.className} (${student.section})</p>
                              <p style="font-size: 14px; color: #374151; margin: 2px 0;">রোল: ${student.roll}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer Row -->
                    <tr style="height: 1px;">
                        <td style="vertical-align: bottom; padding: 0; border: none;">
                            <div style="text-align: center;">
                                <img src="https://barcode.tec-it.com/barcode.ashx?data=${student.id}&code=Code128&dpi=96" alt="barcode" style="height: 40px; width: 100%; object-fit: contain;" />
                                <img src="${settings.principalSignatureUrl}" alt="Signature" style="height: 32px; width: 96px; margin: 4px auto;" />
                                <p style="font-size: 12px; border-top: 2px dotted #9ca3af; padding-top: 4px; margin: 0;">অধ্যক্ষের স্বাক্ষর</p>
                                <p style="font-size: 12px; color: #4b5563; margin-top: 4px;">মেয়াদ: ৩১ ডিসেম্বর, ২০২৫</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        `;
        
        exportHtmlToWord(cardHtml, `${student.name}_ID_Card`);
    };

    const handlePngDownload = () => {
        const cardElement = document.getElementById('id-card-content');
        if (cardElement) {
            html2canvas(cardElement, { 
                useCORS: true,
                scale: 2 // Improve image quality
            }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `${student.name}_ID_Card.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(err => {
                console.error("PNG ডাউনলোড করতে সমস্যা হয়েছে:", err);
                alert("দুঃখিত, ছবিটি ডাউনলোড করা যায়নি।");
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">ছাত্রের আইডি কার্ড</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>

                {/* ID Card component */}
                <div id="id-card-display-area">
                    <div id="id-card-content" className="w-[288px] h-[450px] mx-auto border-2 border-primary rounded-lg p-3 bg-slate-50 flex flex-col font-sans">
                        {/* Header */}
                        <div className="flex items-center space-x-2 border-b-2 border-primary pb-2">
                            <img src={settings.schoolLogoUrl} alt="Logo" className="w-12 h-12 object-contain" crossOrigin="anonymous" />
                            <h3 className="text-primary font-bold text-center text-md leading-tight">{settings.schoolName}</h3>
                        </div>

                        {/* Photo */}
                        <div className="flex justify-center my-3">
                             <img 
                                src={student.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff&size=112`} 
                                alt={student.name} 
                                className="w-28 h-32 object-cover border-4 border-white shadow-md rounded-md"
                                onError={(e) => {
                                    const fallbackSrc = 'https://placehold.co/112x128/CCCCCC/FFFFFF?text=Photo';
                                    if (e.currentTarget.src !== fallbackSrc) {
                                        e.currentTarget.src = fallbackSrc;
                                    }
                                }}
                                crossOrigin="anonymous"
                             />
                        </div>

                        {/* Details */}
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-accent">{student.name}</h4>
                            <p className="text-sm text-gray-700">ক্লাস: {student.className} ({student.section})</p>
                            <p className="text-sm text-gray-700">রোল: {student.roll}</p>
                        </div>
                        
                        {/* Footer */}
                        <div className="mt-auto text-center">
                            <img src={`https://barcode.tec-it.com/barcode.ashx?data=${student.id}&code=Code128&dpi=96`} alt="barcode" className="h-10 w-full object-contain" crossOrigin="anonymous" />
                            <img src={settings.principalSignatureUrl} alt="Signature" className="h-8 w-24 mx-auto my-1" crossOrigin="anonymous" />
                            <p className="text-xs border-t-2 border-dotted border-gray-400 pt-1">অধ্যক্ষের স্বাক্ষর</p>
                            <p className="text-xs text-gray-600 mt-1">মেয়াদ: ৩১ ডিসেম্বর, ২০২৫</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 transition">বন্ধ করুন</button>
                    <button type="button" onClick={handlePngDownload} className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                        <i className="fas fa-file-image"></i> PNG ডাউনলোড
                    </button>
                    <button type="button" onClick={handleWordDownload} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <i className="fas fa-file-word"></i> Word ডাউনলোড
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default IDCardModal;