
import React from 'react';
import { useApp } from '../context/AppContext';

const Subscription: React.FC = () => {
    const { subscription } = useApp();

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">সাবস্ক্রিপশন স্ট্যাটাস</h2>
                <p className="text-gray-600">আপনার বর্তমান প্ল্যান: <strong className="text-primary">{subscription.tier}</strong></p>
                <p className="text-gray-600">
                    স্ট্যাটাস: 
                    <strong className={`ml-2 ${subscription.status === 'Active' ? 'text-success' : 'text-danger'}`}>
                        {subscription.status === 'Active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </strong>
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-primary text-center mb-6">আপনার প্ল্যান আপগ্রেড করুন</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border p-6 rounded-xl shadow-md text-center hover:shadow-2xl hover:-translate-y-1 transition-all">
                        <h3 className="text-xl font-bold text-primary mb-3">মাসিক প্ল্যান</h3>
                        <p className="text-4xl font-bold text-accent mb-4">৳৫০০<span className="text-lg font-normal">/মাস</span></p>
                        <ul className="space-y-2 text-gray-600 mb-6">
                            <li><i className="fas fa-check text-success mr-2"></i>সকল বেসিক ফিচার</li>
                            <li><i className="fas fa-check text-success mr-2"></i>৫০ জন ছাত্র</li>
                            <li><i className="fas fa-check text-success mr-2"></i>ইমেইল সাপোর্ট</li>
                        </ul>
                        <button className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-accent transition">এখনই কিনুন</button>
                    </div>
                     <div className="border-2 border-premium p-6 rounded-xl shadow-md text-center hover:shadow-2xl hover:-translate-y-1 transition-all relative">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-premium text-white px-4 py-1 rounded-full text-sm font-bold">জনপ্রিয়</div>
                        <h3 className="text-xl font-bold text-primary mb-3">বাৎসরিক প্ল্যান</h3>
                        <p className="text-4xl font-bold text-accent mb-4">৳৫০০০<span className="text-lg font-normal">/বছর</span></p>
                        <ul className="space-y-2 text-gray-600 mb-6">
                            <li><i className="fas fa-check text-success mr-2"></i>সকল প্রিমিয়াম ফিচার</li>
                            <li><i className="fas fa-check text-success mr-2"></i>আনলিমিটেড ছাত্র</li>
                            <li><i className="fas fa-check text-success mr-2"></i>অগ্রাধিকার সাপোর্ট</li>
                        </ul>
                        <button className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-accent transition">এখনই কিনুন</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
