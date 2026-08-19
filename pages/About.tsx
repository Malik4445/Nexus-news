import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-5xl font-serif font-black text-slate-900 dark:text-white mb-8">About Nexus News</h1>
      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Nexus News is a cutting-edge digital media platform dedicated to delivering high-performance, precision journalism in an era of rapid information exchange. Founded on the principles of integrity and innovation, we strive to provide our readers with a sophisticated view of the modern world.
        </p>
        
        <h2 className="text-3xl font-serif font-bold mb-4">Our Editorial Philosophy</h2>
        <p>
          We believe that news should not just inform, but empower. Our editorial team focuses on deep-dive reporting that goes beyond the surface-level headlines. In an age of algorithmic noise, Nexus News serves as a beacon of clarity, prioritizing accuracy over speed and insight over engagement.
        </p>

        <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
        <p>
          In a world saturated with "noise," our mission is to act as a high-fidelity filter. We bridge the gap between complex global events and your understanding, providing insights into technology, crypto, politics, and culture with a focus on truth and aesthetic delivery.
        </p>
        
        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-xl mb-2">Unbiased Reporting</h3>
            <p className="text-sm">We maintain strict editorial independence, ensuring our stories are shaped by verifiable facts and diverse perspectives, not political or corporate agendas.</p>
          </div>
          <div className="bg-brand-50 dark:bg-brand-900/20 p-8 rounded-2xl border border-brand-100 dark:border-brand-900/30">
            <h3 className="font-bold text-xl mb-2 text-brand-600">Innovation First</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Leveraging state-of-the-art web technology to provide the fastest, most intuitive news-loading experience in the industry.</p>
          </div>
        </div>

        <h2 className="text-3xl font-serif font-bold mb-4">Global Reach, Local Impact</h2>
        <p>
          While our lens is global, our focus remains on the impact these stories have on individuals and communities. From the volatility of crypto markets to the nuances of international diplomacy, Nexus News provides the context needed to navigate the 21st century.
        </p>

        <h2 className="text-3xl font-serif font-bold mb-4">The Nexus Edge</h2>
        <p>
          Established in 2024, Nexus News was built on the belief that news consumption should be beautiful, intuitive, and lightning-fast. Our signature "Bento Grid" layout is designed to let you scan the most important headlines at a glance, while our deep-dive articles provide the comprehensive context you crave.
        </p>
      </div>
    </div>
  );
};

export default About;