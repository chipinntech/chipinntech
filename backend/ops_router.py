"""
Chipinn Technologies — Ops Center API Router
Provides REST endpoints for internal operations: finances, employees, inventory, clients, docs, and milestones.
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import time

from . import ops_db as db

router = APIRouter(prefix="/api/ops", tags=["Operations Center"])

# Simple in-memory token store with 24-hour validity
ACTIVE_SESSIONS: Dict[str, float] = {}


def generate_session_token() -> str:
    import secrets
    token = f"chipinn_ops_{secrets.token_hex(16)}"
    ACTIVE_SESSIONS[token] = time.time() + 86400  # 24 hours
    return token


def require_ops_auth(authorization: Optional[str] = Header(None)):
    """Verifies the bearer token for Ops API access."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Ops authentication token missing.")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format.")
    
    token = parts[1]
    expiry = ACTIVE_SESSIONS.get(token)
    if not expiry or time.time() > expiry:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please sign in again.")
    
    return token


# --- Pydantic Schemas ---
class LoginRequest(BaseModel):
    password: str = Field(..., min_length=1, description="Ops center password")


class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)


class FinanceCreateRequest(BaseModel):
    date: Optional[str] = None
    amount_ghc: float = Field(..., gt=0)
    type: str = Field(..., pattern="^(income|expense)$")
    category: str
    account: str = Field(..., pattern="^(momo|bank|petty_cash)$")
    description: str
    reference: Optional[str] = ""
    party: Optional[str] = ""


class EmployeeCreateRequest(BaseModel):
    id: Optional[int] = None
    name: str
    role: str
    phone: str
    momo_number: Optional[str] = ""
    ghana_card: Optional[str] = ""
    zone: Optional[str] = ""
    employment_type: Optional[str] = "Full-time"
    base_salary_ghc: Optional[float] = 0.0
    commission_per_meter_ghc: Optional[float] = 120.0
    meters_installed_count: Optional[int] = 0
    status: Optional[str] = "Active"


class InventoryCreateRequest(BaseModel):
    id: Optional[int] = None
    item_name: str
    category: str
    quantity: int = Field(..., ge=0)
    unit: Optional[str] = "pcs"
    unit_cost_ghc: Optional[float] = 0.0
    min_threshold: Optional[int] = 10
    location: Optional[str] = "Main Lab"


class InventoryAdjustRequest(BaseModel):
    delta: int


class ClientCreateRequest(BaseModel):
    id: Optional[int] = None
    name: str
    phone: str
    alt_phone: Optional[str] = ""
    location: str
    ghana_post_gps: Optional[str] = ""
    property_type: Optional[str] = "Compound House (3 Tenants)"
    meters_ordered: Optional[int] = 1
    meter_serials: Optional[str] = ""
    total_amount_ghc: Optional[float] = 1250.0
    amount_paid_ghc: Optional[float] = 0.0
    status: Optional[str] = "New Inquiry"
    assigned_installer_name: Optional[str] = ""
    notes: Optional[str] = ""


class PublicOrderRequest(BaseModel):
    fullName: str
    phone: str
    city: str = "Accra"
    digitalAddress: Optional[str] = ""
    propertyType: str = "Compound House (3 Tenants)"
    quantity: int = 1
    payment_method: str = "momo" # 'momo', 'deposit_momo', 'cod'
    momo_network: Optional[str] = "MTN MoMo"
    momo_number: Optional[str] = ""
    notes: Optional[str] = ""


class ClientStatusUpdateRequest(BaseModel):
    status: str
    amount_paid_ghc: Optional[float] = None


class DocCreateRequest(BaseModel):
    id: Optional[int] = None
    title: str
    category: str
    author: Optional[str] = "Engineering Team"
    summary: Optional[str] = ""
    content: Optional[str] = ""
    tags: Optional[str] = ""


class MilestoneCreateRequest(BaseModel):
    id: Optional[int] = None
    stage: str
    title: str
    description: Optional[str] = ""
    progress_percent: Optional[int] = 0
    target_date: Optional[str] = ""
    status: Optional[str] = "In Progress"


# --- Public Store Endpoints ---
@router.post("/public/order")
def submit_public_order(req: PublicOrderRequest):
    """Public checkout endpoint that records orders directly into Ops and notifies admin."""
    res = db.handle_public_order(req.model_dump())
    return res


# --- Authentication Endpoints ---
@router.post("/auth/login")
def ops_login(req: LoginRequest):
    if not db.check_password(req.password):
        raise HTTPException(status_code=401, detail="Incorrect Ops password.")
    token = generate_session_token()
    return {
        "success": True,
        "token": token,
        "role": "Operational Admin",
        "expires_in": 86400
    }


@router.get("/auth/verify")
def ops_verify(token: str = Depends(require_ops_auth)):
    return {"valid": True, "status": "authorized"}


