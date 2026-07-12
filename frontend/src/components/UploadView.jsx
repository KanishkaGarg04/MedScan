import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, AlertTriangle, ListFilter } from 'lucide-react';

export default function UploadView({ onUploadComplete }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  const processUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    // FIXED: Changed key from 'reports' to 'file' to cleanly align with backend req.file parser
    formData.append('file', file);

    try {
      const token = localStorage.getItem("token");

    const res = await axios.post(
     `${import.meta.env.VITE_API_URL}/api/reports/analyze`,
       formData,
     {
     headers: {
      Authorization: token,
      "Content-Type": "multipart/form-data"
       }
      }
    );

      setResult(res.data.report);
      
      // Update data across global dashboard and history listeners instantly
      onUploadComplete();

      // Reliable scroll layout frame anchor execution
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Verify your server is online and API keys match.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 font-sans antialiased text-slate-700 tracking-tight">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Upload Medical Report</h1>
      <p className="text-slate-500 dark:text-slate-300 mt-1">Get detailed AI analysis with parsed biological parameters, normal ranges, and suggestions</p>

      {/* Upload Zone */}
      <div className="mt-8 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-3xl bg-white dark:bg-slate-800 p-16 text-center shadow-sm">
        {loading ? (
          <div className="py-8">
            <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Reading with AI Processing Engines...</h3>
            <p className="text-xs text-slate-400 mt-1">Running OCR text extraction and building metric profiles.</p>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UploadCloud size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Drop your medical report here</h3>
            <p className="text-sm text-slate-400 mb-6">Supports image files (JPG, PNG)</p>
            
            <input type="file" id="fileInput" className="hidden" accept="image/*" onChange={(e) => processUpload(e.target.files[0])} />
            <button onClick={() => document.getElementById('fileInput').click()} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
              Select File
            </button>
          </div>
        )}
      </div>

      {/* Error Output Prompt Box */}
      {error && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Real-Time Results Section View */}
      {result && (
        <div ref={resultsRef} className="mt-10 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 scroll-mt-6 animate-fadeIn">
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Analysis Engine Verified Log</span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{result.reportType || "General Medical Report"}</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Source File: {result.fileName}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase ${result.status === 'Abnormal' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {result.status || "Normal"}
            </div>
          </div>

          {/* Parameters Table Grid */}
          <div className="mb-8">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <ListFilter size={16} className="text-blue-600" /> Parsed Clinical Markers
            </h3>
            <div className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-500 dark:text-slate-300">
                    <th className="p-4 text-left">Biomarker / Test Field</th>
                    <th className="p-4 text-left">Your Value</th>
                    <th className="p-4 text-left">Normal Benchmark Range</th>
                    <th className="p-4 text-center">Diagnostic Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {result.insights?.parameters && result.insights.parameters.length > 0 ? (
                    result.insights.parameters.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800 dark:text-white">{p.testName}</td>
                        <td className="p-4 font-semibold">{p.value} {p.unit}</td>
                        <td className="p-4 text-slate-400 font-normal">{p.normalRange}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-lg font-black text-[10px] ${p.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-400 italic font-normal">
                        No parsed clinical indicators found in this data object.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Tailored Recommendations Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dietary Strategy Box */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 p-6 rounded-2xl">
              <h4 className="font-extrabold text-xs text-emerald-800 uppercase tracking-wider mb-3">🥗 Dietary Strategy Guidelines</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                {result.insights?.dietarySuggestions && result.insights.dietarySuggestions.length > 0 ? (
                  result.insights.dietarySuggestions.map((item, i) => (
                    <li key={i} className="leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500">•</span> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic font-normal">No custom nutritional suggestions found.</li>
                )}
              </ul>
            </div>

            {/* Lifestyle Optimization Box */}
            <div className="bg-amber-50/50 border border-amber-100/50 p-6 rounded-2xl">
              <h4 className="font-extrabold text-xs text-amber-800 uppercase tracking-wider mb-3">🏃 Lifestyle Adjustment Vectors</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                {result.insights?.lifestyleChanges && result.insights.lifestyleChanges.length > 0 ? (
                  result.insights.lifestyleChanges.map((item, i) => (
                    <li key={i} className="leading-relaxed flex items-start gap-2">
                      <span className="text-amber-500">•</span> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic font-normal">No dynamic routines configured for this layout profile.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}