import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChevronRight, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logins from "./logins.json"
export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        let formUserName = formData.username;
        let formPassword = formData.password;
        checkLogin(formUserName, formPassword);
    };

    const checkLogin = (formUserName, formPassword) => {
        let logins = Logins.users;
        for (let i = 0; i < logins.length; i++) {
            if (formUserName === logins[i].username && formPassword === logins[i].password) {
                setLoginSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 500); // 500ms delay
                return;
            }
        }
        setLoginSuccess(false)
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-base-100 overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
                <div className="absolute inset-0 backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container max-w-md"
                >
                    {/* Logo and Back Link */}
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" className="text-2xl font-bold text-primary">
                            NexusAI
                        </Link>
                        <Link to="/" className="btn btn-ghost btn-sm gap-2">
                            <ArrowLeft size={16} />
                            Back to home
                        </Link>
                    </div>

                    {/* Sign in Card */}
                    <div className="card bg-base-200/50 backdrop-blur-lg border border-primary/20">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-6 h-6 text-primary" />
                                <h1 className="text-2xl font-bold">Sign in</h1>
                            </div>
                            {!loginSuccess ? <div className="alert alert-error">Invalid username or password</div> : null }
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Username</span>
                                    </label>
                                    <input
                                        type="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="input input-bordered bg-base-200/50 border-primary/20 focus:border-primary"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="input input-bordered w-full bg-base-200/50 border-primary/20 focus:border-primary"
                                            placeholder="Create a password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/70 hover:text-base-content"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}

                                <button
                                    onClick={(e) => handleSubmit(e)}
                                    type="submit"
                                    className="btn btn-primary w-full gap-2"
                                >
                                    Login
                                    <ChevronRight size={16} />
                                </button>
                            </form>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}