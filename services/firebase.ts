import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, Timestamp, query, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { Post } from '../types';

// TODO: Replace with your actual Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db: any = null;
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase not configured correctly, falling back to localStorage.");
}

const STORAGE_KEY = 'nexus_news_posts';

export const savePost = async (postData: Omit<Post, 'id' | 'timestamp'>): Promise<boolean> => {
  try {
    if (db) {
      await addDoc(collection(db, "posts"), {
        ...postData,
        timestamp: Timestamp.now()
      });
      return true;
    } else {
      const newPost: Post = {
        ...postData,
        id: Date.now().toString(),
        timestamp: Date.now()
      };
      const existing = localStorage.getItem(STORAGE_KEY);
      const posts = existing ? JSON.parse(existing) : [];
      posts.push(newPost);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      return true;
    }
  } catch (error) {
    console.error("Error saving post:", error);
    return false;
  }
};

export const updatePost = async (id: string, postData: Omit<Post, 'id' | 'timestamp'>): Promise<boolean> => {
  try {
    if (db) {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, { ...postData });
      return true;
    } else {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) return false;
      const posts: Post[] = JSON.parse(existing);
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...postData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return false;
  }
};

export const deletePost = async (id: string): Promise<boolean> => {
  try {
    if (db) {
      await deleteDoc(doc(db, "posts", id));
      return true;
    } else {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) return false;
      let posts: Post[] = JSON.parse(existing);
      posts = posts.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      return true;
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};

export const getPosts = async (): Promise<Post[]> => {
  if (db) {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis() || Date.now()
    })) as Post[];
  } else {
    const existing = localStorage.getItem(STORAGE_KEY);
    const posts: Post[] = existing ? JSON.parse(existing) : [];
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  }
};

export const getPostById = async (id: string): Promise<Post | null> => {
  if (db) {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data(), timestamp: docSnap.data().timestamp?.toMillis() } as Post;
    }
    return null;
  } else {
    const existing = localStorage.getItem(STORAGE_KEY);
    const posts: Post[] = existing ? JSON.parse(existing) : [];
    return posts.find(p => p.id === id) || null;
  }
};

export const seedInitialData = () => {
  if (!localStorage.getItem(STORAGE_KEY) && !db) {
    const seeds: Post[] = [
      {
        id: "1",
        title: "The Future of AI in Modern Architecture",
        excerpt: "How generative algorithms are reshaping skylines across the globe.",
        category: "Technology",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        body: "Generative design is not just a buzzword; it's a fundamental shift in how we conceive urban spaces...",
        author: "Alex Rivera",
        timestamp: Date.now()
      },
      {
        id: "2",
        title: "Bitcoin Breaks New Barriers in Global Finance",
        excerpt: "The leading cryptocurrency hits major milestones as institutional adoption grows.",
        category: "Crypto",
        imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
        body: "The landscape of digital assets is evolving rapidly. As Bitcoin integrates further into traditional financial systems...",
        author: "Crypto Insider",
        timestamp: Date.now() - 50000
      },
      {
        id: "3",
        title: "Minimalism: A Guide to Living with Less",
        excerpt: "Why decluttering your space can lead to a clearer mind.",
        category: "Lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800",
        body: "In an age of constant consumption, the philosophy of 'less is more' offers a refreshing path to tranquility...",
        author: "Sarah Jenks",
        timestamp: Date.now() - 100000
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
  }
};