import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MainExam, Student, Class, Section } from '../types';

declare const html2canvas: any;

interface AdmitCardModalProps {
    exam: MainExam;
    onClose: () => void;
}

const AdmitCardModal: React.FC<AdmitCardModalProps> = ({ exam, onClose }) => {
    const { settings, students, classes, sections } = useApp();
    const [selectedClass, setSelectedClass] = useState(Object.values(classes)[0]?.name || '');
    const [selectedSection, setSelectedSection] = useState(Object.values(sections)[0]?.name || '');

    const studentsInClass = useMemo(() => {
        // FIX: Add explicit types to resolve property access and sort errors.
        return Object.values(students)
            .filter((s: Student) => s.className === selectedClass && s.section === selectedSection)
            .sort((a: Student, b: Student) => a.roll - b.roll);
    }, [students, selectedClass, selectedSection]);

    const handlePrint = () => {
        window.print();
    };

    const handlePngDownload = () => {
        const printArea = document.getElementById('admit-card-print-area');
        if (printArea) {
            html2canvas(printArea, { 
                useCORS: true,
                scale: 2 // Improve image quality
            }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `Admit_Cards_${selectedClass}_${selectedSection}.png`;
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 p-4 font-sans overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">পরীক্ষার প্রবেশপত্র</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>

                <div className="print-controls bg-light p-4 rounded-lg mb-4 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="font-medium text-sm text-gray-700">ক্লাস</label>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full p-2 border rounded-md bg-white mt-1 text-gray-900">
                            {/* FIX: Add explicit type for `c` to resolve property access errors. */}
                            {Object.values(classes).map((c: Class) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="font-medium text-sm text-gray-700">বিভাগ</label>
                        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="w-full p-2 border rounded-md bg-white mt-1 text-gray-900">
                            {/* FIX: Add explicit type for `s` to resolve property access errors. */}
                            {Object.values(sections).map((s: Section) => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <button onClick={handlePrint} className="bg-secondary text-white font-bold py-2 px-5 rounded-lg hover:bg-accent transition flex items-center gap-2">
                        <i className="fas fa-print"></i> প্রিন্ট করুন
                    </button>
                    <button onClick={handlePngDownload} className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                        <i className="fas fa-file-image"></i> PNG ডাউনলোড
                    </button>
                </div>

                {/* Print Area */}
                <div id="admit-card-print-area" className="max-h-[60vh] overflow-y-auto bg-gray-200 p-4 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studentsInClass.map((student: Student) => (
                            <div key={student.id} className="admit-card w-full h-auto bg-white flex flex-col p-3 border-2 border-dashed border-gray-400 rounded-lg">
                                {/* Header */}
                                <div className="flex items-center space-x-2 border-b-2 border-primary pb-2 text-center">
                                    <img src={settings.schoolLogoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                                    <div className="flex-grow">
                                        <h3 className="text-primary font-bold text-md leading-tight">{settings.schoolName}</h3>
                                        <p className="text-accent font-semibold text-sm">{exam.name}</p>
                                    </div>
                                </div>
                                {/* Body */}
                                <div className="flex my-3 gap-3">
                                    <img 
                                        src={student.profilePicUrl} 
                                        alt={student.name} 
                                        className="w-20 h-24 object-cover border-2 border-gray-300"
                                        onError={(e) => (e.currentTarget.src = 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png')}
                                     />
                                     <div className="text-sm">
                                        <p><strong>নাম:</strong> {student.name}</p>
                                        <p><strong>ক্লাস:</strong> {student.className} ({student.section})</p>
                                        <p><strong>রোল:</strong> {student.roll}</p>
                                        <p><strong>অভিভাবক:</strong> {student.guardianName}</p>
                                     </div>
                                </div>
                                {/* Footer */}
                                <div className="mt-auto pt-2 flex justify-between items-end">
                                     <div>
                                        <p className="text-xs border-t-2 border-dotted border-gray-400 pt-1">পরীক্ষার্থীর স্বাক্ষর</p>
                                    </div>
                                    <div className="text-center">
                                        <img src={settings.principalSignatureUrl} alt="Signature" className="h-8 w-24 mx-auto" />
                                        <p className="text-xs border-t-2 border-dotted border-gray-400 pt-1">অধ্যক্ষের স্বাক্ষর</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @media print {
                    body > *:not(.fixed) {
                        display: none !important;
                    }
                    .fixed {
                        position: static !important;
                        background-color: transparent !important;
                        padding: 0 !important;
                        overflow: visible !important;
                    }
                    .fixed > div {
                        box-shadow: none !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                    }
                    .print-controls, .flex.justify-between {
                        display: none !important;
                    }
                    #admit-card-print-area {
                        max-height: none !important;
                        overflow: visible !important;
                        background: none !important;
                        padding: 0 !important;
                    }
                    #admit-card-print-area > div {
                        display: block !important;
                    }
                    .admit-card {
                        page-break-inside: avoid;
                        page-break-after: always;
                    }
                }
                 @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AdmitCardModal;