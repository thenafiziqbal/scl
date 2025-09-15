
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const LibraryManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('manage-books');
    const { library } = useApp();

    const tabs = [
        { id: 'manage-books', label: 'বই ম্যানেজমেন্ট' },
        { id: 'issue-return', label: 'বই ইস্যু ও ফেরত' },
    ];

    const renderBookManagement = () => (
         <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-primary mb-4">নতুন বই যোগ করুন</h3>
                {/* Add Book Form */}
                 <p className="text-gray-500">নতুন বই যোগ করার ফর্ম এখানে যোগ করা হবে।</p>
            </div>
            <div>
                <h3 className="text-lg font-bold text-primary mb-4">লাইব্রেরির সকল বই</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-3">বইয়ের নাম</th>
                                <th className="p-3">লেখক</th>
                                <th className="p-3">মোট</th>
                                <th className="p-3">বর্তমান</th>
                                <th className="p-3">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(library.books).map(book => (
                                <tr key={book.id} className="border-b">
                                    <td className="p-3 text-accent font-medium">{book.title}</td>
                                    <td className="p-3 text-gray-700">{book.author}</td>
                                    <td className="p-3 text-gray-700">{book.totalQuantity}</td>
                                    <td className="p-3 text-gray-700">{book.availableQuantity}</td>
                                    <td className="p-3"><button className="text-danger"><i className="fas fa-trash"></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderIssueReturn = () => {
         const { students } = useApp();
         const issuedBooks = Object.values(library.issuedBooks);
         return (
            <div className="space-y-6">
                <div>
                     <h3 className="text-lg font-bold text-primary mb-4">ছাত্রকে বই ইস্যু করুন</h3>
                     {/* Issue Book Form */}
                     <p className="text-gray-500">বই ইস্যু করার ফর্ম এখানে যোগ করা হবে।</p>
                </div>
                <div>
                     <h3 className="text-lg font-bold text-primary mb-4">ইস্যুকৃত বইয়ের তালিকা</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-sidebar text-white">
                                <tr>
                                    <th className="p-3">বইয়ের নাম</th>
                                    <th className="p-3">ছাত্রের নাম</th>
                                    <th className="p-3">স্ট্যাটাস</th>
                                    <th className="p-3">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issuedBooks.map(issue => (
                                    <tr key={issue.id} className="border-b">
                                        <td className="p-3 text-gray-800">{library.books[issue.bookId]?.title}</td>
                                        <td className="p-3 text-accent font-medium">{students[issue.studentId]?.name}</td>
                                        <td className="p-3">
                                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'issued' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                               {issue.status === 'issued' ? 'ইস্যুকৃত' : 'ফেরত হয়েছে'}
                                           </span>
                                        </td>
                                        <td className="p-3">
                                            {issue.status === 'issued' && <button className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600">ফেরত নিন</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
         )
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-secondary text-secondary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="py-6">
                {activeTab === 'manage-books' && renderBookManagement()}
                {activeTab === 'issue-return' && renderIssueReturn()}
            </div>
        </div>
    );
};

export default LibraryManagement;