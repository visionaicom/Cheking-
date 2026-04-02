import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, RefreshCw, Download, Trash2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import type { Resume } from '../types';
import { useAuth } from '../hooks/useAuth';
import ResumePreview from '../components/ResumePreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<{ plan: string; status: string }>({ plan: 'free', status: 'active' });
  const [showPreview, setShowPreview] = useState<Resume | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const [resumesRes, subRes] = await Promise.all([
        fetch('/api/resumes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/subscriptions', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const resumesData = await resumesRes.json();
      const subData = await subRes.json();

      setResumes(resumesData);
      if (subData) setSubscription({ plan: subData.plan || 'free', status: subData.status || 'active' });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: number) => {
    if (!confirm('Delete this resume?')) return;

    const token = (await supabase.auth.getSession()).data.session?.access_token;
    await fetch('/api/resumes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const downloadPDF = async (resume: Resume) => {
    const previewEl = document.createElement('div');
    previewEl.style.position = 'absolute';
    previewEl.style.left = '-9999px';
    previewEl.style.width = '800px';
    document.body.appendChild(previewEl);

    const ReactDOM = await import('react-dom/client');
    const root = ReactDOM.createRoot(previewEl);
    root.render(<ResumePreview content={resume.content} />);

    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(previewEl.firstChild as HTMLElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${resume.title.replace(/\s+/g, '_')}.pdf`);

    document.body.removeChild(previewEl);
  };

  const regenerate = (resume: Resume) => {
    navigate(`/builder/${resume.id}`);
  };

  const freeLimit = 3;
  const isPro = subscription.plan === 'pro';
  const remaining = isPro ? 'Unlimited' : Math.max(0, freeLimit - resumes.length);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight">My Resumes</h1>
            <p className="text-slate-600 mt-3">Manage your saved resumes and create new ones</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-2 bg-white border rounded-2xl text-sm flex items-center gap-2">
              <span className="text-slate-500">Plan:</span>
              <span className="font-semibold capitalize">{subscription.plan}</span>
              {!isPro && (
                <Link to="/pricing" className="ml-2 text-blue-600 hover:underline">Upgrade</Link>
              )}
            </div>
            <Link
              to="/builder"
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition"
            >
              <Plus size={20} /> New Resume
            </Link>
          </div>
        </div>

        {!isPro && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold text-blue-900">Free Plan • {remaining} resumes remaining</div>
              <div className="text-blue-700 text-sm mt-1">Upgrade to Pro for unlimited resumes, AI regeneration, and priority support.</div>
            </div>
            <Link to="/pricing" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium whitespace-nowrap">Upgrade to Pro</Link>
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FileText size={40} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No resumes yet</h3>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">Create your first AI-powered resume and start applying for jobs.</p>
            <Link to="/builder" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl font-medium">
              Create Your First Resume
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl border overflow-hidden group"
              >
                <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => setShowPreview(resume)}>
                  <div className="scale-[0.35] origin-center pointer-events-none">
                    <ResumePreview content={resume.content} className="shadow-xl" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 text-white font-medium text-sm flex items-center gap-2">
                      Click to preview
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="font-semibold text-lg truncate">{resume.title}</div>
                  <div className="text-slate-500 text-sm mt-1 truncate">{resume.job_title} at {resume.company}</div>

                  <div className="flex gap-2 mt-5">
                    <button onClick={() => navigate(`/builder/${resume.id}`)} className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-2xl hover:bg-slate-50 text-sm font-medium">
                      <Edit2 size={15} /> Edit
                    </button>
                    <button onClick={() => regenerate(resume)} className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-2xl hover:bg-slate-50 text-sm font-medium">
                      <RefreshCw size={15} /> Regenerate
                    </button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => downloadPDF(resume)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-sm font-medium">
                      <Download size={15} /> Download PDF
                    </button>
                    <button onClick={() => deleteResume(resume.id)} className="px-4 flex items-center justify-center border border-red-200 text-red-600 rounded-2xl hover:bg-red-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(null)}>
          <div className="max-w-[900px] w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPreview(null)} className="absolute -top-12 right-0 text-white text-sm">Close Preview</button>
            <div className="overflow-auto max-h-[80vh]">
              <ResumePreview content={showPreview.content} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
