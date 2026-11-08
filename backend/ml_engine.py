"""
GridPulse™ Machine Learning Engine
Autonomous AMI & Smart Meter Intelligence
Utilizes PyTorch and Scikit-Learn for load forecasting and tamper anomaly detection.
"""

import numpy as np
import torch
import torch.nn as nn
from sklearn.ensemble import IsolationForest


# ---------------------------------------------------------------------------
# 1. PyTorch Neural Network for Next-Hour Load Forecasting
# ---------------------------------------------------------------------------
class EnergyForecastModel(nn.Module):
    def __init__(self, input_dim: int = 4, hidden_dim: int = 32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


# ---------------------------------------------------------------------------
# 2. GridPulse Analytics & Anomaly Detector
# ---------------------------------------------------------------------------
class GridPulseMLEngine:
    def __init__(self):
        # Initialize PyTorch forecaster
        self.device = torch.device("cpu")
        self.forecaster = EnergyForecastModel(input_dim=4, hidden_dim=32).to(self.device)
        self.forecaster.eval()

        # Initialize Scikit-Learn Anomaly Detector for tamper / bypass detection
        self.anomaly_detector = IsolationForest(
            n_estimators=50,
            contamination=0.05,
            random_state=42
        )
        self._pretrain_models()

    def _pretrain_models(self):
        """Train lightweight baseline models with realistic grid telemetry distributions."""
        np.random.seed(42)
        n_samples = 800

        # Features: [voltage, current, power_factor, frequency]
        norm_v = np.random.normal(loc=230.0, scale=3.5, size=(n_samples, 1))
        norm_i = np.random.normal(loc=12.0, scale=4.0, size=(n_samples, 1))
        norm_pf = np.random.uniform(low=0.92, high=0.99, size=(n_samples, 1))
        norm_freq = np.random.normal(loc=50.0, scale=0.08, size=(n_samples, 1))

        X_train = np.hstack([norm_v, norm_i, norm_pf, norm_freq])
        self.anomaly_detector.fit(X_train)

        # Baseline PyTorch regression weights
        X_tensor = torch.tensor(X_train, dtype=torch.float32)
        # Target: expected next hour kWh based on active power + noise
        y_train = (norm_v * norm_i * norm_pf / 1000.0) * 1.05 + np.random.normal(0, 0.05, size=(n_samples, 1))
        y_tensor = torch.tensor(y_train, dtype=torch.float32)

        optimizer = torch.optim.Adam(self.forecaster.parameters(), lr=0.01)
        criterion = nn.MSELoss()

        self.forecaster.train()
        for _ in range(40):
            optimizer.zero_grad()
            pred = self.forecaster(X_tensor)
            loss = criterion(pred, y_tensor)
            loss.backward()
            optimizer.step()
        self.forecaster.eval()

    def predict_next_hour_load(self, voltage: float, current: float, power_factor: float, frequency: float) -> float:
        """Forecast energy consumption (kWh) for the next hour."""
        with torch.no_grad():
            features = torch.tensor([[voltage, current, power_factor, frequency]], dtype=torch.float32).to(self.device)
            predicted_kwh = self.forecaster(features).item()
            return max(0.0, round(predicted_kwh, 3))

    def evaluate_telemetry(self, voltage: float, current: float, power_factor: float = 0.96, frequency: float = 50.0) -> dict:
        """Analyze live telemetry for anomalies, tampering, and grid health."""
        features = np.array([[voltage, current, power_factor, frequency]])
        # Anomaly detector: 1 = normal, -1 = anomalous
        raw_score = self.anomaly_detector.decision_function(features)[0]
        prediction = self.anomaly_detector.predict(features)[0]

        is_tampered = bool(prediction == -1 or voltage < 180 or voltage > 265 or current > 55)
        # Normalize score into a 0-100% anomaly risk index
        risk_score = float(np.clip((0.15 - raw_score) * 200, 0, 100))

        active_power_kw = round((voltage * current * power_factor) / 1000.0, 2)
        forecast_next_kwh = self.predict_next_hour_load(voltage, current, power_factor, frequency)

        status = "CRITICAL_ANOMALY" if risk_score > 70 else ("ELEVATED_RISK" if risk_score > 40 else "OPTIMAL")

        return {
            "voltage_v": voltage,
            "current_a": current,
            "power_kw": active_power_kw,
            "frequency_hz": frequency,
            "power_factor": power_factor,
            "anomaly_risk_score": round(risk_score, 1),
            "status": status,
            "is_tampered": is_tampered,
            "forecast_next_hour_kwh": forecast_next_kwh
        }


# Singleton instance
engine = GridPulseMLEngine()

