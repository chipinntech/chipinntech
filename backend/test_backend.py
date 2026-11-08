"""
Unit test for GridPulse™ AI Engine and FastAPI Endpoints
"""

from fastapi.testclient import TestClient
from backend.main import app
from backend.ml_engine import engine

client = TestClient(app)


def test_ml_engine():
    # Test normal grid conditions
    result = engine.evaluate_telemetry(voltage=230.0, current=15.0, power_factor=0.96, frequency=50.0)
    assert "anomaly_risk_score" in result
    assert "forecast_next_hour_kwh" in result
    assert result["is_tampered"] is False
    print("Normal telemetry evaluation passed:", result)

    # Test extreme anomaly (voltage drop / tamper)
    tamper_result = engine.evaluate_telemetry(voltage=140.0, current=80.0, power_factor=0.5, frequency=48.0)
    assert tamper_result["is_tampered"] is True
    print("Tamper anomaly detection passed:", tamper_result)


def test_api_endpoints():
    # Status
    res = client.get("/api/status")
    assert res.status_code == 200
    assert res.json()["status"] == "operational"

    # Live telemetry
    res = client.get("/api/telemetry/live")
    assert res.status_code == 200
    data = res.json()
    assert "voltage_v" in data
    assert "forecast_next_hour_kwh" in data

    # STS token validation
    res = client.post("/api/sts/redeem", json={"token": "12345678901234567890"})
    assert res.status_code == 200
    assert res.json()["success"] is True

    # Invalid STS token length
    res = client.post("/api/sts/redeem", json={"token": "12345"})
    assert res.status_code == 400

    print("All API endpoints tested successfully!")


if __name__ == "__main__":
    test_ml_engine()
    test_api_endpoints()

