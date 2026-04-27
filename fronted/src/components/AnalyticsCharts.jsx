import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function AnalyticsCharts({ charts }) {
  const [historyCharts, setHistoryCharts] = useState(null);

  useEffect(() => {
    fetchHistoryCharts();
  }, []);

  const fetchHistoryCharts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/analytics/history");
      setHistoryCharts(res.data.charts);
    } catch (error) {
      console.error(error);
    }
  };

  if (!charts) return null;

  return (
    <div className="space-y-8">
      {/* Solar Trend */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">☀️ Solar Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={charts.solarTrend}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Wind Trend */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">🌬️ Wind Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={charts.windTrend}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 7-Day Generation */}
      {historyCharts && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">📈 7-Day Generation</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historyCharts.generationTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="generation" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 7-Day Price */}
      {historyCharts && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">💰 Price Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historyCharts.priceTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Allocation Pie */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">🎯 Allocation</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={charts.allocationPie}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {charts.allocationPie.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}