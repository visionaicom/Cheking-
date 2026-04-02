import type { ResumeContent } from '../types';

interface ResumePreviewProps {
  content: ResumeContent;
  className?: string;
}

export default function ResumePreview({ content, className = '' }: ResumePreviewProps) {
  return (
    <div className={`bg-white shadow-2xl rounded-2xl overflow-hidden ${className}`} style={{ maxWidth: '210mm', margin: '0 auto' }}>
      <div className="p-12">
        {/* Header */}
        <div className="text-center border-b pb-8 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{content.name}</h1>
          <div className="mt-3 flex justify-center gap-6 text-slate-600 text-sm">
            <a href={`mailto:${content.email}`} className="hover:text-blue-600 transition">{content.email}</a>
            <span>{content.phone}</span>
            {content.linkedin && (
              <a href={content.linkedin} target="_blank" className="hover:text-blue-600 transition">LinkedIn</a>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-600 to-violet-600"></div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-[2px] uppercase">Professional Summary</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-600 to-blue-600"></div>
          </div>
          <p className="text-slate-700 leading-relaxed text-[15px]">{content.summary}</p>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-600 to-violet-600"></div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-[2px] uppercase">Experience</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-600 to-blue-600"></div>
          </div>
          <div className="space-y-7">
            {content.experience.map((exp, index) => (
              <div key={index} className="pl-5 border-l-2 border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-900 text-lg">{exp.role}</div>
                    <div className="text-blue-600 font-medium">{exp.company}</div>
                  </div>
                  <div className="text-right text-sm text-slate-500 whitespace-nowrap">
                    {exp.startDate} — {exp.endDate}
                  </div>
                </div>
                <p className="mt-3 text-slate-700 text-[14px] leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-600 to-violet-600"></div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-[2px] uppercase">Education</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-600 to-blue-600"></div>
          </div>
          <div className="space-y-4">
            {content.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start pl-5 border-l-2 border-slate-200">
                <div>
                  <div className="font-semibold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <div>{edu.year}</div>
                  {edu.gpa && <div className="text-slate-400">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-600 to-violet-600"></div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-[2px] uppercase">Skills & Technologies</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-600 to-blue-600"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
