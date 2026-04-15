'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Edit, Trash2, BookOpen, FileText, Tag, ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────
interface Article {
  id: number;
  title: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  views: number;
  last_updated: string;
  content?: string;
  tags?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  articles: number;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────
const initialCategories: Category[] = [
  { id: 1, name: 'Getting Started', description: 'Basic setup and quick start guides', articles: 8, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 2, name: 'SMS Sending', description: 'How to send SMS, manage contacts, and track delivery', articles: 12, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 3, name: 'Billing & Payments', description: 'Subscription plans, invoices, and payment methods', articles: 6, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 4, name: 'API & Integrations', description: 'REST API documentation and third-party integrations', articles: 10, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 5, name: 'Account Management', description: 'Profile settings, security, and team management', articles: 5, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { id: 6, name: 'Troubleshooting', description: 'Common issues and their solutions', articles: 15, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
];

const initialArticles: Article[] = [
  { id: 1, title: 'How to Send Your First SMS', category: 'Getting Started', status: 'published', author: 'Super Admin', views: 1250, last_updated: '2025-01-10' },
  { id: 2, title: 'Understanding SMS Delivery Reports', category: 'SMS Sending', status: 'published', author: 'Super Admin', views: 890, last_updated: '2025-01-08' },
  { id: 3, title: 'How to Register a Sender ID', category: 'SMS Sending', status: 'published', author: 'Support Manager', views: 2100, last_updated: '2025-01-12' },
  { id: 4, title: 'Managing Your Subscription Plan', category: 'Billing & Payments', status: 'published', author: 'Super Admin', views: 650, last_updated: '2025-01-05' },
  { id: 5, title: 'REST API Authentication Guide', category: 'API & Integrations', status: 'published', author: 'Super Admin', views: 1800, last_updated: '2025-01-14' },
  { id: 6, title: 'Setting Up Webhooks for Delivery Reports', category: 'API & Integrations', status: 'draft', author: 'Super Admin', views: 0, last_updated: '2025-01-15' },
  { id: 7, title: 'How to Import Contacts from CSV', category: 'Getting Started', status: 'published', author: 'Support Manager', views: 980, last_updated: '2025-01-09' },
  { id: 8, title: 'Two-Factor Authentication Setup', category: 'Account Management', status: 'published', author: 'Super Admin', views: 430, last_updated: '2025-01-11' },
  { id: 9, title: 'SMS Not Delivering? Common Causes', category: 'Troubleshooting', status: 'published', author: 'Support Manager', views: 3200, last_updated: '2025-01-13' },
  { id: 10, title: 'Payment Methods Explained', category: 'Billing & Payments', status: 'published', author: 'Billing Admin', views: 720, last_updated: '2025-01-07' },
];

// ─── Component ────────────────────────────────────────────────────
export function HelpCenterView() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState('articles');

  // Articles tab state
  const [articleSearch, setArticleSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Dialogs
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Article form
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStatus, setFormStatus] = useState('published');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');

  // Category form
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');

  // ─── Stats ─────────────────────────────────────────────────
  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const totalCategories = categories.length;

  // ─── Filtered articles ─────────────────────────────────────
  const filtered = useMemo(() => {
    return articles.filter((a) =>
      `${a.title} ${a.category} ${a.author}`.toLowerCase().includes(articleSearch.toLowerCase())
    );
  }, [articles, articleSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingEnd = Math.min(page * perPage, filtered.length);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, page]);

  // ─── Article handlers ──────────────────────────────────────
  const openArticleForm = (article?: Article) => {
    setEditingArticle(article || null);
    setFormTitle(article?.title || '');
    setFormCategory(article?.category || '');
    setFormStatus(article?.status || 'draft');
    setFormContent(article?.content || '');
    setFormTags(article?.tags || '');
    setArticleDialogOpen(true);
  };

  const handleArticleSubmit = () => {
    if (!formTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formCategory) {
      toast.error('Category is required');
      return;
    }

    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                title: formTitle,
                category: formCategory,
                status: formStatus as 'published' | 'draft',
                content: formContent,
                tags: formTags,
                last_updated: new Date().toISOString().split('T')[0],
              }
            : a
        )
      );
      toast.success('Article updated successfully');
    } else {
      const newArticle: Article = {
        id: Math.max(...articles.map((a) => a.id), 0) + 1,
        title: formTitle,
        category: formCategory,
        status: formStatus as 'published' | 'draft',
        author: 'Super Admin',
        views: 0,
        last_updated: new Date().toISOString().split('T')[0],
        content: formContent,
        tags: formTags,
      };
      setArticles((prev) => [newArticle, ...prev]);
      toast.success('Article created successfully');
    }
    setArticleDialogOpen(false);
  };

  const handleDeleteArticle = (id: number) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    toast.success('Article deleted');
  };

  // ─── Category handlers ─────────────────────────────────────
  const openCategoryForm = (category?: Category) => {
    setEditingCategory(category || null);
    setCatName(category?.name || '');
    setCatDescription(category?.description || '');
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = () => {
    if (!catName.trim()) {
      toast.error('Category name is required');
      return;
    }
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: catName, description: catDescription }
            : c
        )
      );
      toast.success('Category updated');
    } else {
      const newCat: Category = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        name: catName,
        description: catDescription,
        articles: 0,
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success('Category created');
    }
    setCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success('Category deleted');
  };

  const categoryColorMap: Record<string, string> = {
    'Getting Started': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'SMS Sending': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Billing & Payments': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'API & Integrations': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Account Management': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'Troubleshooting': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FEF2F2] dark:bg-[#D72444]/10 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-[#D72444]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Articles</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalArticles}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Published</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{publishedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
              <Edit className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Drafts</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{draftCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
              <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Categories</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalCategories}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent p-0 gap-0 h-auto">
          {[
            { value: 'articles', label: 'ARTICLES' },
            { value: 'categories', label: 'CATEGORIES' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'rounded-none border-b-2 px-4 py-2.5 text-xs font-semibold tracking-wide transition-all data-[state=active]:shadow-none',
                activeTab === tab.value
                  ? 'bg-[#D72444] text-white border-[#D72444]'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ─── ARTICLES TAB ──────────────────────────────── */}
        <TabsContent value="articles" className="mt-6 space-y-4">
          {/* Actions & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Button
              className="bg-[#28a745] hover:bg-[#218838] text-white gap-2"
              onClick={() => openArticleForm()}
            >
              <Plus className="h-4 w-4" />
              New Article
            </Button>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={articleSearch}
                onChange={(e) => { setArticleSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Title</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:table-cell">Category</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">Author</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">Views</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">Last Updated</TableHead>
                      <TableHead className="text-xs text-gray-500 dark:text-gray-400 font-medium w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                          No articles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paged.map((a) => (
                        <TableRow key={a.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                          <TableCell>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{a.title}</p>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={cn('text-[10px] hover:bg-transparent', categoryColorMap[a.category] || 'bg-gray-100 text-gray-600')}>
                              {a.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              'text-[10px] hover:bg-transparent',
                              a.status === 'published'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            )}>
                              {a.status === 'published' ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                            {a.author}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                            {a.views.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                            {a.last_updated}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                title="Edit"
                                onClick={() => openArticleForm(a)}
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete"
                                onClick={() => handleDeleteArticle(a.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {showingStart} to {showingEnd} of {filtered.length} entries
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  {pageNumbers.map((p, i) =>
                    typeof p === 'string' ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-gray-400">...</span>
                    ) : (
                      <Button
                        key={p}
                        variant={page === p ? 'default' : 'outline'}
                        size="sm"
                        className={cn('h-8 w-8 p-0', page === p && 'bg-[#D72444] hover:bg-[#B91E3A] text-white')}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CATEGORIES TAB ─────────────────────────────── */}
        <TabsContent value="categories" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button
              className="bg-[#28a745] hover:bg-[#218838] text-white gap-2"
              onClick={() => openCategoryForm()}
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card key={cat.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={cn('text-xs', cat.color)}>
                      {cat.name}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Edit"
                        onClick={() => openCategoryForm(cat)}
                      >
                        <Edit className="h-3.5 w-3.5 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{cat.description}</p>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{cat.articles} articles</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Article Dialog */}
      <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'Edit Article' : 'Create New Article'}</DialogTitle>
            <DialogDescription>
              {editingArticle ? 'Update the article details below.' : 'Fill in the details to create a new help center article.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="article-title">Title *</Label>
              <Input
                id="article-title"
                placeholder="Article title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="article-content">Content</Label>
              <Textarea
                id="article-content"
                placeholder="Write the article content here (supports Markdown)..."
                rows={8}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="article-tags">Tags</Label>
              <Input
                id="article-tags"
                placeholder="e.g., sms, delivery, api"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
              <p className="text-xs text-gray-400">Separate tags with commas</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setArticleDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#D72444] hover:bg-[#B91E3A] text-white"
              onClick={handleArticleSubmit}
            >
              {editingArticle ? 'Update Article' : 'Create Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the category details.' : 'Create a new category for organizing articles.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Category Name *</Label>
              <Input
                id="cat-name"
                placeholder="e.g., Getting Started"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                placeholder="Brief description of this category"
                rows={3}
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#D72444] hover:bg-[#B91E3A] text-white"
              onClick={handleCategorySubmit}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
