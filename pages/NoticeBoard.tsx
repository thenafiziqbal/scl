import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';

const NoticeBoard: React.FC = () => {
    const { user, notices, addNotice, deleteNotice } = useApp();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // FIX: Add explicit types for `a`, `b` to resolve property access errors.
    const sortedNotices = Object.values(notices).sort((a: Notice, b: Notice) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('শিরোনাম এবং বিবরণ উভয়ই পূরণ করুন।');
            return;
        }
        const newNotice: Omit<Notice, 'id'> = {
            title,
            content,
            date: new Date().toISOString().slice(0, 10),
        };
        addNotice(newNotice);
        setTitle('');
        setContent('');
        alert('নোটিশ সফলভাবে যোগ করা হয়েছে!');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
            deleteNotice(id);
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-8`}>
            {isAdmin && (
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-primary mb-4">নতুন নোটিশ যোগ করুন</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">বিবরণ</label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary transition"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-secondary hover:bg-accent text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                            >
                                <i className="fas fa-plus mr-2"></i> যোগ করুন
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className={isAdmin ? 'lg:col-span-2' : 'col-span-1'}>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                     <h2 className="text-xl font-bold text-primary mb-4">সকল নোটিশ</h2>
                     <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                        {sortedNotices.length > 0 ? sortedNotices.map((notice: Notice) => (
                            <div key={notice.id} className="p-4 bg-light rounded-lg border-l-4 border-secondary relative">
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDelete(notice.id)}
                                        className="absolute top-2 right-2 text-danger hover:text-red-700"
                                        title="মুছে ফেলুন"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                                <h3 className="font-bold text-lg text-accent">{notice.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">প্রকাশিত: {notice.date}</p>
                                <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-8">কোনো নোটিশ পাওয়া যায়নি।</p>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;
