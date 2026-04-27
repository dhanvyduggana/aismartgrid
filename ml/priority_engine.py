def allocate_power(total_power, demand):
    priorities = ["hospital", "household", "school", "industry"]
    allocation = {}
    remaining = total_power

    for sector in priorities:
        need = demand[sector]

        if remaining >= need:
            allocation[sector] = need
            remaining -= need
        else:
            allocation[sector] = remaining
            remaining = 0

    allocation["remaining"] = remaining
    return allocation