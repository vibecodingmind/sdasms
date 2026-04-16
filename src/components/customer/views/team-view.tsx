'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Shield,
  MoreHorizontal,
  Trash2,
  Pencil,
  AlertTriangle,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCustomer } from '../customer-context';
import { toast } from 'sonner';
import {
  getAssignableCustomerRoles,
  canManageTeam as canManageTeamCheck,
  RoleMeta,
  canManageBilling,
  UserRole,
} from '@/lib/rbac';

// ==================== TYPES ====================
type MemberStatus = 'active' | 'pending' | 'inactive';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: MemberStatus;
  joinedAt: string;
  avatar?: string;
}

// ==================== MOCK DATA ====================
const initialMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Godlisten M',
    email: 'godlisten@alabaster.co.tz',
    role: 'customer_owner',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Anna K',
    email: 'anna@alabaster.co.tz',
    role: 'customer_admin',
    status: 'active',
    joinedAt: '2024-03-20',
  },
  {
    id: 3,
    name: 'Peter J',
    email: 'peter@alabaster.co.tz',
    role: 'customer_member',
    status: 'active',
    joinedAt: '2024-06-10',
  },
  {
    id: 4,
    name: 'Grace L',
    email: 'grace@alabaster.co.tz',
    role: 'customer_member',
    status: 'pending',
    joinedAt: '2025-01-08',
  },
  {
    id: 5,
    name: 'David M',
    email: 'david@alabaster.co.tz',
    role: 'customer_member',
    status: 'inactive',
    joinedAt: '2024-09-05',
  },
];

// ==================== HELPERS ====================
const roleHierarchy: Record<UserRole, number> = {
  super_admin: 100,
  admin: 90,
  support_admin: 80,
  billing_admin: 70,
  technical_admin: 60,
  viewer: 50,
  customer_owner: 40,
  customer_admin: 30,
  customer_member: 20,
};

function canEditMember(currentUserRole: UserRole, memberRole: UserRole): boolean {
  const currentLevel = roleHierarchy[currentUserRole] ?? 0;
  const memberLevel = roleHierarchy[memberRole] ?? 0;
  return currentLevel > memberLevel;
}

function canRemoveMember(currentUserRole: UserRole, memberRole: UserRole): boolean {
  const currentLevel = roleHierarchy[currentUserRole] ?? 0;
  const memberLevel = roleHierarchy[memberRole] ?? 0;
  return currentLevel > memberLevel;
}

