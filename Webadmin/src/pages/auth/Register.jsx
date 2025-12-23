import React, { useState } from 'react';
import { User, Mail, Lock, Shield, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        password: ''
    });
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!formData.email.includes('@')) {
            alert("Please enter a valid email address");
            return;
        }
        setIsLoading(true);
        // Simulate API call to send OTP
        setTimeout(() => {
            setIsLoading(false);
            setShowOtp(true);
            alert(`OTP sent to ${formData.email} (Use 123456)`);
        }, 1500);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp === "123456") {
            setIsLoading(true);
            try {
                // Import API call locally to avoid top-level issues if not ready
                const { registerAdmin } = await import('../../services/api');

                await registerAdmin(formData);

                setTimeout(() => {
                    setIsLoading(false);
                    alert("Registration Successful & Saved to Database!");
                    navigate('/login');
                }, 1000);
            } catch (error) {
                console.error("Registration Error:", error);
                setIsLoading(false);
                alert("Failed to save to database. Check console.");
            }
        } else {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative">
            {/* Background Effects */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#1e293b]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 mb-4 shadow-lg shadow-blue-500/30">
                            <Shield className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Request Access</h2>
                        <p className="text-gray-400">Join the Nagar Alert response network</p>
                    </div>

                    {!showOtp ? (
                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            placeholder="John"
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Last Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Doe"
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Official Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="officer@gmail.com"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Department</label>
                                <div className="relative group">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="Traffic / Fire / Police"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Min. 8 characters"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} /> Sending Code...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                            <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <p className="text-gray-300 text-sm">We sent a verification code to</p>
                                <p className="text-white font-medium">{formData.email}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Enter Verification Code</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="000000"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-4 text-center text-3xl tracking-[0.5em] font-mono text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 group disabled:opacity-70">
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} /> Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify & Complete
                                        <CheckCircle size={18} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowOtp(false)}
                                className="w-full text-sm text-gray-400 hover:text-white transition-colors">
                                Change Email Address
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
