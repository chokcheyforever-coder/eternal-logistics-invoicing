import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface PinLockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ correctPin, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin === correctPin) {
        setTimeout(onUnlock, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      onUnlock();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071E3D] via-[#0B2545] to-[#134B70] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 text-center space-y-6">
        {/* Company Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg ring-4 ring-amber-300/30">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-wide">
            ENTERNAL LOGISTICS
          </h1>
          <p className="text-xs text-slate-500 font-khmer">
            ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ • សូមបញ្ចូលលេខសម្ងាត់ (PIN)
          </p>
        </div>

        {/* PIN Dots Display */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex justify-center items-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                  pin.length > index
                    ? 'bg-blue-600 border-blue-600 scale-110 shadow-sm'
                    : 'border-slate-300 bg-white'
                } ${error ? 'border-red-500 bg-red-100 animate-shake' : ''}`}
              />
            ))}
          </div>

          {/* Hidden or direct keyboard input */}
          <div className="relative">
            <input
              type="password"
              maxLength={6}
              value={pin}
              autoFocus
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPin(val);
                setError(false);
                if (val === correctPin) {
                  setTimeout(onUnlock, 150);
                }
              }}
              placeholder="Enter PIN (e.g. 8899)"
              className="w-full text-center font-mono text-lg font-black tracking-widest py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-red-600 font-khmer flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ! (Incorrect PIN)</span>
            </p>
          )}

          {/* Keypad for Touch / Mobile */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="py-3 text-lg font-bold font-mono rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 transition"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="py-3 text-xs font-bold rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="py-3 text-lg font-bold font-mono rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 transition"
            >
              0
            </button>
            <button
              type="submit"
              className="py-3 text-xs font-black rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition flex items-center justify-center shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Footer Hint */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-mono">
            Default Company PIN: <strong className="text-blue-900 font-bold">8899</strong>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            You can change this PIN anytime in Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
