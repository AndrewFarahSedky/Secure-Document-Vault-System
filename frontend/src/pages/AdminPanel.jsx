import { useState, useEffect } from 'react';
import { Users, Trash2, Shield } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    API.get('/admin/users').then(({ data }) => setUsers(data.users)).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      toast.success('Role updated!');
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted!');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">
          <Shield size={28} style={{ display:'inline', marginRight:8, color:'#3b82f6' }} />
          Admin Panel
        </h1>

        <div className="alert alert-info" style={{ marginBottom:20 }}>
          👑 Admin only — Manage users and roles
        </div>

        <div className="card">
          <h3 style={{ marginBottom:16 }}>
            <Users size={18} style={{ display:'inline', marginRight:6 }} />
            All Users ({users.length})
          </h3>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Provider</th>
                <th>2FA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td style={{ color:'#64748b', fontSize:13 }}>{user.email}</td>
                  <td>
                    <select value={user.role}
                      onChange={e => updateRole(user.id, e.target.value)}
                      style={{ background:'#0f172a', color:'#e2e8f0', border:'1px solid #334155',
                        borderRadius:6, padding:'4px 8px', cursor:'pointer' }}>
                      <option value="user">user</option>
                      <option value="manager">manager</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td><span className={`badge badge-${user.role}`}>{user.oauth_provider || 'local'}</span></td>
                  <td>{user.two_factor_enabled ? '✅' : '❌'}</td>
                  <td>
                    <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:12 }}
                      onClick={() => deleteUser(user.id)}>
                      <Trash2 size={12} style={{ display:'inline', marginRight:4 }} />Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}