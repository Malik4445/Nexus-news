import React from 'react';
import { Briefcase, MapPin, Search } from 'lucide-react';

const Careers: React.FC = () => {
  const jobs = [
    { title: "Senior Crypto Journalist", type: "Full-time", location: "Remote", dept: "Editorial" },
    { title: "React Frontend Engineer", type: "Full-time", location: "London / Remote", dept: "Engineering" },
    { title: "Data Investigative Reporter", type: "Contract", location: "New York", dept: "Editorial" },
    { title: "Ad-Tech Specialist", type: "Full-time", location: "Remote", dept: "Operations" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-5xl font-serif font-black text-slate-900 dark:text-white mb-6">Build the Future of Media</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Join a global team of journalists, designers, and engineers reshaping how the world consumes news.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
          {jobs.map((job, idx) => (
            <div key={idx} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{job.title}</h3>
                <div className="flex gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {job.dept}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium">{job.type}</span>
                <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Apply Now</button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl">
            <h3 className="text-2xl font-serif font-bold mb-4">Why Nexus?</h3>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex gap-3">
                <span className="text-brand-500 font-bold">01</span>
                Remote-first culture with flexible hours.
              </li>
              <li className="flex gap-3">
                <span className="text-brand-500 font-bold">02</span>
                Equity packages for all full-time employees.
              </li>
              <li className="flex gap-3">
                <span className="text-brand-500 font-bold">03</span>
                Annual learning & development stipend.
              </li>
              <li className="flex gap-3">
                <span className="text-brand-500 font-bold">04</span>
                Work with the latest AI and Web tech.
              </li>
            </ul>
          </div>
          <div className="border border-slate-200 dark:border-slate-700 p-8 rounded-3xl">
            <h3 className="font-bold mb-2">Can't find a role?</h3>
            <p className="text-sm text-slate-500 mb-4">We are always looking for exceptional talent. Send us your resume anyway!</p>
            <a href="mailto:careers@nexusnews.com" className="text-brand-600 font-bold text-sm hover:underline">General Application &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;