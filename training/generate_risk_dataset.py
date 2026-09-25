"""
Generate Synthetic Fire Risk Dataset for Sumatra
Based on BMKG climatology and NASA FIRMS patterns
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

print("Generating Fire Risk Dataset for Sumatra...")
print("=" * 60)

# Configuration
N_SAMPLES = 15000  # 15k data points (5 years daily data for multiple locations)
TRAIN_RATIO = 0.8

# Sumatra climate characteristics (based on BMKG data)
# Dry season: Jun-Sep (high risk)
# Wet season: Oct-May (low risk)

def generate_climate_data(n_samples):
    """Generate realistic climate data for Sumatra"""
    
    data = []
    
    for i in range(n_samples):
        # Random month (1-12) for seasonality
        month = np.random.randint(1, 13)
        
        # Dry season (Jun-Sep): higher fire risk
        is_dry_season = month in [6, 7, 8, 9]
        
        # Temperature (°C)
        # Sumatra average: 26-28°C normal, 30-35°C during dry season
        if is_dry_season:
            temp = np.random.normal(32, 2.5)  # Higher during dry season
        else:
            temp = np.random.normal(27, 2.0)  # Normal wet season
        temp = np.clip(temp, 24, 38)
        
        # Humidity (%)
        # Inverse relationship with temperature
        # Sumatra: 70-90% normal, 30-60% during drought
        if is_dry_season:
            humidity = np.random.normal(50, 12)  # Lower during dry season
        else:
            humidity = np.random.normal(78, 8)   # High wet season
        humidity = np.clip(humidity, 25, 95)
        
        # Wind Speed (km/h)
        # Higher winds spread fires faster
        wind_speed = np.random.gamma(2, 5)  # Gamma distribution (skewed)
        wind_speed = np.clip(wind_speed, 0, 45)
        
        # Rainfall (mm in last 7 days)
        # Key predictor: no rain = high risk
        if is_dry_season:
            # Dry season: less rain
            if np.random.random() < 0.6:  # 60% chance of no rain
                rainfall = 0
            else:
                rainfall = np.random.exponential(3)
        else:
            # Wet season: more rain
            rainfall = np.random.exponential(15)
        rainfall = np.clip(rainfall, 0, 100)
        
        # Consecutive Dry Days
        # Very important feature: long dry periods = high risk
        if rainfall < 2:
            consecutive_dry_days = np.random.randint(5, 25)
        else:
            consecutive_dry_days = np.random.randint(0, 5)
        
        # Soil Moisture (%)
        # Inverse of consecutive dry days
        soil_moisture = 100 - (consecutive_dry_days * 2.5 + (35 - temp) * 0.5)
        soil_moisture = np.clip(soil_moisture, 10, 95)
        
        # Land Type (0=mineral, 1=peat/gambut)
        # Peat lands are 3x more prone to fire
        land_type = np.random.choice([0, 1], p=[0.6, 0.4])  # 40% peat
        
        # Calculate Fire Risk Score (target variable)
        # Complex interaction of factors
        risk_score = 0
        
        # Temperature contribution (30%)
        if temp > 33:
            risk_score += 0.30
        elif temp > 30:
            risk_score += 0.20
        elif temp > 28:
            risk_score += 0.10
        
        # Humidity contribution (25%)
        if humidity < 40:
            risk_score += 0.25
        elif humidity < 55:
            risk_score += 0.15
        elif humidity < 70:
            risk_score += 0.05
        
        # Rainfall contribution (20%)
        if rainfall < 1:
            risk_score += 0.20
        elif rainfall < 3:
            risk_score += 0.10
        elif rainfall < 8:
            risk_score += 0.05
        
        # Consecutive dry days (15%)
        if consecutive_dry_days > 15:
            risk_score += 0.15
        elif consecutive_dry_days > 10:
            risk_score += 0.10
        elif consecutive_dry_days > 5:
            risk_score += 0.05
        
        # Wind speed (10%)
        if wind_speed > 25:
            risk_score += 0.10
        elif wind_speed > 18:
            risk_score += 0.07
        elif wind_speed > 12:
            risk_score += 0.03
        
        # Land type multiplier
        if land_type == 1:  # Peat land
            risk_score *= 1.5
        
        # Cap at 1.0
        risk_score = min(risk_score, 1.0)
        
        # Add some noise for realism
        risk_score += np.random.normal(0, 0.05)
        risk_score = np.clip(risk_score, 0, 1)
        
        # Classify risk level
        if risk_score >= 0.75:
            risk_level = "Critical"
            fire_occurred = 1 if np.random.random() < 0.85 else 0  # 85% chance
        elif risk_score >= 0.55:
            risk_level = "High"
            fire_occurred = 1 if np.random.random() < 0.65 else 0  # 65% chance
        elif risk_score >= 0.35:
            risk_level = "Medium"
            fire_occurred = 1 if np.random.random() < 0.35 else 0  # 35% chance
        else:
            risk_level = "Low"
            fire_occurred = 1 if np.random.random() < 0.10 else 0  # 10% chance
        
        data.append({
            'temperature': round(temp, 1),
            'humidity': round(humidity, 1),
            'wind_speed': round(wind_speed, 1),
            'rainfall_7d': round(rainfall, 1),
            'consecutive_dry_days': consecutive_dry_days,
            'soil_moisture': round(soil_moisture, 1),
            'land_type': land_type,
            'month': month,
            'risk_score': round(risk_score, 3),
            'risk_level': risk_level,
            'fire_occurred': fire_occurred
        })
    
    return pd.DataFrame(data)

# Generate dataset
print(f"Generating {N_SAMPLES} samples...")
df = generate_climate_data(N_SAMPLES)

# Statistics
print("\nDataset Statistics:")
print("=" * 60)
print(df.describe())

print("\nFire Occurrence Distribution:")
print(df['fire_occurred'].value_counts())
print(f"Fire Rate: {df['fire_occurred'].mean()*100:.1f}%")

print("\nRisk Level Distribution:")
print(df['risk_level'].value_counts())

print("\nFeature Correlations with Fire Occurrence:")
# Select only numeric columns for correlation
numeric_cols = df.select_dtypes(include=[np.number])
correlations = numeric_cols.corr()['fire_occurred'].sort_values(ascending=False)
print(correlations)

# Save dataset
output_file = 'datasets/fire_risk_sumatra.csv'
df.to_csv(output_file, index=False)
print(f"\nDataset saved to: {output_file}")
print(f"   Total samples: {len(df)}")
print(f"   Features: {len(df.columns)}")
print(f"   File size: {df.memory_usage(deep=True).sum() / 1024:.1f} KB")

print("\n" + "=" * 60)
print("Dataset generation complete!")
print("   Next: Run train_risk_model.py to train ML model")