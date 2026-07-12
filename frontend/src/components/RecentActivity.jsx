import { Clock } from "lucide-react";

export default function RecentActivity({ reports }) {

  const latest = [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center gap-2 mb-5">
        <Clock className="text-blue-600" size={20}/>
        <h3 className="font-bold text-lg">
          Recent Activity
        </h3>
      </div>

      <div className="space-y-4">

        {latest.map((report) => (

          <div
            key={report._id}
            className="border-l-4 border-blue-500 pl-4"
          >
            <p className="font-medium">
              {report.reportType}
            </p>

            <p className="text-sm text-slate-500">
              {new Date(report.createdAt).toLocaleDateString()}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}