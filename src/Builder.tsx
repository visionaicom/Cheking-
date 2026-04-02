import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import supabase from '../lib/supabase';
import type { Resume, ResumeContent, Experience, Education } from '../types';
import ResumePreview from '../components/ResumePreview';

export default function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    jobTitle: '',
    company: '',
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: '',
  });

  const [experience, setExperience] = useState<Experience[]>([
    { company: '', role: '', startDate: '', endDate: '', description: '' },
  ]);

  const [education, setEducation] = useState<Education[]>([
    { institution: '', degree: '', year: '', gpa: '' },
  ]);

  const [skills, setSkills] = useState<string[]>(['']);

  const [generatedContent, setGeneratedContent] = useState<ResumeContent | null>(null);

  useEffect(() => {
    if (id) loadResume();
  }, [id]);

  const loadResume = async () => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch(`/api/resumes?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Resume = await res.json();

    setResumeId(data.id);
    setFormData({
      title: data.title,
      jobTitle: data.job_title,
      company: data.company,
      name: data.content.name,
      email: data.content.email,
      phone: data.content.phone,
      linkedin: data.content.linkedin,
      summary: data.content.summary,
    });
    setExperience(data.content.experience.length ? data.content.experience : [{ company: '', role: '', startDate: '', endDate: '', description: '' }]);
    setEducation(data.content.education.length ? data.content.education : [{ institution: '', degree: '', year: '', gpa: '' }]);
    setSkills(data.content.skills.length ? data.content.skills : ['']);
  };

  const addExperience = () => {
    setExperience([...experience, { company: '', role: '', startDate: '', endDate: '', description: '' }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const removeExperience = (index: number) => {
    if (experience.length > 1) setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, { institution: '', degree: '', year: '', gpa: '' }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => setSkills([...skills, '']);
  const updateSkill = (index: number, value: string) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };
  const removeSkill = (index: number) => {
    if (skills.length > 1) setSkills(skills.filter((_, i) => i !== index));
  };

  const generateResume = async () => {
    setGenerating(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1800));

    const cleanSkills = skills.filter(s => s.trim());
    const cleanExp = experience.filter(e => e.company && e.role);
    const cleanEdu = education.filter(e => e.institution && e.degree);

    // Generate a professional summary
    const summary = formData.summary || `Results-driven ${formData.jobTitle || 'professional'} with ${cleanExp.length}+ years of experience in ${cleanSkills.slice(0, 3).join(', ')}. Proven track record of delivering impactful solutions at ${formData.company || 'leading organizations'}. Passionate about leveraging technology to drive business growth and innovation.`;

    const generated: ResumeContent = {
      name: formData.name || 'Alex Rivera',
      email: formData.email || 'alex.rivera@email.com',
      phone: formData.phone || '(415) 555-0123',
      linkedin: formData.linkedin || 'linkedin.com/in/alexrivera',
      summary,
      experience: cleanExp.length ? cleanExp : [
        {
          company: formData.company || 'TechCorp Inc.',
          role: formData.jobTitle || 'Senior Software Engineer',
          startDate: '2021',
          endDate: 'Present',
          description: 'Architected and delivered scalable microservices, reducing system latency by 45%. Led a cross-functional team of 8 engineers to successfully launch a major product feature used by 200k+ users.',
        },
      ],
      education: cleanEdu.length ? cleanEdu : [
        {
          institution: 'Stanford University',
          degree: 'M.S. Computer Science',
          year: '2019',
          gpa: '3.9',
        },
      ],
      skills: cleanSkills.length > 3 ? cleanSkills : ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'Python'],
    };

    setGeneratedContent(generated);
    setShowPreview(true);
    setGenerating(false);
  };

  const saveResume = async () => {
    if (!generatedContent) return;

    const token = (await supabase.auth.getSession()).data.session?.access_token;

    const payload = {
      title: formData.title || `${formData.jobTitle} Resume`,
      job_title: formData.jobTitle,
      company: formData.company,
      content: generatedContent,
    };

    if (resumeId) {
      await fetch('/api/resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: resumeId, ...payload }),
      });
    } else {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResumeId(data.id);
    }

    navigate('/dashboard');
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <div className="text-sm text-slate-500">Step 1 of 2 — Enter Details</div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight mb-2">Build your resume</h2>
              <p className="text-slate-600">Our AI will optimize it for the role you're targeting.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Resume Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Software Engineer Resume - Google"
                  className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Job Title</label>
                  <input
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="Senior Software Engineer"
                    className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Company</label>
                  <input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Google"
                    className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="font-semibold text-lg mb-4">Personal Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Rivera"
                      className="w-full px-5 py-3 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@email.com"
                      className="w-full px-5 py-3 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(415) 555-0123"
                      className="w-full px-5 py-3 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                    <input
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/alexrivera"
                      className="w-full px-5 py-3 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary (Optional)</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Leave blank and AI will generate a compelling summary for you..."
                  className="w-full px-5 py-3 border border-slate-200 rounded-xl h-24 resize-y"
                />
              </div>

              {/* Experience */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold text-lg">Work Experience</div>
                  <button onClick={addExperience} className="text-blue-600 text-sm font-medium">+ Add Experience</button>
                </div>
                {experience.map((exp, idx) => (
                  <div key={idx} className="mb-5 p-5 border rounded-2xl bg-slate-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                      <input placeholder="Role" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Start Date (e.g. 2020)" value={exp.startDate} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                      <input placeholder="End Date" value={exp.endDate} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                    </div>
                    <textarea placeholder="Key achievements and responsibilities..." value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl h-20 resize-y" />
                    {experience.length > 1 && <button onClick={() => removeExperience(idx)} className="text-xs text-red-500">Remove</button>}
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold text-lg">Education</div>
                  <button onClick={addEducation} className="text-blue-600 text-sm font-medium">+ Add Education</button>
                </div>
                {education.map((edu, idx) => (
                  <div key={idx} className="mb-5 p-5 border rounded-2xl bg-slate-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                      <input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Graduation Year" value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                      <input placeholder="GPA (Optional)" value={edu.gpa || ''} onChange={(e) => updateEducation(idx, 'gpa', e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl" />
                    </div>
                    {education.length > 1 && <button onClick={() => removeEducation(idx)} className="text-xs text-red-500">Remove</button>}
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold text-lg">Skills</div>
                  <button onClick={addSkill} className="text-blue-600 text-sm font-medium">+ Add Skill</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center bg-white border rounded-full pl-4 pr-2 py-1">
                      <input
                        value={skill}
                        onChange={(e) => updateSkill(idx, e.target.value)}
                        placeholder="JavaScript"
                        className="bg-transparent outline-none w-24"
                      />
                      {skills.length > 1 && (
                        <button onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-600 ml-1">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateResume}
              disabled={generating || !formData.name && !formData.jobTitle}
              className="w-full py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl font-medium text-lg disabled:opacity-50"
            >
              {generating ? (
                <> <Loader2 className="animate-spin" /> Generating with AI... </>
              ) : (
                <> <Sparkles /> Generate AI Resume </>
              )}
            </button>
          </div>

          {/* Live Preview */}
          <div className="sticky top-24 self-start">
            <div className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
              LIVE PREVIEW
            </div>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="p-5 bg-slate-900 text-white text-sm flex items-center justify-between">
                <div>ATS-Friendly Resume</div>
                <div className="px-3 py-1 bg-white/10 rounded text-xs">PREVIEW MODE</div>
              </div>
              <div className="overflow-auto max-h-[580px] bg-white">
                {generatedContent ? (
                  <ResumePreview content={generatedContent} className="scale-[0.8] origin-top" />
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Sparkles size={28} />
                    </div>
                    <div className="font-medium">Fill out the form and click Generate</div>
                    <div className="text-sm mt-2">AI will create a professional, optimized resume</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && generatedContent && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6">
          <div className="max-w-[900px] w-full">
            <div className="flex justify-between items-center mb-6 text-white">
              <div>
                <div className="text-sm opacity-70">PREVIEW YOUR RESUME</div>
                <div className="text-2xl font-semibold">Ready for download</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowPreview(false)} className="px-6 py-3 border border-white/40 text-white rounded-xl">Back to Edit</button>
                <button onClick={saveResume} className="px-8 py-3 bg-white text-black rounded-xl font-medium">Save & Finish</button>
              </div>
            </div>
            <div className="overflow-auto max-h-[75vh]">
              <ResumePreview content={generatedContent} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
