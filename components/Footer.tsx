import React, { useState } from 'react';
import { Twitter, Facebook, Send, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const Footer: React.FC = () => {
  const { setSearchQuery } = useSearch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCategoryClick = (cat: string) => {
    setSearchQuery(cat);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email.');
      return;
    }
    setStatus('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage('Subscription failed.');
    }
  };

  return (
    <footer className="bg-slate-900 text-white mt-auto overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="space-y-6">
            <Link to="/" onClick={() => { setSearchQuery(''); window.scrollTo(0,0); }} className="inline-block">
               <span className="font-serif text-3xl font-bold tracking-tight text-white">
                Nexus<span className="text-brand-500">News</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Delivering the latest stories from around the globe with precision, aesthetic excellence, and high-fidelity insight.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://x.com/MiniDexTracker" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-brand-600 transition-all shadow-lg active:scale-95"
                aria-label="Follow us on X"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.facebook.com/share/1DTY2iErP2/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-brand-600 transition-all shadow-lg active:scale-95"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-brand-500 uppercase text-[10px] tracking-[0.2em]">Categories</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><button onClick={() => handleCategoryClick('Crypto')} className="hover:text-white transition-colors">Crypto Assets</button></li>
              <li><button onClick={() => handleCategoryClick('Technology')} className="hover:text-white transition-colors">Future Tech</button></li>
              <li><button onClick={() => handleCategoryClick('Politics')} className="hover:text-white transition-colors">Global Affairs</button></li>
              <li><button onClick={() => handleCategoryClick('Lifestyle')} className="hover:text-white transition-colors">Modern Living</button></li>
              <li><button onClick={() => handleCategoryClick('Business')} className="hover:text-white transition-colors">Markets & Finance</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-brand-500 uppercase text-[10px] tracking-[0.2em]">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About the Nexus</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Join our Newsroom</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800">
            <h4 className="font-bold mb-2 text-white">Join the Nexus</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Get the most important stories delivered straight to your inbox daily.</p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  disabled={status === 'loading' || status === 'success'}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder:text-slate-600 transition-all disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-500 text-white p-2 rounded-lg transition-all shadow-lg active:scale-90 disabled:bg-slate-700"
                >
                  {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold">
                  <CheckCircle2 size={14} /> You're on the list!
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="border-t border-slate-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Nexus News Media Group.</p>
          <div className="flex items-center gap-6">
            <span>Truth First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;