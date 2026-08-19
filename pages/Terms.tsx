import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-serif font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-slate dark:prose-invert">
        <p className="text-slate-500 italic mb-8">Effective Date: May 20, 2024</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing Nexus News, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our site.</p>
        
        <h2>2. Content Ownership</h2>
        <p>All content on Nexus News—including text, images, and logos—is the property of Nexus News or its content creators and is protected by international copyright laws.</p>
        
        <h2>3. User Conduct</h2>
        <p>Users are prohibited from using our site for any unlawful purpose, including scraping content without permission or attempting to disrupt our server operations.</p>
        
        <h2>4. Disclaimers</h2>
        <p>Nexus News provides content for informational purposes only. While we strive for accuracy, we are not responsible for errors or omissions. Financial news (especially Crypto) should not be taken as professional investment advice.</p>
        
        <h2>5. Limitation of Liability</h2>
        <p>Nexus News shall not be liable for any indirect, incidental, or consequential damages arising out of your use of our services.</p>
      </div>
    </div>
  );
};

export default Terms;