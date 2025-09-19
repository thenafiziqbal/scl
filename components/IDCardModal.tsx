
import React from 'react';
import { Student, SchoolSettings } from '../types';

interface IDCardModalProps {
    student: Student;
    settings: SchoolSettings;
    onClose: () => void;
}

const IDCardModal: React.FC<IDCardModalProps> = ({ student, settings, onClose }) => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">ছাত্রের আইডি কার্ড</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>

                {/* ID Card component */}
                <div id="id-card-print-area">
                    <div className="w-[288px] h-[450px] mx-auto border-2 border-primary rounded-lg p-3 bg-slate-50 flex flex-col font-sans">
                        {/* Header */}
                        <div className="flex items-center space-x-2 border-b-2 border-primary pb-2">
                            <img src={settings.schoolLogoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                            <h3 className="text-primary font-bold text-center text-md leading-tight">{settings.schoolName}</h3>
                        </div>

                        {/* Photo */}
                        <div className="flex justify-center my-3">
                             <img 
                                src={student.profilePicUrl} 
                                alt={student.name} 
                                className="w-28 h-32 object-cover border-4 border-white shadow-md rounded-md"
                                onError={(e) => (e.currentTarget.src = 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png')}
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
                            <img src="https://barcode.tec-it.com/barcode.ashx?data=123456789&code=Code128&dpi=96" alt="barcode" className="h-10 w-full object-contain" />
                            <img src={settings.principalSignatureUrl} alt="Signature" className="h-8 w-24 mx-auto my-1" />
                            <p className="text-xs border-t-2 border-dotted border-gray-400 pt-1">অধ্যক্ষের স্বাক্ষর</p>
                            <p className="text-xs text-gray-600 mt-1">মেয়াদ: ৩১ ডিসেম্বর, ২০২৫</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 transition">বন্ধ করুন</button>
                    <button type="button" onClick={handlePrint} className="bg-secondary text-white font-bold py-2 px-5 rounded-lg hover:bg-accent transition flex items-center gap-2">
                        <i className="fas fa-print"></i> প্রিন্ট করুন
                    </button>
                </div>
            </div>
            <style>{`
                @media print {
                    body > *:not(.fixed) {
                        display: none;
                    }
                    .fixed {
                        background-color: transparent !important;
                        padding: 0;
                    }
                    .fixed > div {
                        box-shadow: none;
                    }
                    .fixed .flex.justify-between, .fixed .flex.justify-end {
                        display: none;
                    }
                    #id-card-print-area {
                        margin: 0;
                        padding: 0;
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

export default IDCardModal;