@router.post("/auth/change-password")
def ops_change_password(req: PasswordChangeRequest, token: str = Depends(require_ops_auth)):
    success = db.update_password(req.old_password, req.new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update password. Verify your current password.")
    return {"success": True, "message": "Password updated successfully."}


# --- Overview Metrics ---
@router.get("/overview")
def get_ops_overview(token: str = Depends(require_ops_auth)):
    return db.get_overview_metrics()


# --- Finances Endpoints ---
@router.get("/finances")
def get_ops_finances(
    account: Optional[str] = None,
    type: Optional[str] = None,
    token: str = Depends(require_ops_auth)
):
    return db.list_finances(account_filter=account, type_filter=type)


@router.post("/finances")
def add_ops_finance(req: FinanceCreateRequest, token: str = Depends(require_ops_auth)):
    return db.add_finance_record(req.model_dump())


@router.delete("/finances/{record_id}")
def delete_ops_finance(record_id: int, token: str = Depends(require_ops_auth)):
    if not db.delete_finance_record(record_id):
        raise HTTPException(status_code=404, detail="Finance record not found.")
    return {"success": True, "deleted_id": record_id}


# --- Employees Endpoints ---
@router.get("/employees")
def get_ops_employees(token: str = Depends(require_ops_auth)):
    return db.list_employees()


@router.post("/employees")
def save_ops_employee(req: EmployeeCreateRequest, token: str = Depends(require_ops_auth)):
    return db.add_or_update_employee(req.model_dump())


@router.post("/employees/{emp_id}/record-install")
def record_install_for_employee(emp_id: int, count: int = 1, token: str = Depends(require_ops_auth)):
    updated = db.record_employee_install(emp_id, count)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found.")
    return updated


@router.delete("/employees/{emp_id}")
def delete_ops_employee(emp_id: int, token: str = Depends(require_ops_auth)):
    if not db.delete_employee(emp_id):
        raise HTTPException(status_code=404, detail="Employee not found.")
    return {"success": True, "deleted_id": emp_id}


# --- Inventory Endpoints ---
@router.get("/inventory")
def get_ops_inventory(token: str = Depends(require_ops_auth)):
    return db.list_inventory()


@router.post("/inventory")
def save_ops_inventory(req: InventoryCreateRequest, token: str = Depends(require_ops_auth)):
    return db.add_or_update_inventory(req.model_dump())


@router.post("/inventory/{item_id}/adjust")
def adjust_ops_inventory(item_id: int, req: InventoryAdjustRequest, token: str = Depends(require_ops_auth)):
    updated = db.adjust_inventory_quantity(item_id, req.delta)
    if not updated:
        raise HTTPException(status_code=404, detail="Inventory item not found.")
    return updated


@router.delete("/inventory/{item_id}")
def delete_ops_inventory(item_id: int, token: str = Depends(require_ops_auth)):
    if not db.delete_inventory(item_id):
        raise HTTPException(status_code=404, detail="Inventory item not found.")
    return {"success": True, "deleted_id": item_id}


# --- Clients & Installations Endpoints ---
@router.get("/clients")
def get_ops_clients(token: str = Depends(require_ops_auth)):
    return db.list_clients()


@router.post("/clients")
def save_ops_client(req: ClientCreateRequest, token: str = Depends(require_ops_auth)):
    return db.add_or_update_client(req.model_dump())


@router.patch("/clients/{client_id}/status")
def update_client_state(client_id: int, req: ClientStatusUpdateRequest, token: str = Depends(require_ops_auth)):
    updated = db.update_client_status(client_id, req.status, req.amount_paid_ghc)
    if not updated:
        raise HTTPException(status_code=404, detail="Client not found.")
    return updated


@router.delete("/clients/{client_id}")
def delete_ops_client(client_id: int, token: str = Depends(require_ops_auth)):
    if not db.delete_client(client_id):
        raise HTTPException(status_code=404, detail="Client not found.")
    return {"success": True, "deleted_id": client_id}


# --- Docs Endpoints ---
@router.get("/docs")
def get_ops_docs(token: str = Depends(require_ops_auth)):
    return db.list_docs()


@router.post("/docs")
def save_ops_doc(req: DocCreateRequest, token: str = Depends(require_ops_auth)):
    return db.add_or_update_doc(req.model_dump())


@router.delete("/docs/{doc_id}")
def delete_ops_doc(doc_id: int, token: str = Depends(require_ops_auth)):
    if not db.delete_doc(doc_id):
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"success": True, "deleted_id": doc_id}


# --- Milestones Endpoints ---
@router.get("/milestones")
def get_ops_milestones(token: str = Depends(require_ops_auth)):
    return db.list_milestones()


@router.post("/milestones")
def save_ops_milestone(req: MilestoneCreateRequest, token: str = Depends(require_ops_auth)):
    return db.add_or_update_milestone(req.model_dump())


@router.delete("/milestones/{m_id}")
def delete_ops_milestone(m_id: int, token: str = Depends(require_ops_auth)):
    if not db.delete_milestone(m_id):
        raise HTTPException(status_code=404, detail="Milestone not found.")
    return {"success": True, "deleted_id": m_id}


# --- Notifications Endpoints ---
@router.get("/notifications")
def get_ops_notifications(token: str = Depends(require_ops_auth)):
    return db.list_notifications()


@router.post("/notifications/read")
def read_ops_notifications(token: str = Depends(require_ops_auth)):
    db.mark_notifications_read()
    return {"success": True}
