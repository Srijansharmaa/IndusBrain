# ==========================================================
# Common Instructions
# ==========================================================

COMMON_RULES = """
You are an Industrial Intelligence AI.

Analyze the supplied industrial document carefully.

Rules:

1. Extract ONLY information explicitly present in the document.
2. Never invent or assume missing information.
3. If a value is unavailable, use null.
4. Return ONLY valid JSON.
5. Do not return markdown.
6. Do not include explanations.
7. Do not wrap the JSON inside ``` blocks.
8. Preserve the wording of equipment names, departments, and regulations exactly as written.
"""


# ==========================================================
# Equipment Extraction
# ==========================================================

EQUIPMENT_PROMPT = f"""
{COMMON_RULES}

Extract every equipment or asset mentioned.

Return JSON in this format:

[
    {{
        "name": "",
        "type": "",
        "location": "",
        "status": "",
        "condition": "",
        "health": 100,
        "risk": ""
    }}
]
"""


# ==========================================================
# Incident Extraction
# ==========================================================

INCIDENT_PROMPT = f"""
{COMMON_RULES}

Extract every incident, failure, accident, abnormal condition, shutdown,
alarm, or operational issue.

Return JSON:

[
    {{
        "title": "",
        "equipment": "",
        "severity": "",
        "cause": "",
        "impact": "",
        "recommendation": ""
    }}
]
"""


# ==========================================================
# Maintenance Recommendations
# ==========================================================

RECOMMENDATION_PROMPT = f"""
{COMMON_RULES}

Extract every maintenance recommendation, inspection recommendation,
repair activity, preventive maintenance task, predictive maintenance task,
or corrective action.

Return JSON:

[
    {{
        "equipment": "",
        "action": "",
        "priority": "",
        "frequency": "",
        "reason": ""
    }}
]
"""


# ==========================================================
# Compliance Extraction
# ==========================================================

COMPLIANCE_PROMPT = f"""
{COMMON_RULES}

Extract every compliance requirement, audit finding, permit,
regulatory requirement, policy, SOP reference, safety violation,
or environmental observation.

Return JSON:

[
    {{
        "regulation": "",
        "status": "",
        "severity": "",
        "remarks": ""
    }}
]
"""


# ==========================================================
# Analytics Extraction
# ==========================================================

ANALYTICS_PROMPT = f"""
{COMMON_RULES}

Extract organizational intelligence.

Identify:

- Departments
- Risks
- Decisions
- Business Domains
- Stakeholders
- KPIs
- Projects

Return JSON:

{{
    "departments": [],
    "risks": [],
    "decisions": [],
    "business_domains": [],
    "stakeholders": [],
    "kpis": [],
    "projects": []
}}
"""