const statusConfig: Record<
  MemberStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  active: {
    label: 'Active',
    className: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    icon: <Clock className="h-3 w-3 mr-1" />,
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
    icon: <XCircle className="h-3 w-3 mr-1" />,
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ==================== MAIN COMPONENT ====================
export function TeamView() {
  const { customerUser } = useCustomer();
  const currentUserRole = customerUser?.role || 'customer_member';

  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialogs
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  // Form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('customer_member');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editRoleValue, setEditRoleValue] = useState<UserRole>('customer_member');
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);

  // Computed
  const manageable = canManageTeamCheck(currentUserRole);
  const assignableRoles = getAssignableCustomerRoles(currentUserRole);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  // ==================== HANDLERS ====================
  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    // Check for duplicate
    if (members.some((m) => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast.error('A team member with this email already exists');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => [...prev, newMember]);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviteRole('customer_member');
    setInviteDialogOpen(false);
  };

  const openEditRoleDialog = (member: TeamMember) => {
    setEditingMember(member);
    setEditRoleValue(member.role);
    setEditRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingMember) return;
    if (editRoleValue === editingMember.role) {
      setEditRoleDialogOpen(false);
      return;
    }
    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id ? { ...m, role: editRoleValue } : m
      )
    );
    toast.success(`Role updated to ${RoleMeta[editRoleValue].label}`);
    setEditRoleDialogOpen(false);
    setEditingMember(null);
  };

  const openRemoveDialog = (member: TeamMember) => {
    setRemovingMember(member);
    setRemoveDialogOpen(true);
  };

  const handleRemove = () => {
    if (!removingMember) return;
    setMembers((prev) => prev.filter((m) => m.id !== removingMember.id));
    toast.success(`${removingMember.name} has been removed from the team`);
    setRemoveDialogOpen(false);
    setRemovingMember(null);
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#D72444]/10 text-[#D72444] shrink-0 mt-0.5">
              <Info className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Team Management
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Manage your team members and their roles. As the account {manageable ? 'owner or admin' : 'member'},
                {manageable
                  ? ' you can invite new members, edit roles, and remove team members with lower privileges than yours.'
                  : ' you can view team members but cannot make changes. Contact your account owner to request changes.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {members.length} Member{members.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {manageable && (
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white text-sm"
              onClick={() => {
                setInviteEmail('');
                setInviteRole(assignableRoles.includes('customer_member') ? 'customer_member' : assignableRoles[0]);
                setInviteDialogOpen(true);
              }}
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              Invite Member
            </Button>
          )}
        </div>
      </div>

      {/* Team Members Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 dark:bg-gray-800/40 hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Joined
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No team members match your search' : 'No team members yet'}
                      </p>
                      {!searchQuery && manageable && (
                        <Button
                          variant="link"
                          className="text-[#D72444] hover:text-[#C01E3A] text-sm mt-1"
                          onClick={() => setInviteDialogOpen(true)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Invite your first team member
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => {
                  const roleMeta = RoleMeta[member.role];
                  const statusCfg = statusConfig[member.status];
                  const editable = manageable && canEditMember(currentUserRole, member.role);
                  const removable = manageable && canRemoveMember(currentUserRole, member.role);

                  return (
                    <TableRow
                      key={member.id}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                              member.status === 'inactive'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                : 'bg-[#D72444]/10 text-[#D72444]'
                            }`}
                          >
                            {member.name
                              .split(' ')
                              .map((n) => n.charAt(0))
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate md:hidden">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {member.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-medium ${roleMeta.color}`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {roleMeta.label}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-medium ${statusCfg.className}`}
                        >
                          {statusCfg.icon}
                          {statusCfg.label}
                        </Badge>
                      </TableCell>

                      {/* Joined */}
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(member.joinedAt)}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        {(editable || removable) && (
                          <div className="flex items-center justify-end gap-1">
                            {editable && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-[#D72444] hover:bg-[#D72444]/5"
                                onClick={() => openEditRoleDialog(member)}
                                title="Edit role"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {removable && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => openRemoveDialog(member)}
                                title="Remove member"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D72444]/10 text-[#D72444]">
                <UserPlus className="h-4 w-4" />
              </div>
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to add a new member to your team. They will receive an email
              with instructions to join.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Email */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            {/* Role */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-gray-400" />
                        <span>{RoleMeta[role].label}</span>
                        <span className="text-xs text-gray-400">— {RoleMeta[role].description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role descriptions */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Role Permissions
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="font-medium">{RoleMeta.customer_owner.label}</strong> — Full access to all account features and team management
                  </span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="font-medium">{RoleMeta.customer_admin.label}</strong> — Can manage SMS, contacts, campaigns, and view billing
                  </span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="font-medium">{RoleMeta.customer_member.label}</strong> — Can send SMS and view basic account information
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleInvite}
            >
              <Mail className="h-4 w-4 mr-1.5" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D72444]/10 text-[#D72444]">
                <Pencil className="h-4 w-4" />
              </div>
              Edit Member Role
            </DialogTitle>
            <DialogDescription>
              {editingMember && (
                <>Change the role for <strong className="text-gray-800 dark:text-gray-200">{editingMember.name}</strong> ({editingMember.email}).</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Current member info */}
            {editingMember && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#D72444]/10 flex items-center justify-center text-[#D72444] text-sm font-semibold">
                  {editingMember.name
                    .split(' ')
                    .map((n) => n.charAt(0))
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {editingMember.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {editingMember.email}
                  </p>
                </div>
                <Badge className={`ml-auto text-[10px] ${RoleMeta[editingMember.role].color}`}>
                  Current: {RoleMeta[editingMember.role].label}
                </Badge>
              </div>
            )}

            {/* New Role */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                New Role
              </Label>
              <Select value={editRoleValue} onValueChange={(v) => setEditRoleValue(v as UserRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-gray-400" />
                        <span>{RoleMeta[role].label}</span>
                        <span className="text-xs text-gray-400">— {RoleMeta[role].description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#D72444] hover:bg-[#C01E3A] text-white"
              onClick={handleSaveRole}
              disabled={editRoleValue === editingMember?.role}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              Remove Team Member
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The member will lose access to the account immediately.
            </DialogDescription>
          </DialogHeader>

          {removingMember && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-semibold">
                  {removingMember.name
                    .split(' ')
                    .map((n) => n.charAt(0))
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {removingMember.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {removingMember.email}
                  </p>
                </div>
                <Badge className={`ml-auto text-[10px] ${RoleMeta[removingMember.role].color}`}>
                  {RoleMeta[removingMember.role].label}
                </Badge>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Warning:</strong> Removing {removingMember.name} will immediately revoke their
                  access to the account. Any active sessions will be terminated. This action cannot be reversed.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
