import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Mail,
  Search,
  Filter,
  Download,
  Send,
  CheckCircle,
  Clock,
  X,
  TrendingUp,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface WaitlistMetadata {
  [key: string]: string | number | boolean | null;
}

interface WaitlistEntry {
  id: string;
  email: string;
  project_id: string;
  product_id: string | null;
  position: number;
  status: 'waiting' | 'invited' | 'converted' | 'declined';
  metadata: WaitlistMetadata;
  created_at: string;
  invited_at: string | null;
  converted_at: string | null;
}

interface StatusUpdateData {
  status: WaitlistEntry['status'];
  invited_at?: string;
  converted_at?: string;
}

export default function WaitlistManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    invited: 0,
    converted: 0,
  });

  // Check if user is admin (in production, check profile.role)
  const isAdmin = true; // TODO: Check actual admin role from profile

  const loadWaitlist = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('waitlist_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedProject !== 'all') {
        query = query.eq('project_id', selectedProject);
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      if (searchQuery) {
        query = query.ilike('email', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setEntries(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const waiting = data?.filter((e) => e.status === 'waiting').length || 0;
      const invited = data?.filter((e) => e.status === 'invited').length || 0;
      const converted = data?.filter((e) => e.status === 'converted').length || 0;

      setStats({ total, waiting, invited, converted });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to load waitlist: ' + message);
    } finally {
      setLoading(false);
    }
  }, [selectedProject, selectedStatus, searchQuery]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    loadWaitlist();
  }, [isAuthenticated, isAdmin, navigate, loadWaitlist]);

  useEffect(() => {
    loadWaitlist();
  }, [loadWaitlist]);

  const updateStatus = async (id: string, newStatus: WaitlistEntry['status']) => {
    try {
      const updateData: StatusUpdateData = { status: newStatus };
      if (newStatus === 'invited') {
        updateData.invited_at = new Date().toISOString();
      }
      if (newStatus === 'converted') {
        updateData.converted_at = new Date().toISOString();
      }

      const { error } = await supabase.from('waitlist_entries').update(updateData).eq('id', id);

      if (error) throw error;

      toast.success('Status updated');
      loadWaitlist();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to update: ' + message);
    }
  };

  const sendInvite = async (entry: WaitlistEntry) => {
    try {
      // In production, this would send an email via your email service
      await updateStatus(entry.id, 'invited');
      toast.success(`Invite sent to ${entry.email}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to send invite: ' + message);
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Project', 'Product', 'Position', 'Status', 'Created At'];
    const rows = entries.map((e) => [
      e.email,
      e.project_id,
      e.product_id || 'N/A',
      e.position.toString(),
      e.status,
      new Date(e.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const projects = ['all', 'talai', 'librex', 'simcore', 'qmlab', 'mezan', 'optilibria'];

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Waitlist Management</h1>
              <p className="text-muted-foreground">Manage waitlist entries and send invites</p>
            </div>
            <Button onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <section className="mb-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Waiting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Invited</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.invited}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Converted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.converted}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project === 'all' ? 'All Projects' : project.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Entries Table */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Entries</CardTitle>
              <CardDescription>
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No entries found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Project</th>
                        <th className="text-left p-2">Product</th>
                        <th className="text-left p-2">Position</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Created</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry) => (
                        <tr key={entry.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{entry.email}</td>
                          <td className="p-2">
                            <Badge variant="outline">{entry.project_id}</Badge>
                          </td>
                          <td className="p-2">
                            {entry.product_id ? (
                              <Badge variant="secondary">{entry.product_id}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-2">#{entry.position}</td>
                          <td className="p-2">
                            <Badge
                              variant={
                                entry.status === 'converted'
                                  ? 'default'
                                  : entry.status === 'invited'
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {entry.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              {entry.status === 'waiting' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => sendInvite(entry)}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Invite
                                </Button>
                              )}
                              <Select
                                value={entry.status}
                                onValueChange={(value) =>
                                  updateStatus(entry.id, value as WaitlistEntry['status'])
                                }
                              >
                                <SelectTrigger className="w-[120px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="waiting">Waiting</SelectItem>
                                  <SelectItem value="invited">Invited</SelectItem>
                                  <SelectItem value="converted">Converted</SelectItem>
                                  <SelectItem value="declined">Declined</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}
