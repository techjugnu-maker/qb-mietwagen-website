'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Send, RefreshCw } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const inputCls =
  'w-full bg-navy-950 border border-border-subtle/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-colors';

export default function KontaktForm() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [message, setMessage] = useState('');
  const [state,   setState]   = useState<FormState>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Serverfehler');
      setState('success');
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setState('error');
    }
  };

  const reset = () => {
    setName(''); setEmail(''); setPhone(''); setMessage('');
    setState('idle'); setErrMsg('');
  };

  if (state === 'success') {
    return (
      <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white">Nachricht erfolgreich gesendet!</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Vielen Dank, <strong className="text-white">{name}</strong>. Wir haben Ihre Anfrage
            erhalten und melden uns so schnell wie möglich bei Ihnen.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-950 border border-border-subtle text-xs text-slate-300 font-medium hover:text-white hover:border-slate-600 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Neue Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="kf-name" className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
          Name <span className="text-teal-400" aria-hidden>*</span>
        </label>
        <input
          id="kf-name" type="text" required autoComplete="name"
          placeholder="Vor- und Nachname"
          value={name} onChange={e => setName(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="kf-email" className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
          E-Mail-Adresse <span className="text-teal-400" aria-hidden>*</span>
        </label>
        <input
          id="kf-email" type="email" required autoComplete="email"
          placeholder="ihre@email.de"
          value={email} onChange={e => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="kf-phone" className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
          Telefonnummer{' '}
          <span className="text-slate-600 normal-case font-normal">(optional)</span>
        </label>
        <input
          id="kf-phone" type="tel" autoComplete="tel"
          placeholder="+49 151 …"
          value={phone} onChange={e => setPhone(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="kf-message" className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
          Ihre Nachricht <span className="text-teal-400" aria-hidden>*</span>
        </label>
        <textarea
          id="kf-message" required rows={5}
          placeholder="Womit können wir Ihnen helfen?"
          value={message} onChange={e => setMessage(e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      {state === 'error' && (
        <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 leading-relaxed">
          {errMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold rounded-xl text-sm hover:from-teal-400 hover:to-emerald-400 shadow-xl shadow-teal-500/10 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        {state === 'submitting'
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</>
          : <><Send className="w-4 h-4" /> Nachricht senden</>}
      </button>

      <p className="text-[10px] text-slate-600 text-center leading-relaxed">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{' '}
        <a href="/datenschutz" className="text-slate-500 hover:text-teal-400 underline transition-colors">
          Datenschutzerklärung
        </a>{' '}zu.
      </p>
    </form>
  );
}
