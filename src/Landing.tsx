import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    desc: "Advanced AI crafts tailored, ATS-optimized resumes in seconds",
  },
  {
    icon: Award,
    title: "ATS-Friendly Format",
    desc: "Designed to pass Applicant Tracking Systems with 95%+ success rate",
  },
  {
    icon: Users,
    title: "Job-Targeted Resumes",
    desc: "Customized for specific roles and companies for maximum impact",
  },
];

const howItWorks = [
  { step: "01", title: "Enter Your Details", desc: "Provide your experience, skills, and target job" },
  { step: "02", title: "AI Generates Resume", desc: "Our AI creates a professional, optimized resume" },
  { step: "03", title: "Review & Customize", desc: "Edit sections and regenerate until perfect" },
  { step: "04", title: "Download & Apply", desc: "Export as PDF and land your dream job" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    text: "ResumAI helped me land my dream job. The AI-generated resume was perfect and passed ATS instantly.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Manager at Stripe",
    text: "The best resume builder I've used. Professional, clean, and the job-specific customization is incredible.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Data Scientist at Meta",
    text: "From resume to offer in 3 weeks. The AI really knows how to highlight achievements effectively.",
    rating: 5,
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Trusted by 50,000+ professionals
          </div>

          <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter mb-6">
            Land your dream job<br />with AI-crafted resumes
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Create ATS-optimized, job-specific resumes in minutes. Professional results guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="group inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-9 py-4 rounded-2xl font-medium text-lg transition"
            >
              Start Building Free
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-3 border-2 border-slate-900 hover:bg-slate-100 px-9 py-4 rounded-2xl font-medium text-lg transition"
            >
              See Pricing
            </Link>
          </div>

          <div className="mt-8 text-sm text-slate-500">No credit card required • 3 free resumes</div>
        </div>

        {/* Hero Visual */}
        <div className="relative max-w-[1000px] mx-auto px-6 pb-12">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img src="https://picsum.photos/id/1015/1200/680" alt="Resume preview" className="w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <div className="text-sm opacity-80">LIVE PREVIEW</div>
              <div className="text-3xl font-semibold mt-1">ATS-Optimized Resume</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="bg-slate-50 py-10 border-b">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-60">
          {["Google", "Meta", "Stripe", "Airbnb", "Notion", "OpenAI"].map((c) => (
            <div key={c} className="text-2xl font-semibold tracking-tighter text-slate-400">{c}</div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="text-blue-600 font-medium text-sm tracking-[3px]">POWERFUL FEATURES</div>
          <h2 className="text-5xl font-semibold tracking-tight mt-3">Everything you need to stand out</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-200 transition group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <feature.icon className="text-blue-600" size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div id="how" className="bg-white py-24 border-y">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-blue-600 font-medium text-sm tracking-[3px]">SIMPLE PROCESS</div>
            <h2 className="text-5xl font-semibold tracking-tight mt-3">How ResumAI works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-3xl border h-full">
                  <div className="text-blue-600 font-mono text-sm mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">★★★★★</div>
            <h2 className="text-4xl font-semibold tracking-tight mt-4">Loved by professionals</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">“{t.text}”</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gradient-to-br from-slate-900 to-black text-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-4">Ready to get hired?</h2>
          <p className="text-xl text-slate-400 mb-10">Join thousands who landed their dream jobs with ResumAI</p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="inline-block bg-white text-black px-12 py-4 rounded-2xl font-medium text-lg hover:bg-slate-100 transition"
          >
            Start Free Trial
          </Link>
          <div className="mt-4 text-sm text-slate-500">No credit card • Cancel anytime</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="font-semibold text-xl">ResumAI</span>
            </div>
            <p className="text-slate-500 text-sm">The intelligent way to build ATS-optimized resumes.</p>
          </div>
          <div>
            <div className="font-semibold mb-4">Product</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div>Features</div>
              <div>Pricing</div>
              <div>Examples</div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-4">Company</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div>About</div>
              <div>Blog</div>
              <div>Careers</div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-4">Legal</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div>Privacy</div>
              <div>Terms</div>
              <div>Security</div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ResumAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
