from ai_engine.extractors.equipment_extractor import EquipmentExtractor
from ai_engine.extractors.incident_extractor import IncidentExtractor
from ai_engine.extractors.recommendation_extractor import RecommendationExtractor
from ai_engine.extractors.compliance_extractor import ComplianceExtractor
from ai_engine.extractors.analytics_extractor import AnalyticsExtractor


class IndustrialIntelligenceService:

    def __init__(self):

        self.equipment = EquipmentExtractor()
        self.incidents = IncidentExtractor()
        self.recommendations = RecommendationExtractor()
        self.compliance = ComplianceExtractor()
        self.analytics = AnalyticsExtractor()

    def extract(self, chunks):

        text = "\n\n".join(chunk.text for chunk in chunks)

        return {
            "equipment": self.equipment.extract(text),
            "incidents": self.incidents.extract(text),
            "recommendations": self.recommendations.extract(text),
            "compliance": self.compliance.extract(text),
            "analytics": self.analytics.extract(text)
        }