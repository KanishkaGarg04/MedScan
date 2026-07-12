import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardView({ reports = [] }) {
  const totalReportsCount = reports.length || 0;

  const totalInjections = reports.reduce((acc, curr) => {
    const text = (curr.extractedText || '').toLowerCase();
    return acc + (text.match(/injection|inj\b/g) || []).length;
  }, 0);

  const totalSurgeries = reports.reduce((acc, curr) => {
    const text = (curr.extractedText || '').toLowerCase();
    return acc + (text.match(/surgery|surgical|operation/g) || []).length;
  }, 0);

  const latestReport = reports[0] || {};
  const insights = latestReport.insights || {};
  const averageHealthIndex = insights.overallHealth || 68;

  // Premium, Minimalist Color Coding Matrix
  const getSeverityStyle = (statusText = '', score = 70) => {
    const text = statusText.toLowerCase();
    if (text === 'critical' || text === 'action required' || score < 50) {
      return {
        bg: 'bg-rose-50/40',
        border: 'border-rose-100/60',
        text: 'text-rose-600',
        accent: '#f43f5e',
        badge: 'Critical Action Needed'
      };
    }
    if (text === 'abnormal' || text === 'warning' || text === 'mild risk' || (score >= 50 && score < 75)) {
      return {
        bg: 'bg-amber-50/40',
        border: 'border-amber-100/60',
        text: 'text-amber-700',
        accent: '#b45309',
        badge: 'Moderate Risk Profile'
      };
    }
    return {
      bg: 'bg-emerald-50/30',
      border: 'border-emerald-100/50',
      text: 'text-emerald-700',
      accent: '#047857',
      badge: 'Optimal Health Status'
    };
  };

  const severity = getSeverityStyle(latestReport.status || insights.status, averageHealthIndex);

  const chartData = reports.length > 0
    ? reports.map((r, i) => ({
        name: r.insights?.reportType ? r.insights.reportType.split(' ')[0] : `Report ${i + 1}`,
        value: r.insights?.overallHealth ? (r.insights.overallHealth / 10) : 6.8
      })).reverse()
    : [
        { name: 'CBC', value: 6.5 },
        { name: 'Thyroid', value: 7.2 },
        { name: 'Lipid', value: 5.8 },
        { name: 'Renal', value: 6.8 }
      ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 font-sans antialiased text-slate-700 tracking-tight">
      
      {/* ================= SECTION 1: MINIMALIST COUNTER CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Reports */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 tracking-normal">Total Dossiers</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {totalReportsCount < 10 ? `0${totalReportsCount}` : totalReportsCount}
            </h2>
          </div>
          <div className="w-11 h-11 bg-slate-50 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-lg text-slate-500 dark:text-slate-300">📋</div>
        </div>

        {/* Injections */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 tracking-normal">Injections Extracted</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {totalInjections < 10 ? `0${totalInjections}` : totalInjections}
            </h2>
          </div>
          <div className="w-11 h-11 bg-blue-50/50 border border-blue-100/50 rounded-xl flex items-center justify-center text-lg text-blue-500">💉</div>
        </div>

        {/* Surgeries */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 tracking-normal">Surgical Records</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {totalSurgeries < 10 ? `0${totalSurgeries}` : totalSurgeries}
            </h2>
          </div>
          <div className="w-11 h-11 bg-rose-50/50 border border-rose-100/50 rounded-xl flex items-center justify-center text-lg text-rose-500">🤍</div>
        </div>

      </div>

      {/* ================= SECTION 2: CHARTS & RADIAL INDEX ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Trend Area Chart Container */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] lg:col-span-2 space-y-4">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">Prescription Trajectory Engine</h4>
            <p className="text-slate-400 text-xs font-normal">Timeline distribution across calculated aggregate markers</p>
          </div>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="minimalBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.001}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} fontWeight={500} tickLine={false} axisLine={false} dy={6} tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#cbd5e1" fontSize={11} fontWeight={500} tickLine={false} axisLine={false} dx={-4} domain={[0, 10]} tickCount={6} tickFormatter={(v) => `0${v}`} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#minimalBlue)" dot={{ r: 3, fill: '#fff', strokeWidth: 2, stroke: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Minimal Health Score Gauge */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-slate-400 self-start">Condition Baseline</p>
          
          <div className="relative flex items-center justify-center my-3">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="52" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
              <circle 
                cx="64" 
                cy="64" 
                r="52" 
                stroke={severity.accent} 
                strokeWidth="6" 
                fill="transparent" 
                strokeDasharray={326} 
                strokeDashoffset={326 - (326 * averageHealthIndex) / 100} 
                strokeLinecap="round" 
                style={{ transition: 'stroke-dashoffset 0.8s' }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">{averageHealthIndex}%</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-md ${severity.bg} border ${severity.border} ${severity.text}`}>
            {severity.badge}
          </span>
        </div>
      </div>

      {/* ================= SECTION 3: REASONING & HIGHLIGHT BLOCKS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Dynamic Insight Summary Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <span className="text-sm">✨</span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-normal">AI Synthesis Summary</h3>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-slate-300 font-normal leading-relaxed">
            {insights.summary || "Awaiting file upload execution parameters to systematically populate summary indices."}
          </p>
        </div>

        {/* Dynamic Color-Accented Disease Risk Explainer Block */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <span className="text-sm">🔍</span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-normal">Risk Profile Vector</h3>
          </div>
          <div className={`p-4 rounded-xl border ${severity.bg} ${severity.border} space-y-1`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Predicted Tendency:</p>
            <p className={`text-base font-bold tracking-tight ${severity.text}`}>
              {insights.diseaseRiskPrediction || "Awaiting complete diagnostic data stream..."}
            </p>
            <p className="text-[11px] text-slate-400 font-normal pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-2">
              *Calculated via zero-shot cross-parameter synthesis. This is an explainability vector, not a diagnosis.
            </p>
          </div>
        </div>

      </div>

      {/* ================= SECTION 4: LAB INSIGHTS LAYOUT & MED TRACKER ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Minimalist Recommendation Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">Tailored Optimization Directives</h3>
            <p className="text-xs text-slate-400 font-normal">Personalized clinical changes built directly from parsed biomarkers</p>
          </div>
          
          {/* Section A: Dietary Suggestions */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <span>🍏</span> Dietary Measures
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
              {insights.dietarySuggestions && insights.dietarySuggestions.length > 0 ? (
                insights.dietarySuggestions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/40 text-[13px] space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-white block">{item.split(':')[0]}</span>
                    <span className="text-slate-500 dark:text-slate-300 font-normal block leading-normal">{item.split(':')[1] || "Incorporate cleanly into morning routines."}</span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-slate-400 font-normal italic py-2">No direct food records captured.</p>
              )}
            </div>
          </div>

          {/* Section B: What to Avoid */}
          <div className="space-y-2.5 pt-4 border-t border-slate-50">
            <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <span>🚫</span> Clinical Restrictions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
              {insights.whatToAvoid && insights.whatToAvoid.length > 0 ? (
                insights.whatToAvoid.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/40 text-[13px] space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-white block">{item.split(':')[0]}</span>
                    <span className="text-slate-500 dark:text-slate-300 font-normal block leading-normal">{item.split(':')[1] || "Avoid or restrict from standard profiles."}</span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-slate-400 font-normal italic py-2">No specific warnings configured.</p>
              )}
            </div>
          </div>

          {/* Section C: Lifestyle Changes */}
          <div className="space-y-2.5 pt-4 border-t border-slate-50">
            <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <span>🏃‍♂️</span> Routine Upgrades
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
              {insights.lifestyleChanges && insights.lifestyleChanges.length > 0 ? (
                insights.lifestyleChanges.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/40 text-[13px] space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-white block">{item.split(':')[0]}</span>
                    <span className="text-slate-500 dark:text-slate-300 font-normal block leading-normal">{item.split(':')[1] || "Adopt to protect metabolic baselines."}</span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-slate-400 font-normal italic py-2">No environmental alterations found.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Minimal Medication Card Stack */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <span className="text-sm">💊</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white tracking-normal">Active Medication Support</h4>
          </div>

          <div className="space-y-2.5">
            {insights.medications && insights.medications.length > 0 ? (
              insights.medications.map((pill, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-slate-700 bg-slate-50/20 p-3.5 rounded-xl space-y-1 hover:border-slate-200 dark:border-slate-600 transition-all">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 tracking-normal">
                    <span>Compound 0{idx + 1}</span>
                    <span className="text-blue-600 font-bold">{pill.name}</span>
                  </div>
                  <div className="text-base font-bold text-slate-800 dark:text-white tracking-tight">{pill.dose}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300 font-normal leading-tight mt-0.5">{pill.instruction}</div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-normal text-center py-8 italic">No pharmaceutical rows systematically parsed.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}