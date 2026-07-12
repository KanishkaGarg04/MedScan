import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Bot,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards({ reports }) {
  const totalReports = reports.length;

  const normalReports = reports.filter(
    (r) => r.status?.toLowerCase() === "normal"
  ).length;

  const abnormalReports = reports.filter(
    (r) => r.status?.toLowerCase() === "abnormal"
  ).length;

  // Placeholder for now
  const totalChats = reports.length;

  const stats = [
    {
      title: "Total Reports",
      value: totalReports,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Normal Reports",
      value: normalReports,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Abnormal Reports",
      value: abnormalReports,
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "AI Chats",
      value: totalChats,
      icon: Bot,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  whileHover={{
    y: -5,
    scale: 1.02,
  }}
  className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700"
>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.title}
                </p>

                <h2 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}