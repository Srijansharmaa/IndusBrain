from pydantic import BaseModel
from typing import List


class Equipment(BaseModel):
    name: str
    type: str
    health: int
    risk: str
    location: str


class Incident(BaseModel):
    title: str
    severity: str
    equipment: str
    cause: str
    recommendation: str


class Recommendation(BaseModel):
    equipment: str
    action: str
    priority: str


class Compliance(BaseModel):
    regulation: str
    status: str
    remarks: str


class Analytics(BaseModel):
    departments: List[str]
    risks: List[str]
    decisions: List[str]
    business_domains: List[str]