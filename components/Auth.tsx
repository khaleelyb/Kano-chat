
import React, { useState, useContext, useCallback } from 'react';
import { AuthContext, DataContext } from '../contexts';
import ImageUploader from './ImageUploader';
import { User } from '../types';
import Icon from './Icon';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [error, setError] = useState('');

    const auth = useContext(AuthContext);
    const data = useContext(DataContext);

    const handleFilesChange = useCallback((files: string[]) => {
        if (files.length > 0) {
            setProfilePicture(files[0]);
        } else {
            setProfilePicture(null);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        if (isLogin) {
            const user = data?.users.find(u => u.username === username);
            if (user && user.passwordHash === password) {
                auth?.login(user);
            } else {
                setError('Invalid username or password.');
            }
        } else {
             if (data?.users.some(u => u.username === username)) {
                setError('Username is already taken.');
                return;
            }
            if (!profilePicture) {
                setError('Please upload a profile picture.');
                return;
            }
            const newUser: User = {
                id: `user-${Date.now()}`,
                username,
                passwordHash: password,
                profilePicture
            };
            auth?.register(newUser);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <Icon name="logo" className="w-12 h-12 text-indigo-400" />
                        <h1 className="ml-2 text-4xl font-bold text-white">Kano Chat</h1>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-300">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                    <p className="mt-2 text-gray-400">
                        {isLogin ? 'Sign in to continue' : 'Join our community'}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-medium text-gray-400 mb-2">Profile Picture</label>
                            <ImageUploader onFilesChange={handleFilesChange} multiple={false} />
                        </div>
                    )}
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-300"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-sm text-indigo-400 hover:underline"
                        >
                            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
