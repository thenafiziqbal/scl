
import React from 'react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
    const { settings, classes, sections } = useApp();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-6">স্কুলের তথ্য ও PDF সেটিংস</h2>
                <form className="space-y-4">
                    <div>
                        <label className="font-medium">স্কুলের নাম</label>
                        <input type="text" defaultValue={settings.schoolName} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                    <div>
                        <label className="font-medium">স্কুলের লোগো URL</label>
                        <input type="url" defaultValue={settings.schoolLogoUrl} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                    <div>
                        <label className="font-medium">অধ্যক্ষের নাম (সিলের জন্য)</label>
                        <input type="text" defaultValue={settings.principalName} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                    <div>
                        <label className="font-medium">অধ্যক্ষের স্বাক্ষর URL</label>
                        <input type="url" defaultValue={settings.principalSignatureUrl} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                    <div className="pt-4">
                        <h3 className="text-lg font-bold text-primary mb-2">প্রিমিয়াম ফিচার ম্যানেজমেন্ট</h3>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked={settings.premiumFeatures.examManagement} className="h-5 w-5"/>
                            <span>পরীক্ষা ম্যানেজমেন্ট প্রিমিয়াম?</span>
                        </label>
                    </div>
                     <div className="mt-6 text-right">
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">সেভ করুন</button>
                    </div>
                </form>
            </div>
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-primary mb-4">ক্লাস ম্যানেজমেন্ট</h3>
                    <ul className="space-y-2 mb-4">
                        {Object.values(classes).map(c => (
                            <li key={c.id} className="flex justify-between items-center p-2 bg-light rounded-md">
                                <span>{c.name}</span>
                                <button className="text-danger"><i className="fas fa-trash"></i></button>
                            </li>
                        ))}
                    </ul>
                    <form className="flex space-x-2">
                        <input type="text" placeholder="নতুন ক্লাসের নাম" className="w-full p-2 border rounded-md"/>
                        <button type="submit" className="bg-green-500 text-white px-4 rounded-md hover:bg-green-600">যোগ</button>
                    </form>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-primary mb-4">বিভাগ ম্যানেজমেন্ট</h3>
                     <ul className="space-y-2 mb-4">
                        {Object.values(sections).map(s => (
                            <li key={s.id} className="flex justify-between items-center p-2 bg-light rounded-md">
                                <span>{s.name}</span>
                                <button className="text-danger"><i className="fas fa-trash"></i></button>
                            </li>
                        ))}
                    </ul>
                    <form className="flex space-x-2">
                        <input type="text" placeholder="নতুন বিভাগের নাম" className="w-full p-2 border rounded-md"/>
                        <button type="submit" className="bg-green-500 text-white px-4 rounded-md hover:bg-green-600">যোগ</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
