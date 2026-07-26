import random


class MaintenanceEnrichment:

    EQUIPMENT_TYPES = {
        "Equipment",
        "Pump",
        "Valve",
        "Sensor",
        "Instrument",
        "Component",
        "System",
    }

    @staticmethod
    def enrich(graph):

        for node in graph.get("nodes", []):

            if node.get("type") not in MaintenanceEnrichment.EQUIPMENT_TYPES:
                continue

            props = node.setdefault("properties", {})
            print(f"[ENRICH] {node['label']} -> adding properties")

            health = props.get("health")

            if health is None:
                health = random.randint(75, 98)

            props["health"] = health

            props["failureProbability"] = 100 - health

            if health >= 90:
                props["risk"] = "Low"
            elif health >= 80:
                props["risk"] = "Medium"
            else:
                props["risk"] = "High"

            props["maintenanceStatus"] = (
                "Healthy"
                if health >= 90
                else "Inspection Required"
            )

            props["temperature"] = [
                random.randint(60, 85),
                random.randint(60, 90),
                random.randint(65, 95)
            ]

            props["vibration"] = round(
                random.uniform(0.5, 3.0),
                2
            )

            props["lastInspection"] = "2026-07-23"

            print(f"[ENRICH] Finished enriching {len(graph.get('nodes', []))} nodes")



        return graph