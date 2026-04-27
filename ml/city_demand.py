import random

def get_city_demand():
    hospital = random.randint(80, 120)
    household = random.randint(150, 220)
    school = random.randint(60, 100)
    industry = random.randint(120, 180)

    total = hospital + household + school + industry

    return {
        "hospital": hospital,
        "household": household,
        "school": school,
        "industry": industry,
        "total": total
    }