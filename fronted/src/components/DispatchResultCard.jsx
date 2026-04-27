export default function DispatchResultCard({ result }) {
  if (!result) return null;

  const demand = result.city_demand || {};
  const allocation = result.allocation || {};
  const battery = result.battery || {};

  return (
    <div className="space-y-6 mt-8">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          ☀️ Solar: {(result.solar_kw ?? 0).toFixed(2)} KW
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          🌬️ Wind: {(result.wind_kw ?? 0).toFixed(2)} KW
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          ⚡ Total: {(result.total_generation ?? 0).toFixed(2)} KW
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          ⚠️ Deficit: {(result.deficit ?? 0).toFixed(2)} KW
        </div>
      </div>

      {/* Battery */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">🔋 Battery Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>Level: {battery.battery_level ?? 0} KW</div>
          <div>Used: {battery.battery_used ?? 0} KW</div>
          <div>
            Remaining: {battery.remaining_deficit ?? 0} KW
          </div>
          <div>
            Available: {battery.available_after_battery ?? 0} KW
          </div>
        </div>
      </div>

      {/* Demand */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">🏙️ City Demand</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>🏥 Hospital: {demand.hospital ?? 0} KW</div>
          <div>🏠 Household: {demand.household ?? 0} KW</div>
          <div>🏫 School: {demand.school ?? 0} KW</div>
          <div>🏭 Industry: {demand.industry ?? 0} KW</div>
        </div>
      </div>

      {/* Allocation */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          🎯 Priority Allocation
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>🏥 Hospital: {allocation.hospital ?? 0} KW</div>
          <div>🏠 Household: {allocation.household ?? 0} KW</div>
          <div>🏫 School: {allocation.school ?? 0} KW</div>
          <div>🏭 Industry: {allocation.industry ?? 0} KW</div>
        </div>
      </div>

      {/* Price */}
      <div className="bg-white rounded-2xl shadow p-6">
        💰 Current Price: ₹{result.price_per_unit}/unit
      </div>
    </div>
  );
}