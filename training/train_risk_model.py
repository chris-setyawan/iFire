"""
Train Random Forest Model for Fire Risk Prediction
Target: 92%+ accuracy
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, 
    classification_report, 
    confusion_matrix,
    roc_auc_score
)
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

print("Training Random Forest Model for Fire Risk Prediction")
print("=" * 70)

# Create models directory
os.makedirs('models', exist_ok=True)

# Load dataset
print("\nLoading dataset...")
df = pd.read_csv('datasets/fire_risk_sumatra.csv')
print(f"   Loaded {len(df)} samples")
print(f"   Features: {len(df.columns)}")

# Feature selection
feature_cols = [
    'temperature',
    'humidity', 
    'wind_speed',
    'rainfall_7d',
    'consecutive_dry_days',
    'soil_moisture',
    'land_type',
    'month'
]

X = df[feature_cols]
y = df['risk_level']  # Multi-class: Low, Medium, High, Critical

print(f"\nTarget Distribution:")
print(y.value_counts())

# Split dataset
print("\nSplitting dataset...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y  # Maintain class distribution
)

print(f"   Training set: {len(X_train)} samples")
print(f"   Test set: {len(X_test)} samples")

# Train Random Forest
print("\nTraining Random Forest Classifier...")
print("   Configuration:")
print("   - n_estimators: 200 trees")
print("   - max_depth: 15")
print("   - min_samples_split: 10")
print("   - min_samples_leaf: 4")
print("   - class_weight: balanced")

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=10,
    min_samples_leaf=4,
    max_features='sqrt',
    class_weight='balanced',
    random_state=42,
    n_jobs=-1,  # Use all CPU cores
    verbose=1
)

# Train
print("\nTraining in progress...")
model.fit(X_train, y_train)
print("   Training complete!")

# Predictions
print("\nMaking predictions on test set...")
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

# Evaluate
print("\n" + "=" * 70)
print("MODEL PERFORMANCE METRICS")
print("=" * 70)

accuracy = accuracy_score(y_test, y_pred)
print(f"\nOverall Accuracy: {accuracy*100:.2f}%")

if accuracy >= 0.92:
    print("   TARGET ACHIEVED! (≥92%)")
elif accuracy >= 0.88:
    print("   Good but below target (target: 92%)")
else:
    print("   Below expectations (target: 92%)")

# Detailed classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred, digits=3))

# Confusion Matrix
print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred, labels=['Low', 'Medium', 'High', 'Critical'])
print(cm)

# Per-class accuracy
print("\nPer-Class Accuracy:")
for i, label in enumerate(['Low', 'Medium', 'High', 'Critical']):
    class_accuracy = cm[i, i] / cm[i].sum()
    print(f"   {label:8s}: {class_accuracy*100:.1f}%")

# Feature Importance
print("\nFeature Importance:")
feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance.to_string(index=False))

# Cross-validation
print("\nCross-Validation (5-fold):")
cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
print(f"   CV Scores: {cv_scores}")
print(f"   Mean CV Accuracy: {cv_scores.mean()*100:.2f}%")
print(f"   Std Dev: {cv_scores.std()*100:.2f}%")

# Save model
model_filename = 'models/risk_prediction_rf.pkl'
joblib.dump(model, model_filename)
print(f"\nModel saved to: {model_filename}")

# Save feature importance
feature_importance.to_csv('models/feature_importance.csv', index=False)
print(f"   Feature importance saved to: models/feature_importance.csv")

# Save metadata
metadata = {
    'model_type': 'RandomForestClassifier',
    'n_estimators': 200,
    'max_depth': 15,
    'accuracy': accuracy,
    'cv_mean': cv_scores.mean(),
    'cv_std': cv_scores.std(),
    'training_samples': len(X_train),
    'test_samples': len(X_test),
    'features': feature_cols,
    'target_classes': ['Low', 'Medium', 'High', 'Critical'],
    'trained_date': datetime.now().isoformat()
}

import json
with open('models/model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print(f"   Metadata saved to: models/model_metadata.json")

# Visualization: Confusion Matrix
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Oranges', 
            xticklabels=['Low', 'Medium', 'High', 'Critical'],
            yticklabels=['Low', 'Medium', 'High', 'Critical'])
plt.title(f'Confusion Matrix - Accuracy: {accuracy*100:.2f}%', fontsize=14, fontweight='bold')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.tight_layout()
plt.savefig('models/confusion_matrix.png', dpi=150)
print(f"   Confusion matrix plot saved to: models/confusion_matrix.png")

# Visualization: Feature Importance
plt.figure(figsize=(10, 6))
plt.barh(feature_importance['feature'], feature_importance['importance'], color='orangered')
plt.xlabel('Importance Score')
plt.title('Feature Importance for Fire Risk Prediction', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('models/feature_importance.png', dpi=150)
print(f"   Feature importance plot saved to: models/feature_importance.png")

print("\n" + "=" * 70)
print("MODEL TRAINING COMPLETE!")
print("=" * 70)
print(f"\nFinal Accuracy: {accuracy*100:.2f}%")
print(f"Model File: {model_filename}")
print(f"Model Size: {os.path.getsize(model_filename) / 1024:.1f} KB")
print("\nNext steps:")
print("  1. Integrate model into fire_api.py")
print("  2. Test /predict-risk endpoint")
print("  3. Update frontend Risk Prediction page")