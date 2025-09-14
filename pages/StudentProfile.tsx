
import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const StudentProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { students, classTests, marks, library } = useApp();

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


    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6">
                <img 
                    src={student.profilePicUrl || 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png'} 
                    alt={student.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-secondary"
                    onError={(e) => (e.currentTarget.src = 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png')}
                />
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-primary">{student.name}</h2>
                    <p className="text-gray-600"><strong>ক্লাস:</strong> {student.className} ({student.section})</p>
                    <p className="text-gray-600"><strong>রোল:</strong> {student.roll}</p>
                    <p className="text-gray-600"><strong>অভিভাবকের নাম:</strong> {student.guardianName}</p>
                    <p className="text-gray-600"><strong>যোগাযোগ:</strong> {student.contact}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-primary mb-4">ক্লাস টেস্টের ফলাফল</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-light">
                                <tr>
                                    <th className="p-3 text-left">পরীক্ষার নাম</th>
                                    <th className="p-3 text-left">বিষয়</th>
                                    <th className="p-3 text-center">প্রাপ্ত নম্বর</th>
                                    <th className="p-3 text-center">মোট নম্বর</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentMarks.map(mark => (
                                    <tr key={mark.id} className="border-b">
                                        <td className="p-3">{mark.examName}</td>
                                        <td className="p-3">{mark.subject}</td>
                                        <td className="p-3 text-center">{mark.marksObtained}</td>
                                        <td className="p-3 text-center">{mark.totalMarks}</td>
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
                             <thead className="bg-light">
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
                                       <td className="p-3">{issue.bookTitle}</td>
                                       <td className="p-3">{issue.issueDate}</td>
                                       <td className="p-3">{issue.dueDate}</td>
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
        </div>
    );
};

export default StudentProfile;
