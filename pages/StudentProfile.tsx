import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import IDCardModal from '../components/IDCardModal';
import { noto_sans_bengali_normal } from '../services/bengaliFont';

declare global {
    interface Window {
        jspdf: any;
    }
}

const StudentProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { students, classTests, marks, library, settings, feeInvoices, studentPayments } = useApp();
    const [idCardStudent, setIdCardStudent] = useState<typeof students[0] | null>(null);

    if (!id) return <p>ছাত্রের ID পাওয়া যায়নি।</p>;
    const student = students[id];

    if (!student) return <p>ছাত্র খুঁজে পাওয়া যায়নি।</p>;
    
    const studentMarks = Object.entries(marks)
        .map(([examId, examMarks]) => {
            if (examMarks[id]) {
                const examDetails = classTests[examId];
                if (examDetails) {
                    return { ...examDetails, ...examMarks[id] };
                }
            }
            return null;
        })
        .filter(Boolean);
        
    const studentIssuedBooks = Object.values(library.issuedBooks)
        .filter(issue => issue.studentId === id)
        .map(issue => ({ ...issue, bookTitle: library.books[issue.bookId]?.title || 'Unknown Book' }));

    const studentFeeHistory = Object.values(feeInvoices).map(invoice => {
        const payment = Object.values(studentPayments).find(p => p.studentId === id && p.invoiceId === invoice.id);
        return {
            ...invoice,
            status: payment ? 'Paid' : 'Unpaid',
            paymentDate: payment?.paymentDate,
        };
    });
        
    const getGrade = (percentage: number) => {
        if (percentage >= 80) return 'A+';
        if (percentage >= 70) return 'A';
        if (percentage >= 60) return 'A-';
        if (percentage >= 50) return 'B';
        if (percentage >= 40) return 'C';
        if (percentage >= 33) return 'D';
        return 'F';
    };
    
    const generateTranscript = () => {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("PDF generation library not loaded.");
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add Bengali font
        doc.addFileToVFS('NotoSansBengali-Regular.ttf', noto_sans_bengali_normal);
        doc.addFont('NotoSansBengali-Regular.ttf', 'NotoSansBengali', 'normal');
        doc.setFont('NotoSansBengali');

        // Header
        doc.setFontSize(18);
        doc.text(settings.schoolName, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text('একাডেমিক ট্রান্সক্রিপ্ট', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
        
        // Student Info
        doc.setFontSize(12);
        doc.text(`ছাত্রের নাম: ${student.name}`, 14, 45);
        doc.text(`ক্লাস: ${student.className} (${student.section})`, 14, 52);
        doc.text(`রোল: ${student.roll}`, 14, 59);
        
        // Marks Table
        const tableData = studentMarks.map(mark => {
            if (mark) {
                const percentage = (mark.marksObtained / mark.totalMarks) * 100;
                return [
                    mark.examName,
                    mark.subject,
                    mark.totalMarks,
                    mark.marksObtained,
                    `${percentage.toFixed(2)}%`,
                    getGrade(percentage),
                ];
            }
            return [];
        }).filter(row => row.length > 0);
        
        doc.autoTable({
            head: [['পরীক্ষার নাম', 'বিষয়', 'মোট নম্বর', 'প্রাপ্ত নম্বর', 'শতাংশ', 'গ্রেড']],
            body: tableData,
            startY: 70,
            theme: 'grid',
            styles: { font: 'NotoSansBengali' },
            headStyles: { font: 'NotoSansBengali', fontStyle: 'bold', fillColor: [44, 62, 80] },
        });
        
        // Footer
        const finalY = (doc as any).lastAutoTable.finalY || 150;
        if(settings.principalSignatureUrl && settings.principalName) {
            doc.addImage(settings.principalSignatureUrl, 'PNG', 150, finalY + 10, 40, 15);
            doc.line(150, finalY + 26, 190, finalY + 26);
            doc.text(settings.principalName, 152, finalY + 32);
            doc.text('অধ্যক্ষ', 165, finalY + 38);
        }
        
        doc.save(`${student.name}_ট্রান্সক্রিপ্ট.pdf`);
    };


    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6">
                <img 
                    src={student.profilePicUrl || 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png'} 
                    alt={student.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-secondary"
                    onError={(e) => (e.currentTarget.src = 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png')}
                />
                <div className="text-center md:text-left flex-grow">
                    <h2 className="text-3xl font-bold text-primary">{student.name}</h2>
                    <p className="text-gray-600"><strong>ক্লাস:</strong> {student.className} ({student.section})</p>
                    <p className="text-gray-600"><strong>রোল:</strong> {student.roll}</p>
                    <p className="text-gray-600"><strong>অভিভাবকের নাম:</strong> {student.guardianName}</p>
                    <p className="text-gray-600"><strong>যোগাযোগ:</strong> {student.contact}</p>
                </div>
                 <div className="md:ml-auto flex flex-col sm:flex-row gap-2 self-center md:self-start">
                    <button onClick={() => setIdCardStudent(student)} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                        <i className="fas fa-id-card"></i> আইডি কার্ড
                    </button>
                    <button onClick={generateTranscript} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition flex items-center gap-2">
                        <i className="fas fa-file-pdf"></i> একাডেমিক ট্রান্সক্রিপ্ট
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-primary mb-4">ক্লাস টেস্টের ফলাফল</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sidebar text-white">
                                <tr>
                                    <th className="p-3 text-left">পরীক্ষার নাম</th>
                                    <th className="p-3 text-left">বিষয়</th>
                                    <th className="p-3 text-center">প্রাপ্ত নম্বর</th>
                                    <th className="p-3 text-center">মোট নম্বর</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentMarks.map(mark => (
                                    mark && <tr key={mark.id} className="border-b">
                                        <td className="p-3 text-gray-800">{mark.examName}</td>
                                        <td className="p-3 text-gray-700">{mark.subject}</td>
                                        <td className="p-3 text-center text-accent font-semibold">{mark.marksObtained}</td>
                                        <td className="p-3 text-center text-gray-700">{mark.totalMarks}</td>
                                    </tr>
                                ))}
                                {studentMarks.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-500">কোনো ফলাফল পাওয়া যায়নি।</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-primary mb-4">লাইব্রেরি থেকে গৃহীত বই</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                             <thead className="bg-sidebar text-white">
                                <tr>
                                    <th className="p-3 text-left">বইয়ের নাম</th>
                                    <th className="p-3 text-left">ইস্যুর তারিখ</th>
                                    <th className="p-3 text-left">ফেরতের তারিখ</th>
                                    <th className="p-3 text-center">স্ট্যাটাস</th>
                                </tr>
                            </thead>
                            <tbody>
                               {studentIssuedBooks.map(issue => (
                                   <tr key={issue.id} className="border-b">
                                       <td className="p-3 text-gray-800">{issue.bookTitle}</td>
                                       <td className="p-3 text-gray-700">{issue.issueDate}</td>
                                       <td className="p-3 text-gray-700">{issue.dueDate}</td>
                                       <td className="p-3 text-center">
                                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'issued' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                               {issue.status === 'issued' ? 'ইস্যুকৃত' : 'ফেরত হয়েছে'}
                                           </span>
                                       </td>
                                   </tr>
                               ))}
                               {studentIssuedBooks.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-500">কোনো বই ইস্যু করা হয়নি।</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-primary mb-4">ফি প্রদানের ইতিহাস</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                         <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-3 text-left">ফি-এর বিবরণ</th>
                                <th className="p-3 text-right">পরিমাণ (৳)</th>
                                <th className="p-3 text-center">স্ট্যাটাস</th>
                                <th className="p-3 text-center">পেমেন্টের তারিখ</th>
                            </tr>
                        </thead>
                        <tbody>
                           {studentFeeHistory.map(item => (
                               <tr key={item.id} className="border-b">
                                   <td className="p-3 text-gray-800">{item.name}</td>
                                   <td className="p-3 text-gray-700 text-right">{item.amount.toFixed(2)}</td>
                                   <td className="p-3 text-center">
                                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                           {item.status === 'Paid' ? 'পরিশোধিত' : 'অপরিশোধিত'}
                                       </span>
                                   </td>
                                   <td className="p-3 text-center text-gray-600">{item.paymentDate || '---'}</td>
                               </tr>
                           ))}
                           {studentFeeHistory.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-500">কোনো ফি-এর তথ্য পাওয়া যায়নি।</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {idCardStudent && (
                 <IDCardModal
                    student={idCardStudent}
                    settings={settings}
                    onClose={() => setIdCardStudent(null)}
                />
            )}
        </div>
    );
};

export default StudentProfile;