import { createClient } from '@supabase/supabase-js';
import { Post } from '../types';

const supabaseUrl = "https://namcvwucjwnzinprhvok.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbWN2d3VjanduemlucHJodm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDA3NzEsImV4cCI6MjA4MTU3Njc3MX0.BdBQYekOVpyA3CKA-zymz2dpd5xVZjM_9vKDLFnTWrQ";

export const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'news-images';

const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const mapPost = (data: any): Post => ({
  id: data.id.toString(),
  title: data.title || "Untitled",
  category: data.category || "General",
  imageUrl: data.image_url || "https://images.unsplash.com/photo-1504711432869-efd597cdd045?q=80&w=800",
  body: data.content || "",
  excerpt: data.excerpt || (data.content ? data.content.substring(0, 150) + "..." : ""),
  author: data.author || "Nexus Staff",
  timestamp: new Date(data.created_at).getTime(),
  aiSummary: data.ai_summary || undefined
});

export interface ServiceResponse {
  success: boolean;
  error?: string;
  code?: string;
  url?: string;
}

export const uploadImage = async (file: File): Promise<ServiceResponse> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message || "Upload failed." };
  }
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapPost);
  } catch (e) {
    return [];
  }
};

export const getPostById = async (id: string): Promise<Post | null> => {
  if (!isValidUUID(id)) return null;
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapPost(data);
  } catch (e) {
    return null;
  }
};

export const savePost = async (postData: Omit<Post, 'id' | 'timestamp'>): Promise<ServiceResponse> => {
  const payload = {
    title: postData.title,
    category: postData.category,
    image_url: postData.imageUrl,
    content: postData.body,
    excerpt: postData.excerpt,
    author: postData.author
  };

  const { error } = await supabase.from('news_posts').insert([payload]);

  if (error) {
    return { 
      success: false, 
      code: error.code,
      error: error.message 
    };
  }
  return { success: true };
};

export const updatePostSummary = async (id: string, summary: string): Promise<ServiceResponse> => {
  if (!isValidUUID(id)) return { success: false, error: "Invalid UUID format." };
  
  const { error } = await supabase
    .from('news_posts')
    .update({ ai_summary: summary })
    .eq('id', id);

  if (error) return { success: false, code: error.code, error: error.message };
  return { success: true };
};

export const updatePost = async (id: string, postData: Omit<Post, 'id' | 'timestamp'>): Promise<ServiceResponse> => {
  if (!isValidUUID(id)) return { success: false, error: "Invalid UUID format." };

  const payload = {
    title: postData.title,
    category: postData.category,
    image_url: postData.imageUrl,
    content: postData.body,
    excerpt: postData.excerpt,
    author: postData.author
  };

  const { error } = await supabase.from('news_posts').update(payload).eq('id', id);

  if (error) return { success: false, code: error.code, error: error.message };
  return { success: true };
};

export const deletePost = async (id: string): Promise<ServiceResponse> => {
  if (!isValidUUID(id)) return { success: false, error: "Invalid ID" };
  const { error } = await supabase.from('news_posts').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}