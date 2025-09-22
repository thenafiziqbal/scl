
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, IssuedBook, Student } from '../types';
import EditBookModal from '../components/EditBookModal';

const LibraryManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('manage-books');
    const { library, addBook, issueBook, returnBook, students, updateBook, deleteBook } = useApp();

    // State for new book form
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(1);

    // State for issue book form
    const [studentId, setStudentId] = useState('');
    const [bookId, setBookId] = useState('');
    const [dueDate, setDueDate] = useState('');

    // State for editing book
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    // State for filtering issued books by student
    const [filterStudentId, setFilterStudentId] = useState<string>('');


    const handleAddBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !author.trim() || totalQuantity <= 0) {
            alert('অনুগ্রহ করে সকল তথ্য সঠিকভাবে পূরণ করুন।');
            return;
        }
        addBook({ title, author, totalQuantity });
        setTitle('');
        setAuthor('');
        setTotalQuantity(1);
        alert('নতুন বই সফলভাবে যোগ করা হয়েছে!');
    };

    const handleIssueBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId || !bookId || !dueDate) {
            alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
            return;
        }
        issueBook({
            bookId,
            studentId,
            issueDate: new Date().toISOString().slice(0, 10),
            dueDate
        });
        setStudentId('');
        setBookId('');
        setDueDate('');
    };
    
    const handleSaveBook = (updatedBook: Book) => {
        updateBook(updatedBook.id, updatedBook);
        setEditingBook(null);
        alert('বইয়ের তথ্য সফলভাবে আপডেট করা হয়েছে!');
    };
    
    const handleDeleteBook = (bookId: string) => {
        const bookTitle = library.books[bookId]?.title || 'এই বইটি';
        if (window.confirm(`আপনি কি "${bookTitle}" বইটি লাইব্রেরি থেকে মুছে ফেলতে চান?`)) {
            deleteBook(bookId);
        }
    };

    const handleReturnBook = (issueId: string, bookId: string) => {
        const bookTitle = library.books[bookId]?.title || 'এই বইটি';
        if (window.confirm(`আপনি কি "${bookTitle}" বইটি ফেরত নিতে নিশ্চিত?`)) {
            returnBook(issueId);
        }
    };

    const tabs = [
        { id: 'manage-books', label: 'বই ম্যানেজমেন্ট' },
        { id: 'issue-return', label: 'বই ইস্যু ও ফেরত' },
    ];

    const renderBookManagement = () => (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-light p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-4">নতুন বই যোগ করুন</h3>
                <form onSubmit={handleAddBook} className="space-y-4">
                    <div>
                        <label className="font-medium text-sm text-accent">বইয়ের নাম</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="font-medium text-sm text-accent">লেখক</label>
                        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="font-medium text-sm text-accent">মোট সংখ্যা</label>
                        <input type="number" value={totalQuantity} onChange={e => setTotalQuantity(parseInt(e.target.value) || 1)} required min="1" className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">বই যোগ করুন</button>
                </form>
            </div>
            <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-primary mb-4">লাইব্রেরির সকল বই</h3>
                <div className="overflow-y-auto max-h-[60vh]">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white sticky top-0">
                            <tr>
                                <th className="p-3">বইয়ের নাম</th>
                                <th className="p-3">লেখক</th>
                                <th className="p-3 text-center">মোট</th>
                                <th className="p-3 text-center">বর্তমান</th>
                                <th className="p-3 text-center">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(library.books).map((book: Book) => (
                                <tr key={book.id} className="border-b">
                                    <td className="p-3 text-accent font-medium">{book.title}</td>
                                    <td className="p-3 text-gray-700">{book.author}</td>
                                    <td className="p-3 text-gray-700 text-center">{book.totalQuantity}</td>
                                    <td className="p-3 text-gray-700 text-center">{book.availableQuantity}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center items-center space-x-3">
                                            <button onClick={() => setEditingBook(book)} className="text-amber-600 hover:text-amber-800" title="এডিট করুন"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDeleteBook(book.id)} className="text-danger hover:text-red-700" title="মুছে ফেলুন"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderIssueReturn = () => {
         // FIX: Add explicit type for `b` to resolve property access errors.
         const availableBooks = Object.values(library.books).filter((b: Book) => b.availableQuantity > 0);
         // FIX: Add explicit types for `a`, `b` to resolve property access errors.
         const issuedBooks = Object.values(library.issuedBooks)
            .sort((a: IssuedBook, b: IssuedBook) => b.issueDate.localeCompare(a.issueDate))
            .sort((a: IssuedBook, b: IssuedBook) => (a.status > b.status) ? 1 : ((b.status > a.status) ? -1 : 0));
        
        // FIX: Add explicit type for `issue` to resolve property access errors.
        const filteredIssuedBooks = filterStudentId
            ? issuedBooks.filter((issue: IssuedBook) => issue.studentId === filterStudentId)
            : issuedBooks;


         return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-light p-6 rounded-lg">
                     <h3 className="text-lg font-bold text-primary mb-4">ছাত্রকে বই ইস্যু করুন</h3>
                     <form onSubmit={handleIssueBook} className="space-y-4">
                        <div>
                            <label className="font-medium text-sm text-accent">ছাত্র</label>
                            <select value={studentId} onChange={e => setStudentId(e.target.value)} required className="w-full p-2 border rounded-md mt-1">
                                <option value="">ছাত্র নির্বাচন করুন</option>
                                {/* FIX: Add explicit type for `s` to resolve property access errors. */}
                                {Object.values(students).map((s: Student) => <option key={s.id} value={s.id}>{s.name} (রোল: {s.roll})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-sm text-accent">বই</label>
                            <select value={bookId} onChange={e => setBookId(e.target.value)} required className="w-full p-2 border rounded-md mt-1">
                                <option value="">বই নির্বাচন করুন</option>
                                {/* FIX: Add explicit type for `b` to resolve property access errors. */}
                                {availableBooks.map((b: Book) => <option key={b.id} value={b.id}>{b.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-sm text-accent">ফেরতের শেষ তারিখ</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                        </div>
                        <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">ইস্যু করুন</button>
                     </form>
                </div>
                <div className="lg:col-span-2">
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-4 p-4 bg-light rounded-lg border">
                        <h3 className="text-lg font-bold text-primary">
                             {filterStudentId ? `${students[filterStudentId]?.name}-এর বই` : 'ইস্যুকৃত বইয়ের তালিকা'}
                        </h3>
                        <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                             <label htmlFor="studentFilter" className="font-medium text-sm text-gray-700 whitespace-nowrap">ছাত্র ফিল্টার:</label>
                            <select 
                                id="studentFilter"
                                value={filterStudentId} 
                                onChange={e => setFilterStudentId(e.target.value)} 
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">-- সকল ছাত্র দেখুন --</option>
                                {/* FIX: Add explicit types for `a`, `b`, `s` to resolve property access errors. */}
                                {Object.values(students).sort((a: Student, b: Student) => a.roll - b.roll).sort((a: Student, b: Student) => a.className.localeCompare(b.className)).map((s: Student) => 
                                    <option key={s.id} value={s.id}>{s.name} ({s.className}, রোল: {s.roll})</option>
                                )}
                            </select>
                        </div>
                    </div>
                     <div className="overflow-y-auto max-h-[60vh]">
                        <table className="w-full text-left">
                            <thead className="bg-sidebar text-white sticky top-0">
                                <tr>
                                    <th className="p-3">বইয়ের নাম</th>
                                    <th className="p-3">ছাত্রের নাম</th>
                                    <th className="p-3">ইস্যুর তারিখ</th>
                                    <th className="p-3">ফেরতের তারিখ</th>
                                    <th className="p-3 text-center">স্ট্যাটাস</th>
                                    <th className="p-3 text-center">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssuedBooks.length > 0 ? filteredIssuedBooks.map((issue: IssuedBook) => (
                                    <tr key={issue.id} className={`border-b transition-colors ${issue.status === 'returned' ? 'bg-green-50' : 'bg-white'}`}>
                                        <td className="p-3 text-gray-800">{library.books[issue.bookId]?.title || 'অজানা বই'}</td>
                                        <td className="p-3 text-accent font-medium">{students[issue.studentId]?.name || 'অজানা ছাত্র'}</td>
                                        <td className="p-3 text-gray-600">{issue.issueDate}</td>
                                        <td className="p-3 text-gray-600">{issue.dueDate}</td>
                                        <td className="p-3 text-center">
                                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'issued' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                               {issue.status === 'issued' ? 'ইস্যুকৃত' : `ফেরত ${issue.returnDate ? `(${issue.returnDate})` : ''}`}
                                           </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            {issue.status === 'issued' && 
                                                <button 
                                                    onClick={() => handleReturnBook(issue.id, issue.bookId)} 
                                                    className="bg-green-500 text-white text-xs px-3 py-1 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    title="বইটি ফেরত হিসেবে চিহ্নিত করুন"
                                                >
                                                    ফেরত নিন
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="text-center p-6 text-gray-500">
                                            {filterStudentId ? 'এই ছাত্র কোনো বই ইস্যু করেনি।' : 'কোনো বই ইস্যু করা হয়নি।'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
         )
    };
    
    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
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
            {editingBook && (
                <EditBookModal 
                    book={editingBook}
                    onClose={() => setEditingBook(null)}
                    onSave={handleSaveBook}
                />
            )}
        </>
    );
};

export default LibraryManagement;
