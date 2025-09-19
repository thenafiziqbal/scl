import React, { useState, useEffect } from 'react';
import { FeeInvoice } from '../types';

interface EditInvoiceModalProps {
    invoice: FeeInvoice;
    onClose: () => void;
    onSave: (invoice: FeeInvoice) => void;
}

const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({ invoice, onClose, onSave }) => {
    const [formData, setFormData] = useState<FeeInvoice>(invoice);

    useEffect(() => {
        setFormData(invoice);
    }, [invoice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">ইনভয়েস এডিট করুন</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-medium text-gray-700">ইনভয়েসের নাম</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={fieldClasses}/>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">পরিমাণ (৳)</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className={fieldClasses}/>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">শেষ তারিখ</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className={fieldClasses}/>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 transition">বাতিল</button>
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-5 rounded-lg hover:bg-accent transition">সেভ করুন</button>
                    </div>
                </form>
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

export default EditInvoiceModal;