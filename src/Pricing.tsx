import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import supabase from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 resumes',
      'Basic AI generation',
      'ATS-optimized templates',
      'PDF download',
      'Resume editing',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '12',
    period: 'per month',
    description: 'Unlimited power for serious job seekers',
    features: [
      'Unlimited resumes',
      'Advanced AI generation',
      'Priority regeneration',
      'Multiple export formats',
      'Job-specific tailoring',
      'Priority support',
      'Resume analytics',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (plan === 'free') {
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: 'pro' }),
      });
      alert('Successfully upgraded to Pro! Enjoy unlimited resumes.');
      navigate('/dashboard');
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">PRICING</div>
        <h1 className="text-6xl font-semibold tracking-tight mt-6">Simple, transparent pricing</h1>
        <p className="mt-4 text-xl text-slate-600 max-w-md mx-auto">Start for free. Upgrade when you need unlimited resumes and advanced AI features.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-10 border ${plan.popular ? 'border-blue-600 shadow-xl ring-1 ring-blue-600' : 'border-slate-100'}`}
            >
              {plan.popular && (
                <div className="text-xs uppercase tracking-[2px] font-semibold text-blue-600 mb-3">MOST POPULAR</div>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-semibold tracking-tighter">${plan.price}</span>
                <span className="text-xl text-slate-400">/{plan.period}</span>
              </div>

              <div className="mt-2 text-2xl font-medium">{plan.name}</div>
              <div className="text-slate-600 mt-1">{plan.description}</div>

              <button
                onClick={() => handleSubscribe(plan.name.toLowerCase())}
                disabled={loading}
                className={`mt-8 w-full py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 transition ${plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-900 hover:bg-black text-white'}`}
              >
                {plan.cta}
                {plan.name === 'Pro' && <ArrowRight />}
              </button>

              <div className="mt-8 pt-8 border-t">
                <div className="text-sm font-medium text-slate-700 mb-4">Everything included:</div>
                <ul className="space-y-3">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="text-emerald-600" size={12} />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 text-sm text-slate-500">
          All plans include a 14-day money-back guarantee. Cancel anytime.
        </div>
      </div>
    </div>
  );
}
