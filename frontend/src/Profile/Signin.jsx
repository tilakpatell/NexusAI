import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChevronRight, ArrowLeft, Shield } from 'lucide-react';
import { Background } from "./Background.jsx";
import Logins from "../JSON files/logins.json";
import { useAuth } from "../GlobalVariables/AuthContext.jsx";
import { useUser } from "../GlobalVariables/UserContext.jsx";

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(true);
    const [formData, setFormData] = useState({
                                                 username: '',
                                                 password: '',
                                             });
    const navigate = useNavigate();
    const { setLoginHappened } = useAuth();
    const {loginUser} = useUser();

    const handleSubmit = (e) => {
        e.preventDefault();
        checkLogin(formData.username, formData.password);
    };

    const checkLogin = (formUserName, formPassword) => {
        for (let i = 0; i < Logins.users.length; i++) {
            const username = Logins.users[i].username;
            const password = Logins.users[i].password;
            if (username === formUserName && password === formPassword) {
                setLoginSuccess(true);
                setLoginHappened(true);

                // Login with all user data from Logins.json
                loginUser({
                    userId: Logins.users[i].userId,
                    username: Logins.users[i].username,
                    password: Logins.users[i].password,
                    name: Logins.users[i].name,
                    orders: Logins.users[i].orders
                });

                setTimeout(() => navigate('/'), 500);
                return;
            }
        }
        setLoginSuccess(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen overflow-hidden">
            {/* Animated Background */}
            <Background />

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" className="text-2xl font-light text-gray-900 dark:text-white">
                            Nexus AI
                        </Link>
                        <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to home
                        </Link>
                    </div>

                    {/* Sign in Card */}
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10">
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h1 className="text-2xl font-light text-gray-900 dark:text-white">Sign in</h1>
                            </div>

                            {!loginSuccess && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                                    Invalid username or password
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900
                                                 border border-gray-200 dark:border-gray-700
                                                 text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                                 focus:border-transparent transition-all"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900
                                                     border border-gray-200 dark:border-gray-700
                                                     text-gray-900 dark:text-white
                                                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                                     focus:border-transparent transition-all"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2
                                                     text-gray-500 dark:text-gray-400
                                                     hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 rounded-lg
                                             bg-blue-600 hover:bg-blue-700
                                             text-white font-medium
                                             transition-colors
                                             flex items-center justify-center gap-2"
                                >
                                    Sign in
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}