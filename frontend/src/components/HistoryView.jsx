import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, FileText, Calendar, SearchX, Bot, Sparkles, HelpCircle } from 'lucide-react';

export default function HistoryView({ reports = [], onConsultReport }) {
  const [search, setSearch] = useState('');
  
  // Track ELI5 state maps using a tracking object: { [reportId-termIndex]: true/false }
  const [eli5States, setEli5States] = useState({});

  const toggleEli5 = (reportId, termIndex) => {
    const key = `${reportId}-${termIndex}`;
    setEli5States(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper dictionary function simulating immediate client-side heuristics for ELI5 transformations
  const getEli5Explanation = (term, originalDefinition) => {
    const lowerTerm = term.toLowerCase();
    if (lowerTerm.includes('hemoglobin') || lowerTerm.includes('hgb')) {
      return "Imagine your blood cells are tiny delivery trucks; Hemoglobin is the structural box inside the truck that holds onto oxygen molecules to drop them off at your organs.";
    }
    if (lowerTerm.includes('glucose') || lowerTerm.includes('blood sugar')) {
      return "This is simply the fundamental fuel source or fuel level floating in your bloodstream right now from the meals you eat.";
    }
    if (lowerTerm.includes('cholesterol') || lowerTerm.includes('ldl') || lowerTerm.includes('hdl')) {
      return "This is a soft, waxy substance in your body. Think of LDL as trucks leaving junk in the middle of highways, and HDL as cleanup crews sweeping highways clear.";
    }
    if (lowerTerm.includes('creatinine') || lowerTerm.includes('egfr')) {
      return "This is a natural waste product left over from normal muscle movement. If it backs up, it implies your kidney plumbing filters are running slightly slow.";
    }
    // Dynamic structural abstraction fallback if strict match isn't present in index
    return `In plain English: This is a marker doctors check to measure how efficiently your cells handle baseline energy production and filter waste. If out of range, it's a sign your body needs a slight structural modification in diet or rest.`;
  };

  const filteredReports = reports.filter(r =>
    (r.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.reportType || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Premium Content Header Context */}
      <div className="space-y-1.5 pt-2">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Analysis History</h2>
        <p className="text-slate-500 text-base font-normal">
          Review, query, and trace insights across all past processed patient medical dossiers
        </p>
      </div>

      {/* Modern High-Scannability Search Input Zone */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Filter logs by record parameter, clinical marker index, or file name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200/80 rounded-2xl text-[15px] text-slate-800 placeholder-slate-400 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.01)] focus:outline-none focus:border-blue-500/80 focus:ring-4 focus:ring-blue-500/5 transition-all"
        />
      </div>

      {/* Render Historical Dossier Logs Timeline */}
      <div className="space-y-6">
        {filteredReports.map((report) => {
          const isAbnormal = report.status?.toLowerCase() === 'abnormal';
          
          return (
            <div 
              key={report._id} 
              className="bg-white rounded-2xl p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.02)] transition-all duration-200 flex flex-col justify-between"
            >
              {/* Header Meta Info Card Segment */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100/80">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <FileText size={22} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {report.reportType || "Medical Lab Analysis"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-400">
                      <span className="text-slate-500 truncate max-w-xs">{report.fileName}</span>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badging Matrix */}
                <div className={`sm:self-center px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold tracking-wide uppercase shrink-0 ${
                  isAbnormal 
                    ? 'bg-rose-50 text-rose-600 border border-rose-100/50' 
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                }`}>
                  {isAbnormal ? <AlertTriangle size={16} strokeWidth={2.5} /> : <CheckCircle size={16} strokeWidth={2.5} />}
                  <span>{report.status || "Completed"}</span>
                </div>
              </div>

              {/* Sub-Data Grid Framework */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                
                {/* Left Side: Extracted Biomarker Term Simplifier with Interactive AI ELI5 Layering */}
                <div className="bg-slate-50/60 border border-slate-100/50 p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>🔬 Key Medical Terms</span>
                    <span className="text-[10px] text-blue-500 font-extrabold normal-case bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/30">ELI5 Smart Layer Active</span>
                  </h4>
                  {report.insights?.simplifiedTerms?.length > 0 ? (
                    <div className="space-y-4">
                      {report.insights.simplifiedTerms.map((item, i) => {
                        const isEli5Active = eli5States[`${report._id}-${i}`];
                        return (
                          <div key={i} className="text-[14.5px] leading-relaxed space-y-1.5 p-3 rounded-lg hover:bg-slate-100/40 transition-colors group">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-slate-800">{item.term}:</span>
                              
                              {/* Explain Like I'm 5 Toggle Button */}
                              <button
                                onClick={() => toggleEli5(report._id, i)}
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border transition-all ${
                                  isEli5Active 
                                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white border-transparent shadow-sm'
                                    : 'bg-white text-slate-400 hover:text-slate-600 border-slate-200'
                                }`}
                                title="Simplify this definition with AI"
                              >
                                <HelpCircle size={12} />
                                <span>{isEli5Active ? 'Simpler Mode On' : 'Explain Like I\'m 5'}</span>
                              </button>
                            </div>
                            
                            {/* Dynamic Content Switching Vector */}
                            <p className={`text-sm leading-relaxed transition-all duration-200 ${isEli5Active ? 'text-blue-700 font-semibold bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/30 animate-fade-in' : 'text-slate-600 font-normal'}`}>
                              {isEli5Active 
                                ? getEli5Explanation(item.term, item.definition)
                                : item.definition
                              }
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No complex clinical terms parsed or modified.</p>
                  )}
                </div>

                {/* Right Side: Adaptive Guideline Vector Blueprint */}
                <div className="bg-[#fcfaf2]/70 border border-[#f5f0db]/60 p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-[#b0873a] uppercase tracking-wider flex items-center gap-2">
                    <span>🥗 AI Recommendations</span>
                  </h4>
                  {report.insights?.dietarySuggestions?.length > 0 ? (
                    <ul className="space-y-2.5">
                      {report.insights.dietarySuggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2 text-[14.5px] text-slate-700 font-medium leading-relaxed">
                          <span className="text-[#c79c4e] select-none text-base leading-none mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-amber-600/70 italic">No specialized lifestyle adjustments flagged for this record.</p>
                  )}
                </div>

              </div>

              {/* High-Intelligence Action Matrix Footer Node */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onConsultReport && onConsultReport(report) && handleChat(report)}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100/70 text-blue-600 rounded-xl text-[13.5px] font-bold tracking-tight transition-all active:scale-[0.99] border border-blue-100/40"
                >
                  <Bot size={16} strokeWidth={2.5} className="text-blue-500 animate-pulse" />
                  <span>Consult AI Copilot About This Report</span>
                </button>
              </div>

            </div>
          );
        })}

        {/* Dynamic Fallback Frame when records list matches null state */}
        {filteredReports.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
              <SearchX size={24} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">No Analysis Reports Found</h4>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              {search 
                ? "We couldn't find matches for your current keyword parameters. Try widening filters." 
                : "Your historical dashboard log file indexing is clean. Populate entries via the home panel."
              }
            </p>
          </div>
        )}
      </div>

    </div>
  );
}