import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import supabase from '../lib/supabase';
import type { Resume } from '../types';
import ResumePreview from '../components/ResumePreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch(`/api/resumes?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResume(data);
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!resume) return;

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

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div>Resume not found.</div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft /> Back to Dashboard
          </button>

          <button onClick={downloadPDF} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-medium">
            <Download size={18} /> Download PDF
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-sm text-slate-500">PREVIEW</div>
          <h1 className="text-4xl font-semibold tracking-tight mt-2">{resume.title}</h1>
        </div>

        <div className="flex justify-center">
          <ResumePreview content={resume.content} />
        </div>
      </div>
    </div>
  );
}
