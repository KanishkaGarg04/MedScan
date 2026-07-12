import { Brain, CheckCircle, AlertTriangle, Droplets, Apple } from "lucide-react";

export default function AIHealthSummary({ reports }) {
  const normal = reports.filter(
    r => r.status?.toLowerCase() === "normal"
  ).length;

  const abnormal = reports.filter(
    r => r.status?.toLowerCase() === "abnormal"
  ).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center gap-2 mb-5">
        <Brain className="text-blue-600" size={22}/>
        <h3 className="font-bold text-lg">
          AI Health Summary
        </h3>
      </div>

      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-500" size={18}/>
          <span>{normal} reports are within normal range.</span>
        </div>

        <div className="flex items-center gap-3">
          <AlertTriangle className="text-orange-500" size={18}/>
          <span>{abnormal} reports need medical attention.</span>
        </div>

        <div className="flex items-center gap-3">
          <Apple className="text-red-500" size={18}/>
          <span>Maintain a balanced diet.</span>
        </div>

        <div className="flex items-center gap-3">
          <Droplets className="text-cyan-500" size={18}/>
          <span>Drink enough water every day.</span>
        </div>

      </div>

    </div>
  );
}