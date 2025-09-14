
import React from 'react';
import { useApp } from '../context/AppContext';

const Attendance: React.FC = () => {
    // This is a placeholder for the Attendance page.
    // The full implementation would require state management for selected class, date, and attendance status of each student.
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ছাত্রের হাজিরা নিন</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="font-medium">ক্লাস ও বিভাগ</label>
                        <select className="w-full p-2 border rounded-md bg-white">
                            <option>ষষ্ঠ শ্রেণী - ক শাখা</option>
                            <option>সপ্তম শ্রেণী - খ শাখা</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-medium">তারিখ</label>
                        <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-full p-2 border rounded-md"/>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-primary mb-4">ছাত্র তালিকা (ষষ্ঠ শ্রেণী - ক শাখা)</h3>
                <form>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-light rounded-md">
                            <span>১. আরিফ হোসেন</span>
                             <div className="flex space-x-2">
                                <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="student1" value="present" defaultChecked/> <span>উপস্থিত</span></label>
                                <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="student1" value="absent"/> <span>অনুপস্থিত</span></label>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-light rounded-md">
                            <span>২. ফারিয়া সুলতানা</span>
                            <div className="flex space-x-2">
                                <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="student2" value="present" defaultChecked/> <span>উপস্থিত</span></label>
                                <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="student2" value="absent"/> <span>অনুপস্থিত</span></label>
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-6">
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">
                            হাজিরা সেভ করুন
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Attendance;
