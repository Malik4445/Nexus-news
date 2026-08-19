import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import NewsCard from '../components/NewsCard';
import { savePost, getPosts, updatePost, deletePost, uploadImage } from '../services/supabase';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Menu, 
  X, 
  ArrowLeft, 
  Home as HomeIcon, 
  AlertCircle, 
  Lock,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  Link as LinkIcon,
  Loader2,
  Database,
  Terminal,
  Copy
} from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [postList, setPostList] = useState<Post[]>([]);
  
  const CATEGORIES = ['Crypto', 'Technology', 'Politics', 'Business', 'Lifestyle'];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    title: '',
    category: 'Crypto',
    imageUrl: '',
    excerpt: '',
    body: '',
    author: 'Nexus News'
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info', code?: string } | null>(null);
  const [imageError, setImageError] = useState(false);

  // Policy Fix: Tell all crawlers (AdSense, Googlebot) to ignore this page entirely
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === 'nexus2024') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const fetchPostList = useCallback(async () => {
    try {
      const posts = await getPosts();
      setPostList(posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'list') {
      fetchPostList();
    }
  }, [isAuthenticated, activeTab, fetchPostList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') setImageError(false);
    if (message && message.type !== 'info') setMessage(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "File too large. Max 5MB.", type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: "Processing image...", type: 'info' });
    
    const result = await uploadImage(file);
    
    if (result.success && result.url) {
      setFormData(prev => ({ ...prev, imageUrl: result.url! }));
      setImageError(false);
      setMessage({ text: "Storage link generated.", type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: result.error || "Upload failed.", type: 'error' });
    }
    setUploading(false);
  };

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      category: post.category,
      imageUrl: post.imageUrl,
      excerpt: post.excerpt,
      body: post.body,
      author: post.author
    });
    setEditingId(post.id);
    setActiveTab('new');
    setImageMode('url');
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMessage({ text: `Editing: ${post.title}`, type: 'info' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete story?")) {
      const result = await deletePost(id);
      if (result.success) {
        fetchPostList();
        setMessage({ text: 'Article deleted.', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: `Delete failed: ${result.error}`, type: 'error' });
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setMessage(null);
    setImageError(false);
    setImageMode('url');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setMessage({ text: "Image is required.", type: 'error' });
      return;
    }

    setSaving(true);
    setMessage(null);

    let result;
    if (editingId) {
      result = await updatePost(editingId, formData);
      if (result.success) {
        setMessage({ text: 'Article updated live!', type: 'success' });
        setTimeout(() => { setActiveTab('list'); setMessage(null); }, 1500);
      }
    } else {
      result = await savePost(formData);
      if (result.success) {
        setMessage({ text: 'New article published!', type: 'success' });
        resetForm();
      }
    }
    
    if (result && !result.success) {
      setMessage({ 
        text: `Publication Failed. Error: ${result.error}`, 
        type: 'error',
        code: result.code
      });
    }
    setSaving(false);
  };

  const sqlFix = `ALTER TABLE news_posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Nexus Staff';`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlFix);
    alert("SQL copied! Run this in your Supabase SQL Editor.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl"><Lock size={32} /></div>
            <h1 className="text-3xl font-serif font-black dark:text-white text-center">Admin Access</h1>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <input type="password" autoFocus value={accessKey} onChange={(e) => setAccessKey(e.target.value)} placeholder="Access Key" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-center text-lg font-bold tracking-widest outline-none dark:text-white" />
            {authError && <p className="text-red-500 text-xs font-bold text-center uppercase">Access Denied</p>}
            <button type="submit" className="w-full bg-brand-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm">Unlock Hub <ChevronRight size={18} /></button>
          </form>
        </div>
      </div>
    );
  }

  const previewPost: Post = {
    id: 'preview',
    timestamp: Date.now(),
    ...formData,
    imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1504711432869-efd597cdd045?q=80&w=800'
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className={`w-64 md:w-72 bg-white dark:bg-slate-800 border-r dark:border-slate-700 fixed top-0 bottom-0 z-[60] transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">N</div>
              <span className="font-serif text-xl font-bold dark:text-white">Admin Hub</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={24} /></button>
          </div>
          <nav className="space-y-1">
            <button onClick={() => { setActiveTab('new'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium ${activeTab === 'new' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <PlusCircle size={18} className="mr-3" /> {editingId ? 'Edit Draft' : 'New Story'}
            </button>
            <button onClick={() => { setActiveTab('list'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium ${activeTab === 'list' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <LayoutDashboard size={18} className="mr-3" /> Catalog
            </button>
          </nav>
          <div className="mt-auto pt-6 border-t dark:border-slate-700">
             <Link to="/" className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400">
               <HomeIcon size={16} className="mr-3 text-brand-500" /> Public Site
             </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 md:lg:ml-72 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300"><Menu size={24} /></button>
          <span className="font-serif font-bold dark:text-white">Admin Hub</span>
          <div className="w-10"></div>
        </header>

        <div className="flex-grow p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'new' ? (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-serif font-black dark:text-white">{editingId ? 'Refine Article' : 'Compose News'}</h1>
                {editingId && <button onClick={resetForm} className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1 hover:text-red-500"><ArrowLeft size={14} /> Cancel Edit</button>}
              </div>

              {message && (
                <div className="space-y-4 mb-8">
                  <div className={`p-5 rounded-2xl flex items-start gap-4 shadow-sm border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : message.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-brand-50 border-brand-100 text-brand-800'}`}>
                    {message.type === 'error' ? <AlertCircle size={24} className="flex-shrink-0" /> : <CheckCircle2 size={24} className="flex-shrink-0" />}
                    <div className="space-y-1">
                      <p className="font-bold text-sm leading-tight uppercase tracking-wide">{message.type === 'error' ? 'Publication Error' : 'Update'}</p>
                      <p className="text-sm opacity-90 leading-relaxed">{message.text}</p>
                    </div>
                  </div>

                  {message.type === 'error' && (
                    <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-700 shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest">
                          <Terminal size={16} /> SQL Fix Required
                        </div>
                        <button onClick={copySql} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors">
                          <Copy size={12} /> Copy Code
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed italic">
                        Your Supabase table is missing columns. Run this in your SQL Editor:
                      </p>
                      <pre className="bg-black/50 p-4 rounded-xl text-[11px] font-mono text-green-400 overflow-x-auto">
                        {sqlFix}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-8">
                  <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border dark:border-slate-700">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Headline</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Bitcoin Hits All-Time High" className="w-full px-5 py-4 rounded-2xl border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-bold" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Topic Category</label>
                          <select name="category" value={formData.category} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold appearance-none">
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Author</label>
                          <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold" />
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Cover Image</label>
                          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border dark:border-slate-700">
                            <button type="button" onClick={() => setImageMode('url')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1.5 transition-all ${imageMode === 'url' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}><LinkIcon size={12} /> URL</button>
                            <button type="button" onClick={() => setImageMode('file')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1.5 transition-all ${imageMode === 'file' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}><Upload size={12} /> Upload</button>
                          </div>
                        </div>

                        {imageMode === 'url' ? (
                          <input type="url" name="imageUrl" required value={formData.imageUrl} onChange={handleChange} placeholder="Paste direct image link" className="w-full px-5 py-4 rounded-xl border dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white text-xs font-mono outline-none focus:ring-2 focus:ring-brand-500" />
                        ) : (
                          <div className="relative">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            <button 
                              type="button" 
                              disabled={uploading}
                              onClick={() => fileInputRef.current?.click()} 
                              className="w-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:border-brand-500 transition-colors group"
                            >
                              {uploading ? <Loader2 size={32} className="text-brand-500 animate-spin" /> : <ImageIcon size={32} className="text-slate-300 group-hover:text-brand-500" />}
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
                                {uploading ? 'Processing Image...' : (formData.imageUrl ? 'Replace Image' : 'Select File')}
                              </span>
                            </button>
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden min-h-[160px] border dark:border-slate-700 relative">
                           {formData.imageUrl && !imageError ? (
                             <img src={formData.imageUrl} alt="Preview" onError={() => setImageError(true)} className="w-full h-40 object-cover" />
                           ) : (
                             <div className="flex flex-col items-center gap-2 text-slate-400">
                               <ImageIcon size={32} />
                               <span className="text-[10px] font-bold uppercase tracking-wider">{imageError ? 'Invalid Image' : 'No image selected'}</span>
                             </div>
                           )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Short Excerpt (Search Preview)</label>
                        <textarea name="excerpt" required maxLength={150} value={formData.excerpt} onChange={handleChange} rows={2} className="w-full px-5 py-4 rounded-2xl border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white resize-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Main Article Content</label>
                        <textarea name="body" required value={formData.body} onChange={handleChange} rows={12} className="w-full px-5 py-4 rounded-2xl border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white font-serif leading-relaxed" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end pt-6 border-t dark:border-slate-700">
                      <button type="submit" disabled={saving || uploading} className="bg-brand-600 hover:bg-brand-700 text-white font-black px-12 py-4 rounded-2xl shadow-xl disabled:opacity-50 min-w-[160px] flex items-center justify-center uppercase tracking-widest text-sm">
                        {saving ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                        {saving ? 'Syncing...' : (editingId ? 'Push Updates' : 'Publish Now')}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="xl:col-span-4 hidden xl:block sticky top-10">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                     <Database size={12} className="text-brand-500" /> Bento Grid Preview
                   </div>
                   <div className="scale-90 origin-top shadow-2xl rounded-[2rem] overflow-hidden border dark:border-slate-700"><NewsCard post={previewPost} /></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-serif font-black dark:text-white">Story Catalog</h1>
                <button onClick={() => setActiveTab('new')} className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg"><PlusCircle size={18} /> New Entry</button>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border dark:border-slate-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                      <tr><th className="px-6 py-5">Headline</th><th className="px-6 py-5">Topic</th><th className="px-6 py-5 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {postList.length === 0 ? (
                        <tr><td colSpan={3} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Scanning Database...</td></tr>
                      ) : (
                        postList.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 group">
                            <td className="px-6 py-5 font-bold dark:text-white truncate max-w-[400px]">{p.title}</td>
                            <td className="px-6 py-5"><span className="px-3 py-1 bg-brand-50 dark:bg-slate-900 text-brand-600 dark:text-brand-400 rounded-full text-[10px] font-black uppercase tracking-widest">{p.category}</span></td>
                            <td className="px-6 py-5 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(p)} className="p-3 text-slate-400 hover:text-brand-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl"><Edit2 size={18} /></button>
                              <button onClick={() => handleDelete(p.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;