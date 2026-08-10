"use client";

import { useState, useEffect } from 'react';
import { 
  UserCheck, 
  UserX, 
  UserPlus, 
  Shield, 
  ShieldAlert, 
  KeyRound, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Search,
  Lock,
  CheckSquare,
  Square
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminUserItem {
  id: string;
  username: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SUB_ADMIN';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

const ALL_PERMISSIONS = [
  { key: 'surprises', label: '🎁 Surprises', description: 'View, edit & remove surprise cards' },
  { key: 'leads', label: '👥 Leads', description: 'Access collected user leads' },
  { key: 'contact', label: '💬 Contact Messages', description: 'View and respond to support messages' },
  { key: 'analytics', label: '📊 Analytics', description: 'View site traffic & growth metrics' },
  { key: 'storage', label: '💾 Storage', description: 'Monitor media storage & file limits' },
  { key: 'reports', label: '🚩 Reports', description: 'Review reported content & flags' },
  { key: 'settings', label: '⚙️ Settings', description: 'System configuration & preferences' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'SUB_ADMIN' as 'SUPER_ADMIN' | 'SUB_ADMIN',
    permissions: ['contact', 'leads'] as string[],
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const meRes = await fetch('/api/admin/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to load admin users. Super Admin access required.');
      }
    } catch (_err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      username: '',
      name: '',
      password: '',
      role: 'SUB_ADMIN',
      permissions: ['contact', 'leads'],
      isActive: true,
    });
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUserItem) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      password: '',
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.isActive,
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleTogglePermission = (permKey: string) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permKey);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permKey) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permKey] };
      }
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsCreateModalOpen(false);
        fetchData();
      } else {
        setFormError(data.error || 'Failed to create admin account');
      }
    } catch (_err) {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchData();
      } else {
        setFormError(data.error || 'Failed to update admin account');
      }
    } catch (_err) {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete the admin user "${username}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (_err) {
      alert('Error deleting user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Shield className="w-6 h-6 text-blue-400" />
            Admin Account & Access Management
          </h1>
          <p className="text-zinc-400 text-sm">Create and assign granular permissions to sub-admin accounts.</p>
        </div>

        {currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('*') ? (
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            Create Admin Account
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-400">
          <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <div className="font-bold text-base">{error}</div>
        </div>
      ) : null}

      {/* Filter / Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-white"
          />
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs uppercase bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Assigned Permissions</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Loading admin accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {user.name}
                      </div>
                      <div className="text-xs text-blue-400 font-mono mt-0.5">@{user.username}</div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      {user.role === 'SUPER_ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Shield className="w-3 h-3" />
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          Sub Admin
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 align-middle">
                      {user.role === 'SUPER_ADMIN' || user.permissions?.includes('*') ? (
                        <span className="text-xs text-emerald-400 font-medium">All Rights (*)</span>
                      ) : user.permissions?.length === 0 ? (
                        <span className="text-xs text-zinc-500 italic">No access granted</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.map((p) => (
                            <span key={p} className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 align-middle">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          <UserX className="w-3 h-3" /> Disabled
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 align-middle text-xs text-zinc-400">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </td>

                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Edit Access & Password"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        {user.username !== 'admin' && user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                Create New Admin User
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="e.g. support_john"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Admin Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="SUB_ADMIN">Sub Admin (Restricted Access)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Rights *)</option>
                </select>
              </div>

              {formData.role === 'SUB_ADMIN' && (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block text-xs font-semibold uppercase text-zinc-400">
                    Assign Permissions (What this user can access)
                  </label>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isChecked = formData.permissions.includes(perm.key);
                      return (
                        <div
                          key={perm.key}
                          onClick={() => handleTogglePermission(perm.key)}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isChecked 
                              ? 'bg-blue-500/10 border-blue-500/40 text-white' 
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{perm.label}</div>
                            <div className="text-xs text-zinc-500">{perm.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                Edit Admin Account (@{editingUser.username})
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                  Reset Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="New password (optional)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Account Status</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Disabled / Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Admin Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="SUB_ADMIN">Sub Admin (Restricted Access)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Rights *)</option>
                </select>
              </div>

              {formData.role === 'SUB_ADMIN' && (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block text-xs font-semibold uppercase text-zinc-400">
                    Assigned Permissions
                  </label>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isChecked = formData.permissions.includes(perm.key);
                      return (
                        <div
                          key={perm.key}
                          onClick={() => handleTogglePermission(perm.key)}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isChecked 
                              ? 'bg-blue-500/10 border-blue-500/40 text-white' 
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{perm.label}</div>
                            <div className="text-xs text-zinc-500">{perm.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
