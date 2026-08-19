import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert">
        <p className="text-slate-500 italic mb-8">Last Updated: May 20, 2024</p>
        
        <h2>1. Information We Collect</h2>
        <p>Nexus News collects basic analytics to improve our service. This includes IP addresses, browser types, and pages visited. If you subscribe to our newsletter, we collect your email address.</p>
        
        <h2>2. How We Use Information</h2>
        <p>We use your information to deliver news content, personalize your experience, and send newsletter updates if you have opted in. We do not sell your personal data to third parties.</p>
        
        <h2>3. Cookies and Ad-Tech</h2>
        <p>We use cookies to remember your preferences (like Dark Mode) and to serve relevant advertisements via Google AdSense. These third-party partners may use their own cookies to track user interactions across the web.</p>
        
        <h2>4. Data Protection</h2>
        <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to request a copy of the data we hold about you or to request its deletion. For such requests, please contact us at privacy@nexusnews.com.</p>
      </div>
    </div>
  );
};

export default Privacy;