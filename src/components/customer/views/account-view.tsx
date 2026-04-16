'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  User,
  Shield,
  Bell,
  KeyRound,
  Save,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useCustomer } from '../customer-context';
import { mockNotifications, mockTimezones } from '@/lib/mock-data';

// ==================== TYPES ====================
type AccountTab = 'account' | 'security' | 'notifications' | 'two-factor';

interface NotificationItem {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ==================== TAB CONFIG ====================
const tabs: { key: AccountTab; label: string; icon: React.ReactNode }[] = [
  { key: 'account', label: 'Account', icon: <User className="h-4 w-4" /> },
  { key: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { key: 'two-factor', label: 'Two-Factor Authentication', icon: <KeyRound className="h-4 w-4" /> },
];

// ==================== MAIN COMPONENT ====================
export function AccountView() {
  const { customerUser } = useCustomer();
  const [activeTab, setActiveTab] = useState<AccountTab>('account');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#D72444] text-white shadow-sm shadow-[#D72444]/25'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'account' && <AccountTabContent />}
      {activeTab === 'security' && <SecurityTabContent />}
      {activeTab === 'notifications' && <NotificationsTabContent />}
      {activeTab === 'two-factor' && <TwoFactorTabContent />}
    </div>
  );
}

// ==================== ACCOUNT TAB ====================
function AccountTabContent() {
  const { customerUser } = useCustomer();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(customerUser?.avatar || null);
  const [formData, setFormData] = useState({
    email: customerUser?.email || 'hello@sdasms.com',
    timezone: 'Africa/Dar_es_Salaam',
    first_name: customerUser?.first_name || '',
    last_name: customerUser?.last_name || '',
    language: 'English',
  });

  const displayName = customerUser
    ? `${customerUser.first_name} ${customerUser.last_name}`
    : 'User';
  const initials = customerUser
    ? `${customerUser.first_name.charAt(0)}${customerUser.last_name.charAt(0)}`
    : 'U';

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      toast.success('Avatar uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Avatar removed successfully');
  };

  const handleSave = () => {
    if (!formData.email || !formData.first_name || !formData.timezone || !formData.language) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-600">
                {avatar && <AvatarImage src={avatar} alt={displayName} />}
                <AvatarFallback className="bg-[#D72444] text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!avatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  className="bg-[#D72444] hover:bg-[#C01E3A] text-white text-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Upload
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 text-sm"
                  onClick={handleAvatarRemove}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Remove
                </Button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Recommended size: Width 300px x Height 300px
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            {/* Timezone */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Timezone <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {mockTimezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* First Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                First name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Last name
              </Label>
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Enter last name"
              />
            </div>

            {/* Language */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Language <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== SECURITY TAB ====================
function SecurityTabContent() {
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new_password: '',
    confirm: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.new_password || !passwordForm.confirm) {
      toast.error('All fields are required');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Password changed successfully');
      setPasswordForm({ current: '', new_password: '', confirm: '' });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Current Password */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Current password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              New password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showNew ? 'text' : 'password'}
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm new password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleChangePassword}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== NOTIFICATIONS TAB ====================
function NotificationsTabContent() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (!searchQuery.trim()) return notifications;
    const q = searchQuery.toLowerCase();
    return notifications.filter(
      (n) =>
        n.type.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
    );
  }, [notifications, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const endIdx = Math.min(startIdx + entriesPerPage, filteredNotifications.length);
  const paginatedNotifications = filteredNotifications.slice(startIdx, endIdx);

  // Reset page when search or entries change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(Number(value));
    setCurrentPage(1);
  };

  // Toggle read status
  const toggleReadStatus = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: !n.is_read } : n))
    );
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success('Notification deleted');
  };

  // Mark all as read
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success('All notifications marked as read');
  };

  // Delete selected
  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} notification(s) deleted`);
  };

  // Select/deselect individual
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select/deselect all on current page
  const toggleSelectAll = () => {
    const pageIds = paginatedNotifications.map((n) => n.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Show
            </label>
            <Select value={String(entriesPerPage)} onValueChange={handleEntriesChange}>
              <SelectTrigger className="w-[70px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              entries
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-3 h-8 w-full sm:w-64 text-sm"
            />
          </div>
          <div className="relative">
            <Select>
              <SelectTrigger className="h-8 w-[110px] text-sm bg-[#D72444] text-white border-[#D72444] hover:bg-[#C01E3A] focus:ring-[#D72444]/30">
                <SelectValue placeholder="Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mark-all-read" onSelect={markAllRead}>
                  Mark All as Read
                </SelectItem>
                <SelectItem
                  value="delete-selected"
                  onSelect={deleteSelected}
                  disabled={selectedIds.size === 0}
                >
                  Delete Selected ({selectedIds.size})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginatedNotifications.length > 0 && paginatedNotifications.every((n) => selectedIds.has(n.id))}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-[#D72444] focus:ring-[#D72444]"
                  />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                  Message
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider w-32">
                  Mark as Read
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedNotifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                    No notifications found
                  </td>
                </tr>
              ) : (
                paginatedNotifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                      !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(notification.id)}
                        onChange={() => toggleSelect(notification.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-[#D72444] focus:ring-[#D72444]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${
                          notification.type === 'Topup'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {notification.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 dark:text-gray-200 text-sm">
                        {notification.message}
                      </p>
                      {!notification.is_read && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleReadStatus(notification.id)}
                        className="inline-flex items-center justify-center transition-all duration-200 hover:scale-110"
                        title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {notification.is_read ? (
                          <ToggleLeft className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                        ) : (
                          <ToggleRight className="h-7 w-7 text-[#D72444]" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {filteredNotifications.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Showing {startIdx + 1} to {endIdx} of {filteredNotifications.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-[#D72444] text-white shadow-sm'
                      : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== TWO-FACTOR AUTH TAB ====================
function TwoFactorTabContent() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnable = () => {
    setLoading(true);
    setTimeout(() => {
      setEnabled(true);
      setLoading(false);
      toast.success('Two-Factor Authentication enabled successfully');
    }, 1000);
  };

  const handleDisable = () => {
    setLoading(true);
    setTimeout(() => {
      setEnabled(false);
      setLoading(false);
      toast.success('Two-Factor Authentication disabled');
    }, 800);
  };

  return (
    <div className="max-w-3xl">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Use a one-time password authenticator on your mobile device or computer to enable
            two-factor authentication (2FA). This adds an extra layer of security to your account
            by requiring a verification code in addition to your password when signing in.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
            <Badge
              className={`text-sm font-medium ${
                enabled
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          {!enabled ? (
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleEnable}
              disabled={loading}
            >
              <Shield className="h-4 w-4 mr-1.5" />
              {loading ? 'Enabling...' : 'Enable Two-Factor Authentication'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  Two-Factor Authentication is active. Your account is protected with an additional security layer.
                </p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                onClick={handleDisable}
                disabled={loading}
              >
                <Shield className="h-4 w-4 mr-1.5" />
                {loading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
