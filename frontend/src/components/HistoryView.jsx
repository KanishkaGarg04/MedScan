import React, { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  SearchX,
  Bot,
  HelpCircle,
} from "lucide-react";

export default function HistoryView({
  reports = [],
  setSelectedReport,
  setActiveTab,
}) {
  const [search, setSearch] = useState("");

  const [eli5States, setEli5States] = useState({});

  const toggleEli5 = (reportId, termIndex) => {
    const key = `${reportId}-${termIndex}`;

    setEli5States((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getEli5Explanation = (term) => {
    const lowerTerm = term.toLowerCase();

    if (
      lowerTerm.includes("hemoglobin") ||
      lowerTerm.includes("hgb")
    ) {
      return "Imagine your blood cells are tiny delivery trucks. Hemoglobin is the box inside each truck that carries oxygen around your body.";
    }

    if (
      lowerTerm.includes("glucose") ||
      lowerTerm.includes("blood sugar")
    ) {
      return "Think of glucose as the fuel your body uses for energy, just like petrol in a car.";
    }

    if (
      lowerTerm.includes("cholesterol") ||
      lowerTerm.includes("ldl") ||
      lowerTerm.includes("hdl")
    ) {
      return "LDL is like a truck that drops fat into your blood vessels, while HDL is the cleaning truck that removes it.";
    }

    if (
      lowerTerm.includes("creatinine") ||
      lowerTerm.includes("egfr")
    ) {
      return "Creatinine is a waste product. High levels may mean your kidneys are not filtering waste properly.";
    }

    return "This is a medical measurement doctors use to understand how well your body is functioning.";
  };

  const filteredReports = reports.filter(
    (r) =>
      (r.fileName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (r.reportType || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}

      <div className="space-y-1.5 pt-2">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
          Analysis History
        </h2>

        <p className="text-slate-500 dark:text-slate-300">
          Review all previously analyzed reports.
        </p>
      </div>

      {/* Search */}

      <div className="relative">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
        />

      </div>

      {/* Reports */}

      <div className="space-y-6">

        {filteredReports.map((report) => {

          const isAbnormal =
            report.status?.toLowerCase() ===
            "abnormal";

          return (

            <div
              key={report._id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-7 border border-slate-100 dark:border-slate-700 shadow-sm"
            >

              {/* Top */}

              <div className="flex flex-col sm:flex-row justify-between gap-5 border-b pb-6">

                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <FileText size={22} />
                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      {report.reportType ||
                        "Medical Report"}
                    </h3>

                    <div className="flex gap-3 mt-1 text-sm text-slate-500 dark:text-slate-300">

                      <span>
                        {report.fileName}
                      </span>

                      <span>•</span>

                      <div className="flex items-center gap-1">

                        <Calendar size={14} />

                        <span>
                          {new Date(
                            report.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                <div
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${
                    isAbnormal
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {isAbnormal ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <CheckCircle size={16} />
                  )}

                  {report.status || "Normal"}

                </div>

              </div>

              {/* Body */}

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                {/* Terms */}

                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold mb-4">
                    🔬 Medical Terms
                  </h4>

                  {report.insights?.simplifiedTerms?.length >
                  0 ? (

                    <div className="space-y-4">

                      {report.insights.simplifiedTerms.map(
                        (item, i) => {

                          const active =
                            eli5States[
                              `${report._id}-${i}`
                            ];

                          return (

                            <div key={i}>

                              <div className="flex justify-between">

                                <span className="font-bold">
                                  {item.term}
                                </span>

                                <button
                                  onClick={() =>
                                    toggleEli5(
                                      report._id,
                                      i
                                    )
                                  }
                                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg flex items-center gap-1"
                                >
                                  <HelpCircle size={12} />
                                  Explain
                                </button>

                              </div>

                              <p className="mt-2 text-sm text-slate-600">

                                {active
                                  ? getEli5Explanation(
                                      item.term
                                    )
                                  : item.definition}

                              </p>

                            </div>

                          );
                        }
                      )}

                    </div>

                  ) : (
                    <p>No medical terms found.</p>
                  )}

                </div>
                                {/* AI Recommendations */}

                <div className="bg-amber-50 rounded-xl p-5">

                  <h4 className="font-bold mb-4">
                    🥗 AI Recommendations
                  </h4>

                  {report.insights?.dietarySuggestions?.length > 0 ? (

                    <ul className="space-y-2">

                      {report.insights.dietarySuggestions.map(
                        (suggestion, i) => (

                          <li
                            key={i}
                            className="flex gap-2 text-sm text-slate-700"
                          >
                            <span>•</span>

                            <span>{suggestion}</span>

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      No recommendations available.
                    </p>

                  )}

                </div>

              </div>

              {/* Chat Button */}

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">

                <button
                  onClick={() => {
                    setSelectedReport(report);
                    setActiveTab("copilot");
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <Bot size={18} />
                  Chat with Copilot
                </button>

              </div>

            </div>

          );

        })}

        {/* Empty State */}

        {filteredReports.length === 0 && (

          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">

            <div className="flex justify-center mb-4">
              <SearchX
                size={32}
                className="text-slate-400"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No Reports Found
            </h3>

            <p className="text-slate-500 dark:text-slate-300 mt-2">
              {search
                ? "No reports matched your search."
                : "Upload your first report to see history here."}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}