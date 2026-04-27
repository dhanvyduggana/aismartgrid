battery_level = 500
BATTERY_CAPACITY = 1000


def use_battery_then_allocate(total_generation, demand):
    global battery_level

    demand_total = demand["total"]

    available_power = total_generation
    battery_used = 0

    # ✅ Step 1: Use battery when generation is less
    if available_power < demand_total:
        needed = demand_total - available_power
        battery_used = min(needed, battery_level)

        battery_level -= battery_used
        available_power += battery_used

    # ✅ Step 2: Priority allocation
    allocation = {}
    remaining = available_power

    priorities = ["hospital", "household", "school", "industry"]

    for sector in priorities:
        need = demand[sector]
        give = min(need, remaining)
        allocation[sector] = round(give, 2)
        remaining -= give

    remaining_deficit = max(0, demand_total - available_power)

    return {
        "battery_level": round(battery_level, 2),
        "battery_used": round(battery_used, 2),
        "available_after_battery": round(available_power, 2),
        "remaining_deficit": round(remaining_deficit, 2),
        "allocation": allocation
    }