
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { backendUrl } from '../App';

const SendEmail = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ recipient: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/user/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setUsers(response.data.users || []);
                }
            } catch (error) {
                toast.error('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchUsers();
    }, [token]);

    const handleChange = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSending(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/admin/send-email`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                setForm({ recipient: '', subject: '', message: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send email');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="text-orange-500" /> Send email
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Recipient
                    <select name="recipient" value={form.recipient} onChange={handleChange} required disabled={loading || sending} className="mt-1 w-full border border-gray-300 rounded-md p-3">
                        <option value="">Choose a recipient</option>
                        <option value="all">All users</option>
                        {users.map((user) => <option key={user._id} value={user.email}>{user.name} ({user.email})</option>)}
                    </select>
                </label>
                <label className="block text-sm font-medium text-gray-700">
                    Subject
                    <input name="subject" value={form.subject} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-3" />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                    Message
                    <textarea name="message" value={form.message} onChange={handleChange} required rows="8" className="mt-1 w-full border border-gray-300 rounded-md p-3" />
                </label>
                <button type="submit" disabled={sending || loading} className="bg-orange-500 text-white px-5 py-3 rounded-md disabled:opacity-50">
                    {sending ? 'Sending...' : 'Send email'}
                </button>
            </form>
        </div>
    );
};

export default SendEmail;