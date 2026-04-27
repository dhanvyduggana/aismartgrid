import { useState } from "react";
import PredictionForm from "../components/PredictionForm";
import DispatchResultCard from "../components/DispatchResultCard";
import AnalyticsCharts from "../components/AnalyticsCharts";
import CurrentPredictionChart from "../components/CurrentPredictionChart";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [charts, setCharts] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        🌞🌬️ AI Smart Renewable Grid Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left */}
        <div>
          <PredictionForm
            setResult={setResult}
            setCharts={setCharts}
          />
         
        </div>

        {/* Right */}
        <div className="space-y-6 mb-2">
           <DispatchResultCard result={result} /> 
          <CurrentPredictionChart result={result}/>
          <AnalyticsCharts charts={charts} />
        </div>
      </div>
    </div>
  );
}