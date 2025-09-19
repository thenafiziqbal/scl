import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import EditClassSectionModal from '../components/EditClassSectionModal';
import { SchoolSettings, Class, Section } from '../types';

const Settings: React.FC = () => {
    const {
        settings,
        classes,
        sections,
        addClass,
        deleteClass,
        addSection,
        deleteSection,
        updateSettings,
        updateClass,
        updateSection
    } = useApp();

    const [localSettings, setLocalSettings] = useState<SchoolSettings>(settings);
    const [newClassName, setNewClassName] = useState('');
    const [newSectionName, setNewSectionName] = useState('');
    const [editingItem, setEditingItem] = useState<{ item: Class | Section, type: 'ক্লাস' | 'বিভাগ' } | null>(null);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'examManagement') {
            setLocalSettings(prev => ({
                ...prev,
                premiumFeatures: { ...prev.premiumFeatures, examManagement: checked }
            }));
        } else {
            setLocalSettings(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(localSettings);
        alert('সেটিংস সফলভাবে সেভ করা হয়েছে!');
    };

    const handleAddClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (newClassName.trim()) {
            addClass(newClassName);
            setNewClassName('');
        }
    };

    const handleAddSection = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSectionName.trim()) {
            addSection(newSectionName);
            setNewSectionName('');
        }
    };
    
    const handleDeleteClass = (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিতভাবে এই ক্লাসটি মুছে ফেলতে চান?')) {
            deleteClass(id);
        }
    };
    
    const handleDeleteSection = (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিতভাবে এই বিভাগটি মুছে ফেলতে চান?')) {
            deleteSection(id);
        }
    };
    
    const handleEditSave = (id: string, newName: string) => {
        if (editingItem?.type === 'ক্লাস') {
            updateClass(id, newName);
        } else if (editingItem?.type === 'বিভাগ') {
            updateSection(id, newName);
        }
        setEditingItem(null);
    };

    const darkInputClasses = "w-full p-2 border border-gray-400 rounded-md mt-1 bg-accent text-light focus:outline-none focus:ring-2 focus:ring-secondary transition-colors placeholder-gray-400";

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-accent mb-6">স্কুলের তথ্য ও PDF সেটিংস</h2>
                    <form className="space-y-4" onSubmit={handleSettingsSubmit}>
                        <div>
                            <label className="font-medium text-gray-700">স্কুলের নাম</label>
                            <input type="text" name="schoolName" value={localSettings.schoolName} onChange={handleSettingsChange} className={darkInputClasses}/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">স্কুলের লোগো URL</label>
                            <input type="url" name="schoolLogoUrl" value={localSettings.schoolLogoUrl || ''} onChange={handleSettingsChange} className={darkInputClasses}/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">অধ্যক্ষের নাম (সিলের জন্য)</label>
                            <input type="text" name="principalName" value={localSettings.principalName || ''} onChange={handleSettingsChange} className={darkInputClasses}/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">অধ্যক্ষের স্বাক্ষর URL</label>
                            <input type="url" name="principalSignatureUrl" value={localSettings.principalSignatureUrl || ''} onChange={handleSettingsChange} className={darkInputClasses}/>
                        </div>
                        <div className="pt-4">
                            <h3 className="text-lg font-bold text-accent mb-2">প্রিমিয়াম ফিচার ম্যানেজমেন্ট</h3>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="examManagement" checked={localSettings.premiumFeatures.examManagement} onChange={handleSettingsChange} className="h-5 w-5"/>
                                <span className="text-gray-700">পরীক্ষা ম্যানেজমেন্ট প্রিমিয়াম?</span>
                            </label>
                        </div>
                         <div className="mt-6 text-right">
                            <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">সেভ করুন</button>
                        </div>
                    </form>
                </div>
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-bold text-accent mb-4">ক্লাস ম্যানেজমেন্ট</h3>
                        <ul className="space-y-2 mb-4">
                            {Object.values(classes).map(c => (
                                <li key={c.id} className="flex justify-between items-center p-2 bg-light rounded-md">
                                    <span className="text-gray-800">{c.name}</span>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => setEditingItem({ item: c, type: 'ক্লাস'})} className="text-blue-600 hover:text-blue-800 transition-colors" title="এডিট করুন"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDeleteClass(c.id)} className="text-danger hover:text-red-700 transition-colors" title="মুছে ফেলুন"><i className="fas fa-trash"></i></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={handleAddClass} className="flex space-x-2">
                            <input 
                                type="text" 
                                placeholder="নতুন ক্লাসের নাম" 
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                className={darkInputClasses.replace('mt-1', '').trim()}
                            />
                            <button type="submit" className="bg-green-500 text-white px-4 rounded-md hover:bg-green-600 transition-colors">যোগ</button>
                        </form>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-bold text-accent mb-4">বিভাগ ম্যানেজমেন্ট</h3>
                         <ul className="space-y-2 mb-4">
                            {Object.values(sections).map(s => (
                                <li key={s.id} className="flex justify-between items-center p-2 bg-light rounded-md">
                                    <span className="text-gray-800">{s.name}</span>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => setEditingItem({ item: s, type: 'বিভাগ'})} className="text-blue-600 hover:text-blue-800 transition-colors" title="এডিট করুন"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDeleteSection(s.id)} className="text-danger hover:text-red-700 transition-colors" title="মুছে ফেলুন"><i className="fas fa-trash"></i></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={handleAddSection} className="flex space-x-2">
                            <input 
                                type="text" 
                                placeholder="নতুন বিভাগের নাম" 
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                                className={darkInputClasses.replace('mt-1', '').trim()}
                            />
                            <button type="submit" className="bg-green-500 text-white px-4 rounded-md hover:bg-green-600 transition-colors">যোগ</button>
                        </form>
                    </div>
                </div>
            </div>
            {editingItem && (
                <EditClassSectionModal 
                    item={editingItem.item}
                    itemType={editingItem.type}
                    onClose={() => setEditingItem(null)}
                    onSave={handleEditSave}
                />
            )}
        </>
    );
};

export default Settings;