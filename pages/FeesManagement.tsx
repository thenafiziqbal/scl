import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { noto_sans_bengali_normal } from '../services/bengaliFont';
import EditInvoiceModal from '../components/EditInvoiceModal';
import { FeeInvoice } from '../types';


declare global {
    interface Window {
        jspdf: any;
    }
}

const FeesManagement: React.FC = () => {
    const { 
        feeInvoices, 
        studentPayments, 
        students, 
        addFeeInvoice, 
        recordStudentPayment,
        updateFeeInvoice,
        deleteFeeInvoice
    } = useApp();
    
    const [activeTab, setActiveTab] = useState('invoices');

    // State for new invoice form
    const [invoiceName, setInvoiceName] = useState('');
    const [invoiceAmount, setInvoiceAmount] = useState('');
    const [invoiceDueDate, setInvoiceDueDate] = useState('');

    // State for editing invoice
    const [editingInvoice, setEditingInvoice] = useState<FeeInvoice | null>(null);

    // State for new payment form
    const [paymentStudent, setPaymentStudent] = useState('');
    const [paymentInvoice, setPaymentInvoice] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));

    const handleAddInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoiceName || !invoiceAmount || !invoiceDueDate) {
            alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
            return;
        }
        addFeeInvoice({
            name: invoiceName,
            amount: parseFloat(invoiceAmount),
            dueDate: invoiceDueDate
        });
        setInvoiceName('');
        setInvoiceAmount('');
        setInvoiceDueDate('');
        alert('নতুন ফি ইনভয়েস যোগ করা হয়েছে!');
    };
    
    const handleRecordPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentStudent || !paymentInvoice || !paymentAmount || !paymentDate) {
            alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
            return;
        }
        recordStudentPayment({
            studentId: paymentStudent,
            invoiceId: paymentInvoice,
            amountPaid: parseFloat(paymentAmount),
            paymentDate: paymentDate
        });
        setPaymentStudent('');
        setPaymentInvoice('');
        setPaymentAmount('');
        setPaymentDate(new Date().toISOString().slice(0, 10));
        alert('পেমেন্ট সফলভাবে রেকর্ড করা হয়েছে!');
    };

    const handleSaveInvoice = (updatedInvoice: FeeInvoice) => {
        updateFeeInvoice(updatedInvoice.id, updatedInvoice);
        setEditingInvoice(null);
        alert('ইনভয়েস সফলভাবে আপডেট করা হয়েছে!');
    };
    
    const handleDeleteInvoice = (invoiceId: string) => {
        if (window.confirm('আপনি কি নিশ্চিতভাবে এই ইনভয়েসটি মুছে ফেলতে চান?')) {
            deleteFeeInvoice(invoiceId);
        }
    };


    const generatePaymentsPDF = () => {
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

        doc.setFontSize(18);
        doc.text('সকল পেমেন্টের তালিকা', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

        const tableData = Object.values(studentPayments).map(payment => [
            students[payment.studentId]?.name || 'N/A',
            feeInvoices[payment.invoiceId]?.name || 'N/A',
            payment.amountPaid.toFixed(2),
            payment.paymentDate,
        ]);

        doc.autoTable({
            head: [['ছাত্রের নাম', 'ইনভয়েস', 'পরিমাণ (৳)', 'তারিখ']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            styles: { font: 'NotoSansBengali' },
            headStyles: { font: 'NotoSansBengali', fontStyle: 'bold', fillColor: [22, 160, 133] },
        });

        doc.save('পেমেন্ট-রেকর্ড.pdf');
    };

    const tabs = [
        { id: 'invoices', label: 'ফি ইনভয়েস' },
        { id: 'payments', label: 'পেমেন্ট রেকর্ড' },
    ];

    const renderInvoicesTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-light p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-4">নতুন ইনভয়েস তৈরি করুন</h3>
                <form onSubmit={handleAddInvoice} className="space-y-4">
                    <div>
                        <label className="font-medium text-sm text-accent">ইনভয়েসের নাম</label>
                        <input type="text" value={invoiceName} onChange={e => setInvoiceName(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="font-medium text-sm text-accent">পরিমাণ (৳)</label>
                        <input type="number" value={invoiceAmount} onChange={e => setInvoiceAmount(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="font-medium text-sm text-accent">শেষ তারিখ</label>
                        <input type="date" value={invoiceDueDate} onChange={e => setInvoiceDueDate(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">ইনভয়েস যোগ করুন</button>
                </form>
            </div>
            <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-accent mb-4">সকল ইনভয়েসের তালিকা</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-3">নাম</th>
                                <th className="p-3">পরিমাণ (৳)</th>
                                <th className="p-3">শেষ তারিখ</th>
                                <th className="p-3">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(feeInvoices).map(invoice => (
                                <tr key={invoice.id} className="border-b">
                                    <td className="p-3 text-accent">{invoice.name}</td>
                                    <td className="p-3 text-accent">{invoice.amount.toFixed(2)}</td>
                                    <td className="p-3 text-accent">{invoice.dueDate}</td>
                                    <td className="p-3">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => setEditingInvoice(invoice)} className="text-accent hover:text-blue-700" title="এডিট করুন"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDeleteInvoice(invoice.id)} className="text-danger hover:text-red-700" title="মুছে ফেলুন"><i className="fas fa-trash"></i></button>
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

    const renderPaymentsTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-light p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-4">পেমেন্ট রেকর্ড করুন</h3>
                <form onSubmit={handleRecordPayment} className="space-y-4">
                    <div>
                        <label className="font-medium text-sm text-accent">ছাত্র</label>
                        <select value={paymentStudent} onChange={e => setPaymentStudent(e.target.value)} required className="w-full p-2 border rounded-md mt-1">
                            <option value="">ছাত্র নির্বাচন করুন</option>
                            {Object.values(students).map(s => <option key={s.id} value={s.id}>{s.name} (রোল: {s.roll})</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="font-medium text-sm text-accent">ইনভয়েস</label>
                        <select value={paymentInvoice} onChange={e => setPaymentInvoice(e.target.value)} required className="w-full p-2 border rounded-md mt-1">
                             <option value="">ইনভয়েস নির্বাচন করুন</option>
                             {Object.values(feeInvoices).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="font-medium text-sm text-accent">প্রদত্ত পরিমাণ (৳)</label>
                        <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                     <div>
                        <label className="font-medium text-sm text-accent">পেমেন্টের তারিখ</label>
                        <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">পেমেন্ট রেকর্ড করুন</button>
                </form>
            </div>
            <div className="lg:col-span-2">
                 <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h3 className="text-lg font-bold text-accent">সকল পেমেন্টের তালিকা</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={generatePaymentsPDF} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm">
                            <i className="fas fa-file-pdf mr-2"></i> PDF ডাউনলোড
                        </button>
                    </div>
                </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-3">ছাত্রের নাম</th>
                                <th className="p-3">ইনভয়েস</th>
                                <th className="p-3">পরিমাণ (৳)</th>
                                <th className="p-3">তারিখ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(studentPayments).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).map(payment => (
                                <tr key={payment.id} className="border-b">
                                    <td className="p-3 text-accent">{students[payment.studentId]?.name || 'N/A'}</td>
                                    <td className="p-3 text-accent">{feeInvoices[payment.invoiceId]?.name || 'N/A'}</td>
                                    <td className="p-3 text-accent">{payment.amountPaid.toFixed(2)}</td>
                                    <td className="p-3 text-accent">{payment.paymentDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <>
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
                    {activeTab === 'invoices' && renderInvoicesTab()}
                    {activeTab === 'payments' && renderPaymentsTab()}
                </div>
            </div>
            {editingInvoice && (
                <EditInvoiceModal
                    invoice={editingInvoice}
                    onClose={() => setEditingInvoice(null)}
                    onSave={handleSaveInvoice}
                />
            )}
        </>
    );
};

export default FeesManagement;