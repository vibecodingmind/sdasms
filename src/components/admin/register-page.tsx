'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Building2,
  Phone,
  User,
  Mail,
  MapPin,
  Globe,
  FileText,
  BadgeCheck,
  Briefcase,
  Check,
  Shield,
} from 'lucide-react';
import { useApp } from './app-context';

type AccountType = 'personal' | 'organization';
type Step = 1 | 2 | 3;

/* =================== SHARED THEME TOGGLE =================== */
function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}

/* =================== SOCIAL LOGIN BUTTONS =================== */
function SocialButtons({ onSocialLogin, label }: { onSocialLogin: (p: 'google' | 'facebook' | 'github') => Promise<boolean>; label: string }) {
  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500">or {label} with</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onSocialLogin('google')}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm active:scale-[0.97] cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="hidden sm:inline">Google</span>
        </button>
        <button
          type="button"
          onClick={() => onSocialLogin('facebook')}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm active:scale-[0.97] cursor-pointer"
        >
          <svg className="h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="hidden sm:inline">Facebook</span>
        </button>
        <button
          type="button"
          onClick={() => onSocialLogin('github')}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm active:scale-[0.97] cursor-pointer"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </button>
      </div>
    </div>
  );
}

/* =================== PROGRESS BAR =================== */
function StepProgress({ step, accountType }: { step: Step; accountType: AccountType }) {
  const steps = [
    { n: 1, label: accountType === 'organization' ? 'Organization' : 'Account' },
    { n: 2, label: 'Your Info' },
    { n: 3, label: 'Security' },
  ];
  return (
    <div className="flex items-center gap-1.5 mb-5 px-1">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                step > s.n
                  ? 'bg-green-500 text-white scale-100'
                  : step === s.n
                    ? 'bg-[#6366F1] text-white ring-2 ring-[#6366F1]/30 scale-105'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}
            >
              {step > s.n ? <Check className="h-3 w-3" /> : s.n}
            </span>
            <span
              className={`text-xs font-medium transition-colors duration-200 ${
                step >= s.n ? 'text-[#6366F1]' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${step > s.n ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* =================== REGISTER PAGE =================== */
export function RegisterPage() {
  const { register, socialLogin, theme, toggleTheme, setAuthMode } = useApp();
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [step, setStep] = useState<Step>(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [company, setCompany] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    if (!agreeTerms) { setError('You must agree to the Terms of Service and Privacy Policy'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters long'); return; }
    if (password !== passwordConfirm) { setError('Passwords do not match'); return; }
    if (accountType === 'organization' && !company) { setError('Organization name is required'); return; }
    setSubmitting(true);
    try {
      const ok = await register({
        account_type: accountType, first_name: firstName, last_name: lastName,
        email, phone, company, organization_type, tax_number, address, city, country,
        password, password_confirm: passwordConfirm,
      });
      if (!ok) setError('Registration failed. Please check your information.');
    } catch { setError('Registration failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook' | 'github') => {
    setSubmitting(true);
    try { await socialLogin(provider); }
    catch { setError('Social sign-up failed.'); }
    finally { setSubmitting(false); }
  };

  const passwordStrength = (() => {
    if (!password) return { label: '', color: '', width: '0%' };
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
    if (s <= 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' };
    if (s <= 3) return { label: 'Good', color: 'bg-yellow-500', width: '60%' };
    if (s <= 4) return { label: 'Strong', color: 'bg-green-500', width: '80%' };
    return { label: 'Very Strong', color: 'bg-emerald-500', width: '100%' };
  })();

  const ic = 'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all duration-200';
  const icl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
  const icIcon = 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400';

  /* ===== STEP 1: Choose account type + Organization details (if org) ===== */
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300 relative">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6366F1] flex items-center justify-center mb-4 shadow-lg shadow-[#6366F1]/25 transition-transform duration-200 hover:scale-110">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create Account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Step 1 — Choose your account type</p>
          </div>

          <StepProgress step={step} accountType={accountType} />

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
            )}

            {/* Account Type Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => { setAccountType('personal'); setError(''); }}
                className={`relative flex flex-col items-center gap-2 py-5 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                  accountType === 'personal'
                    ? 'border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1] shadow-sm shadow-[#6366F1]/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {accountType === 'personal' && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
                <User className={`h-7 w-7 transition-colors duration-200 ${accountType === 'personal' ? 'text-[#6366F1]' : 'text-gray-400 group-hover:text-gray-500'}`} />
                <span>Personal</span>
                <span className="text-[10px] font-normal opacity-70">For individuals</span>
              </button>
              <button
                type="button"
                onClick={() => { setAccountType('organization'); setError(''); }}
                className={`relative flex flex-col items-center gap-2 py-5 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                  accountType === 'organization'
                    ? 'border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1] shadow-sm shadow-[#6366F1]/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {accountType === 'organization' && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
                <Building2 className={`h-7 w-7 transition-colors duration-200 ${accountType === 'organization' ? 'text-[#6366F1]' : 'text-gray-400 group-hover:text-gray-500'}`} />
                <span>Organization</span>
                <span className="text-[10px] font-normal opacity-70">Company / NGO</span>
              </button>
            </div>

            {/* Org fields — inline in step 1 */}
            {accountType === 'organization' && (
              <div className="space-y-3 mb-5 animate-[fadeIn_0.2s_ease-out]">
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Organization Details</p>
                </div>
                <div>
                  <label className={icl}>Organization Name *</label>
                  <div className="relative">
                    <Building2 className={icIcon} />
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={`${ic} pl-9`} placeholder="e.g. Acme Communications Ltd" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={icl}>Type</label>
                    <div className="relative">
                      <Briefcase className={icIcon} />
                      <select value={organizationType} onChange={(e) => setOrganizationType(e.target.value)} className={`${ic} pl-9 appearance-none cursor-pointer`}>
                        <option value="">Select type</option>
                        <option value="corporation">Corporation</option>
                        <option value="llc">LLC</option>
                        <option value="partnership">Partnership</option>
                        <option value="sole_proprietorship">Sole Proprietorship</option>
                        <option value="nonprofit">Non-Profit / NGO</option>
                        <option value="government">Government</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={icl}>Tax / VAT No.</label>
                    <div className="relative">
                      <BadgeCheck className={icIcon} />
                      <input type="text" value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} className={`${ic} pl-9`} placeholder="Optional" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={icl}>Address</label>
                  <div className="relative">
                    <MapPin className={icIcon} />
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={`${ic} pl-9`} placeholder="Street address" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={icl}>City</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={ic} placeholder="City" />
                  </div>
                  <div>
                    <label className={icl}>Country</label>
                    <div className="relative">
                      <Globe className={icIcon} />
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className={`${ic} pl-9 appearance-none cursor-pointer`}>
                        <option value="">Select</option>
                        <option value="TZ">Tanzania</option>
                        <option value="KE">Kenya</option>
                        <option value="UG">Uganda</option>
                        <option value="RW">Rwanda</option>
                        <option value="NG">Nigeria</option>
                        <option value="ZA">South Africa</option>
                        <option value="GH">Ghana</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social login for register */}
            <SocialButtons onSocialLogin={handleSocialRegister} label="sign up" />

            {/* Continue button */}
            <button
              type="button"
              onClick={() => {
                setError('');
                if (accountType === 'organization' && !company.trim()) { setError('Organization name is required'); return; }
                setStep(2);
              }}
              className="w-full mt-4 bg-[#6366F1] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#5558E6] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Back to login */}
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')} className="text-[#6366F1] hover:underline font-medium">Sign in</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ===== STEP 2: Personal info ===== */
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300 relative">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6366F1] flex items-center justify-center mb-4 shadow-lg shadow-[#6366F1]/25 transition-transform duration-200 hover:scale-110">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Information</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Step 2 — Tell us about yourself</p>
          </div>

          <StepProgress step={step} accountType={accountType} />

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
            <div className="space-y-4">
              {/* Summary of org info */}
              {accountType === 'organization' && company && (
                <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6366F1]/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-[#6366F1]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {[organizationType, city, country].filter(Boolean).join(' / ') || 'Organization'}
                    </p>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-[#6366F1] hover:underline font-medium shrink-0">Edit</button>
                </div>
              )}

              {/* First + Last name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={icl}>First Name *</label>
                  <div className="relative">
                    <User className={icIcon} />
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${ic} pl-9`} placeholder="First name" />
                  </div>
                </div>
                <div>
                  <label className={icl}>Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={ic} placeholder="Last name" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={icl}>Email Address *</label>
                <div className="relative">
                  <Mail className={icIcon} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${ic} pl-9`} placeholder="you@example.com" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={icl}>Phone Number</label>
                <div className="relative">
                  <Phone className={icIcon} />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${ic} pl-9`} placeholder="+255 xxx xxx xxx" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setError(''); setStep(1); }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  if (!firstName.trim()) { setError('First name is required'); return; }
                  if (!email.trim() || !email.includes('@')) { setError('A valid email is required'); return; }
                  setStep(3);
                }}
                className="flex-1 bg-[#6366F1] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#5558E6] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')} className="text-[#6366F1] hover:underline font-medium">Sign in</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ===== STEP 3: Security (password + terms) ===== */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300 relative">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#6366F1] flex items-center justify-center mb-4 shadow-lg shadow-[#6366F1]/25 transition-transform duration-200 hover:scale-110">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Secure Your Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Step 3 — Set up your password</p>
        </div>

        <StepProgress step={step} accountType={accountType} />

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-[#6366F1]/10 flex items-center justify-center shrink-0">
              {accountType === 'personal' ? <User className="h-4 w-4 text-[#6366F1]" /> : <Building2 className="h-4 w-4 text-[#6366F1]" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                {company || `${firstName} ${lastName}`.trim() || 'New User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {email || 'No email'} &middot; {accountType === 'personal' ? 'Personal' : 'Organization'}
                {phone ? ` &middot; ${phone}` : ''}
              </p>
            </div>
            <button type="button" onClick={() => setStep(2)} className="text-xs text-[#6366F1] hover:underline font-medium shrink-0">Edit</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}

            {/* Password */}
            <div>
              <label className={icl}>Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${ic} pr-10`}
                  placeholder="Min. 8 characters"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Password strength</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className={icl}>Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className={`${ic} pr-10`}
                  placeholder="Confirm your password"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {passwordConfirm && password === passwordConfirm && password.length >= 8 && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-[#6366F1] focus:ring-[#6366F1] bg-white dark:bg-gray-800"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                  I agree to the{' '}
                  <button type="button" className="text-[#6366F1] hover:underline font-medium">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" className="text-[#6366F1] hover:underline font-medium">Privacy Policy</button>
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setError(''); setStep(2); }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#6366F1] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#5558E6] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create {accountType === 'personal' ? 'Personal' : 'Organization'} Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Already have an account?{' '}
            <button onClick={() => setAuthMode('login')} className="text-[#6366F1] hover:underline font-medium">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
