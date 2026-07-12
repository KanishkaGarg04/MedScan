import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Legend,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsCharts({ reports }) {
  const normal = reports.filter(
    (r) => r.status?.toLowerCase() === "normal"
  ).length;

  const abnormal = reports.filter(
    (r) => r.status?.toLowerCase() === "abnormal"
  ).length;

  const pieData = [
    { name: "Normal", value: normal },
    { name: "Abnormal", value: abnormal },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  // Monthly Uploads
  const monthly = {};

  reports.forEach((report) => {
    const month = new Date(report.createdAt).toLocaleString("default", {
      month: "short",
    });

    monthly[month] = (monthly[month] || 0) + 1;
  });

  const lineData = Object.keys(monthly).map((month) => ({
    month,
    reports: monthly[month],
  }));

  // Report Categories
  const types = {};

  reports.forEach((report) => {
    const type = report.reportType || "Other";
    types[type] = (types[type] || 0) + 1;
  });

  const barData = Object.keys(types).map((type) => ({
    type,
    count: types[type],
  }));

  if (reports.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500">
        No analytics available yet.
        <br />
        Upload a report to view charts.
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">

      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Analytics Dashboard
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visual insights from your uploaded medical reports
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Donut Chart */}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5">

          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Report Status
          </h3>

          <p className="text-sm text-slate-500 mb-4">
            Healthy vs abnormal reports
          </p>

          <ResponsiveContainer width="100%" height={250}>

            <PieChart>

              <Pie
              data={pieData}
              dataKey="value"
              outerRadius={80}
              innerRadius={45}
              paddingAngle={5}
              isAnimationActive
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
              label={({ percent }) =>
                `${(percent * 100).toFixed(0)}%`
              }
            >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,.08)",
                }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* Monthly Uploads */}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5">

          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Monthly Upload Trend
          </h3>

          <p className="text-sm text-slate-500 mb-4">
            Reports uploaded over time
          </p>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={lineData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,.1)",
                }}
              />

              <Line
              type="monotone"
              dataKey="reports"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive
              animationDuration={1500}
            />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Report Categories */}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5">

        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Report Categories
        </h3>

        <p className="text-sm text-slate-500 mb-4">
          Distribution of uploaded report types
        </p>

        <ResponsiveContainer width="100%" height={280}>

          <BarChart data={barData}>

                  <CartesianGrid
  strokeDasharray="3 3"
  stroke="#e5e7eb"
/>

            <XAxis
  dataKey="type"
  tick={{ fill: "#64748b", fontSize: 12 }}
/>

            <YAxis
  tick={{ fill: "#64748b", fontSize: 12 }}
/>

            <Tooltip
  contentStyle={{
    borderRadius: 12,
    border: "none",
    boxShadow: "0 6px 20px rgba(0,0,0,.1)",
  }}
/>

            <Bar
              dataKey="count"
              fill="#0ea5e9"
              radius={[8, 8, 0, 0]}
              isAnimationActive
              animationDuration={1500}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}