
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolSettings, Class, Section } from '../types';
import EditClassSectionModal from '../components/EditClassSectionModal';

const Settings: React.FC = () => {
    const { settings, updateSettings, classes, sections, subscription, backupData, restoreData } = useApp();
    const [formData, setFormData] = useState<SchoolSettings>(settings);
    const [editingItem, setEditingItem] = useState<{id: string, name: string} | null>(null);
    const [itemType, setItemType] = useState<'ক্লাস' | 'বিভাগ'>('ক্লাস');
    const [restoring, setRestoring] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            premiumFeatures: {
                ...prev.premiumFeatures,
                [name]: checked,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(formData);
        alert('সেটিংস সফলভাবে আপডেট করা হয়েছে!');
    };
    
    const handleSaveClassSection = (id: string, newName: string) => {
        alert(`${itemType} "${newName}" আপডেটেড (UI Only)`);
        setEditingItem(null);
    };

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read as text.");
                }
                const data = JSON.parse(text);
                setRestoring(true);
                await restoreData(data);
                alert('ডেটা সফলভাবে রিস্টোর করা হয়েছে!');
            } catch (error) {
                console.error("Restore failed:", error);
                alert('ডেটা রিস্টোর করতে সমস্যা হয়েছে। ফাইলটি সঠিক JSON ফরম্যাটে আছে কিনা তা নিশ্চিত করুন।');
            } finally {
                setRestoring(false);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };

    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-secondary focus:border-secondary";
    
    return (
        <>
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-6 border-b pb-3">স্কুল সেটিংস</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="font-medium text-gray-700">স্কুলের নাম</label>
                            <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className={fieldClasses}/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">অধ্যক্ষের নাম</label>
                            <input type="text" name="principalName" value={formData.principalName} onChange={handleChange} className={fieldClasses}/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">স্কুল লোগো URL</label>
                            <input type="url" name="schoolLogoUrl" value={formData.schoolLogoUrl} onChange={handleChange} className={fieldClasses}/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">অধ্যক্ষের স্বাক্ষর URL</label>
                            <input type="url" name="principalSignatureUrl" value={formData.principalSignatureUrl} onChange={handleChange} className={fieldClasses}/>
                        </div>
                     </div>
                     <div className="pt-4">
                        <h3 className="text-lg font-bold text-primary mb-2">প্রিমিয়াম ফিচার</h3>
                        <div className="flex items-center gap-4 p-3 bg-light rounded-lg">
                           <label className="flex items-center gap-2 font-medium">
                                <input 
                                    type="checkbox" 
                                    name="examManagement" 
                                    checked={formData.premiumFeatures.examManagement} 
                                    onChange={handleCheckboxChange} 
                                    className="h-5 w-5 rounded text-secondary focus:ring-secondary"
                                    disabled={subscription.status !== 'Active'}
                                />
                                পরীক্ষা ম্যানেজমেন্ট
                            </label>
                            {subscription.status !== 'Active' && <span className="text-xs text-danger">(সাবস্ক্রিপশন প্রয়োজন)</span>}
                        </div>
                     </div>
                    <div className="mt-6 flex justify-end">
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">
                           <i className="fas fa-save mr-2"></i> সেভ করুন
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ক্লাস ও বিভাগ ম্যানেজমেন্ট</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Class Management */}
                    <div>
                        <h3 className="text-lg font-semibold text-accent mb-3">ক্লাসসমূহ</h3>
                        <div className="space-y-2">
                           {/* FIX: Add explicit type for `c` to resolve property access errors. */}
                           {Object.values(classes).map((c: Class) => (
                               <div key={c.id} className="flex justify-between items-center bg-light p-2 rounded-md">
                                   <span>{c.name}</span>
                                   <div>
                                       <button onClick={() => { setItemType('ক্লাস'); setEditingItem(c);}} className="text-amber-600 hover:text-amber-800 mr-3" title="Edit"><i className="fas fa-edit"></i></button>
                                       <button className="text-danger hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                     {/* Section Management */}
                    <div>
                        <h3 className="text-lg font-semibold text-accent mb-3">বিভাগসমূহ</h3>
                        <div className="space-y-2">
                           {/* FIX: Add explicit type for `s` to resolve property access errors. */}
                           {Object.values(sections).map((s: Section) => (
                               <div key={s.id} className="flex justify-between items-center bg-light p-2 rounded-md">
                                   <span>{s.name}</span>
                                   <div>
                                       <button onClick={() => { setItemType('বিভাগ'); setEditingItem(s);}} className="text-amber-600 hover:text-amber-800 mr-3" title="Edit"><i className="fas fa-edit"></i></button>
                                       <button className="text-danger hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ডেটা ম্যানেজমেন্ট</h2>
                <div className="space-y-4">
                    <div className="bg-light p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-accent">সিস্টেমের ব্যাকআপ নিন</h3>
                            <p className="text-sm text-gray-600">সকল ডেটা একটি JSON ফাইলে ডাউনলোড করুন।</p>
                        </div>
                        <button onClick={backupData} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                            <i className="fas fa-download mr-2"></i> ডাউনলোড করুন
                        </button>
                    </div>
                     <div className="bg-light p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-accent">ব্যাকআপ থেকে রিস্টোর করুন</h3>
                            <p className="text-sm text-gray-600">একটি JSON ফাইল থেকে সকল ডেটা পুনরুদ্ধার করুন।</p>
                            <p className="text-xs text-danger mt-1">সতর্কতা: এটি বর্তমান সকল ডেটা মুছে ফেলবে।</p>
                        </div>
                        <label className={`bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition cursor-pointer ${restoring ? 'opacity-50' : ''}`}>
                            <i className="fas fa-upload mr-2"></i> {restoring ? 'রিস্টোর হচ্ছে...' : 'ফাইল আপলোড করুন'}
                            <input type="file" accept=".json" onChange={handleRestore} className="hidden" disabled={restoring} />
                        </label>
                    </div>
                </div>
            </div>

        </div>
        {editingItem && (
            <EditClassSectionModal
                item={editingItem}
                itemType={itemType}
                onClose={() => setEditingItem(null)}
                onSave={handleSaveClassSection}
            />
        )}
        </>
    );
};

export default Settings;
