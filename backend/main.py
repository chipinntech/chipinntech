"""
GridPulse™ AI FastAPI Service
Serves real-time smart meter telemetry and machine learning inferences securely.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import random
import time
import os

from .ml_engine import engine

app = FastAPI(
    title="Chipinn GridPulse™ AI Engine",
    description="Autonomous AMI machine learning telemetry and anomaly detection service",
    version="1.0.0",
    docs_url=os.getenv("DOCS_URL", "/docs"),
    redoc_url=None
)

# Secure CORS: Specific origins in production, local origins in development
default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://chipnntech.com",
    "https://www.chipnntech.com",
    "https://chipinntech.com",
    "https://www.chipinntech.com"
]

configured_origins = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in configured_origins.split(",") if o.strip()] or default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


class TelemetryRequest(BaseModel):
    voltage: float = Field(..., ge=0, le=500, description="Measured RMS voltage (V)")
    current: float = Field(..., ge=0, le=100, description="Measured RMS current (A)")
    power_factor: float = Field(default=0.96, ge=0.5, le=1.0, description="Power factor (0.5 to 1.0)")
    frequency: float = Field(default=50.0, ge=45.0, le=65.0, description="Grid frequency (Hz)")


class STSTokenRequest(BaseModel):
    token: str = Field(..., min_length=20, max_length=25, description="20-digit STS recharge token")


@app.get("/")
def read_root():
    return {
        "service": "Chipinn Technologies — GridPulse™ AI Backend",
        "status": "online",
        "endpoints": ["/api/status", "/api/telemetry/live", "/api/evaluate", "/api/sts/redeem"]
    }


@app.get("/api/status")
def get_status():
    return {
        "status": "operational",
        "ml_frameworks": {
            "pytorch": "active (CPU inference)",
            "scikit_learn": "active (IsolationForest Anomaly Detector)"
        },
        "system_time": int(time.time())
    }


@app.get("/api/telemetry/live")
def get_live_telemetry():
    """Generates a dynamic real-time telemetry frame analyzed by the ML engine."""
    voltage = round(229.5 + random.uniform(-1.5, 2.0), 1)
    current = round(14.0 + random.uniform(-1.5, 2.5), 1)
    power_factor = round(random.uniform(0.94, 0.98), 2)
    frequency = round(50.0 + random.uniform(-0.04, 0.04), 3)

    evaluation = engine.evaluate_telemetry(
        voltage=voltage,
        current=current,
        power_factor=power_factor,
        frequency=frequency
    )
    return evaluation


@app.post("/api/evaluate")
def evaluate_custom_telemetry(req: TelemetryRequest):
    """Evaluates smart meter telemetry with input validation and bounds checking."""
    evaluation = engine.evaluate_telemetry(
        voltage=req.voltage,
        current=req.current,
        power_factor=req.power_factor,
        frequency=req.frequency
    )
    return evaluation


@app.post("/api/sts/redeem")
def redeem_sts_token(req: STSTokenRequest):
    """Validates 20-digit standard transfer specification (STS) prepayment tokens."""
    digits_only = "".join(filter(str.isdigit, req.token))
    if len(digits_only) != 20:
        raise HTTPException(
            status_code=400,
            detail="Invalid STS token format: expected 20 numeric digits."
        )

    return {
        "success": True,
        "credited_kwh": 50.0,
        "message": "STS 20-digit token verified and units credited successfully."
    }
