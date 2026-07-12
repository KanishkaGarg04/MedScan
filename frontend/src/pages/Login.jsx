import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, BrainCircuit, FileText, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Floating Elements */}
      <div className="absolute top-20 left-20 text-teal-500/10 animate-pulse"><BrainCircuit size={160} /></div>
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        {/* Left Side: Branding */}
        <div className="hidden lg:block space-y-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">MedScan</h1>
          <h2 className="text-4xl font-semibold text-slate-800 dark:text-white leading-tight">AI-Powered Medical Report Analyzer</h2>
          <p className="text-slate-600 text-lg">Analyze complex medical reports instantly with clinical-grade AI precision.</p>
          
          <div className="grid grid-cols-3 gap-4">
            {[ {icon: FileText, label: "OCR Extraction"}, {icon: BrainCircuit, label: "AI Insights"}, {icon: ShieldCheck, label: "Secure History"} ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl shadow-sm border border-white/50 backdrop-blur-sm flex flex-col items-center text-center">
                <item.icon className="text-teal-500 mb-2" size={24} />
                <span className="text-xs font-medium text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <form
          onSubmit={handleLogin}
          className="backdrop-blur-xl bg-white dark:bg-slate-800/70 border border-white/50 p-8 md:p-12 rounded-[24px] shadow-2xl w-full"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-300 mb-8">Enter your credentials to access your dashboard.</p>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="accent-teal-600" /> Remember me</label>
              <a href="#" className="text-blue-600 font-semibold hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 mt-4"
            >
              Login 
            </button>
          </div>

          <p className="text-center mt-8 text-slate-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 font-bold hover:underline">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}