import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Article from './pages/Article';
import Admin from './pages/Admin';
import About from './pages/About';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ScrollToTop from './components/ScrollToTop';
import { SearchProvider } from './context/SearchContext';
import { BookmarkProvider } from './context/BookmarkContext';

/**
 * AdSenseManager handles the injection of the AdSense script.
 * It ensures ads are NOT loaded on the /admin route.
 * In HashRouter mode, location.pathname still correctly returns "/admin".
 */
const AdSenseManager: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    // If we are not on admin, inject the script if it doesn't exist
    if (!isAdmin) {
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6784308963951788";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    } else {
      console.log("AdSense injection blocked for Admin area.");
    }
  }, [isAdmin]);

  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Header />}
      <ScrollToTop />
      <AdSenseManager />
      <main className={`flex-grow ${isAdmin ? '' : 'pt-16 md:pt-20'}`}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <SearchProvider>
        <BookmarkProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </Layout>
        </BookmarkProvider>
      </SearchProvider>
    </Router>
  );
};

export default App;
