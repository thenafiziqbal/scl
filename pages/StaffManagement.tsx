
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import EditStaffModal, { StaffData } from '../components/EditStaffModal';
import { Teacher, Librarian, DepartmentHead, Class, UserRole } from '../types';

type TeacherWithUser = Teacher & { uid: string; role: UserRole; password?: string; };
type LibrarianWithUser = Librarian & { uid: string; role: UserRole; password?: string; };
type DepartmentHeadWithUser = DepartmentHead & { uid: string; role: UserRole; password?: string; };

const StaffManagement: React.FC = () => {
    const { teachers, librarians, departmentHeads, classes, createNewUser } = useApp();
    const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const allStaff: StaffData[] = useMemo(() => [
        // FIX: Add explicit type for `t` to resolve property access and spread errors.
        ...Object.values(teachers).map((t: TeacherWithUser) => ({ ...t, role: 'শিক্ষক', details: t.subject } as StaffData)),
        // FIX: Add explicit type for `l` to resolve property access and spread errors.
        ...Object.values(librarians).map((l: LibrarianWithUser) => ({ ...l, role: 'লাইব্রেরিয়ান', details: 'Library' } as StaffData)),
        // FIX: Add explicit type for `d` to resolve property access and spread errors.
        ...Object.values(departmentHeads).map((d: DepartmentHeadWithUser) => ({ ...d, role: 'বিভাগীয় প্রধান', details: d.department } as StaffData)),
    ], [teachers, librarians, departmentHeads]);

    const handleEdit = (staff: StaffData) => {
        setIsAdding(false);
        setEditingStaff(staff);
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingStaff({
            id: '', name: '', email: '', phone: '', role: 'শিক্ষক', details: '', password: ''
        });
    };

    const handleSave = async (staffData: StaffData) => {
        try {
            if (isAdding) {
                await createNewUser(staffData);
                alert('নতুন স্টাফ সফলভাবে যোগ করা হয়েছে এবং তার জন্য একটি ইউজার একাউন্ট তৈরি করা হয়েছে।');
            } else {
                // TODO: Implement update logic for existing staff
                console.log("Saving staff:", staffData); 
                alert('স্টাফের তথ্য সেভ করা হয়েছে!');
            }
            setEditingStaff(null);
        } catch (error: any) {
            console.error("Failed to save staff:", error);
            if (error.message && error.message.toLowerCase().includes('user already registered')) {
                alert('এই ইমেইল দিয়ে ইতোমধ্যে একটি একাউন্ট আছে।');
            } else {
                alert(`স্টাফ যোগ করতে একটি সমস্যা হয়েছে: ${error.message}`);
            }
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-primary">স্টাফ তালিকা</h2>
                    <button onClick={handleAdd} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">
                        <i className="fas fa-plus mr-2"></i> নতুন স্টাফ যোগ করুন
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-4 font-semibold">নাম</th>
                                <th className="p-4 font-semibold">পদ</th>
                                <th className="p-4 font-semibold">বিষয়/বিভাগ</th>
                                <th className="p-4 font-semibold">ইমেইল</th>
                                <th className="p-4 font-semibold">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allStaff.map(staff => (
                                <tr key={staff.id} className="border-b">
                                    <td className="p-4 flex items-center gap-3">
                                        <img 
                                            src={staff.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=random&color=fff`}
                                            alt={staff.name} 
                                            className="w-10 h-10 rounded-full object-cover"
                                            onError={(e) => {
                                                const fallbackSrc = 'https://placehold.co/40x40/CCCCCC/FFFFFF?text=Photo';
                                                if (e.currentTarget.src !== fallbackSrc) {
                                                    e.currentTarget.src = fallbackSrc;
                                                }
                                            }}
                                        />
                                        <span className="font-medium text-accent">{staff.name}</span>
                                    </td>
                                    <td className="p-4 text-gray-700">{staff.role}</td>
                                    <td className="p-4 text-gray-700">{staff.details}</td>
                                    <td className="p-4 text-gray-700">{staff.email}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => handleEdit(staff)} className="text-amber-600 text-xl hover:text-amber-800" title="এডিট করুন"><i className="fas fa-edit"></i></button>
                                            <button className="text-danger text-xl hover:text-red-700" title="মুছে ফেলুন"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingStaff && (
                <EditStaffModal
                    staff={editingStaff}
                    onClose={() => setEditingStaff(null)}
                    onSave={handleSave}
                    isAdding={isAdding}
                    classes={Object.values(classes)}
                />
            )}
        </>
    );
};

export default StaffManagement;
