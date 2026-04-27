import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CurrentPredictionChart({ result }) {
  if (!result) return null;

  const data = [
    { name: "Solar", value: result.solar_kw || 0 },
    { name: "Wind", value: result.wind_kw || 0 },
    { name: "Total", value: result.total_generation || result.total_kw || 0 }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">⚡ Current Generation</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}