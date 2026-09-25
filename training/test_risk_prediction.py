"""
Test Risk Prediction API
"""

import requests
import json

API_URL = "http://localhost:8000/predict-risk"

# Test scenarios
scenarios = [
    {
        "name": "CRITICAL RISK - Riau Dry Season",
        "data": {
            "temperature": 34.5,
            "humidity": 35,
            "wind_speed": 18,
            "rainfall_7d": 0,
            "consecutive_dry_days": 18,
            "land_type": 1,  # Peat
            "location": "Riau Province"
        }
    },
    {
        "name": "HIGH RISK - Jambi",
        "data": {
            "temperature": 32,
            "humidity": 45,
            "wind_speed": 15,
            "rainfall_7d": 1.5,
            "consecutive_dry_days": 12,
            "land_type": 0,  # Mineral
            "location": "Jambi Province"
        }
    },
    {
        "name": "MEDIUM RISK - South Sumatra",
        "data": {
            "temperature": 29,
            "humidity": 60,
            "wind_speed": 10,
            "rainfall_7d": 5.0,
            "consecutive_dry_days": 5,
            "land_type": 0,
            "location": "South Sumatra"
        }
    },
    {
        "name": "LOW RISK - Aceh Wet Season",
        "data": {
            "temperature": 26,
            "humidity": 80,
            "wind_speed": 8,
            "rainfall_7d": 25,
            "consecutive_dry_days": 0,
            "land_type": 0,
            "location": "Aceh Province"
        }
    }
]

print("Testing Risk Prediction API")
print("=" * 70)

for scenario in scenarios:
    print(f"\n{scenario['name']}")
    print("-" * 70)
    
    response = requests.post(API_URL, json=scenario['data'])
    
    if response.status_code == 200:
        result = response.json()
        
        print(f"Risk Level: {result['risk_level']}")
        print(f"Risk Score: {result['risk_score']}")
        print(f"Confidence: {result['confidence']*100:.1f}%")
        print(f"Alert Level: {result['alert_level']}")
        print(f"\nProbabilities:")
        for level, prob in result['probabilities'].items():
            bar = "█" * int(prob * 50)
            print(f"  {level:8s}: {prob*100:5.1f}% {bar}")
        print(f"\nRecommendation: {result['recommendation']}")
        
        # Verify prediction makes sense
        expected_critical = scenario['data']['temperature'] > 33 and scenario['data']['humidity'] < 40
        if expected_critical and result['risk_level'] != 'Critical':
            print("WARNING: Expected Critical but got", result['risk_level'])
        elif result['risk_level'] == 'Critical' and not expected_critical:
            print("WARNING: Got Critical but conditions not extreme")
        else:
            print("Prediction looks reasonable")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

print("\n" + "=" * 70)
print("API Testing Complete!")