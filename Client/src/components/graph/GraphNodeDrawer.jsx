import React from "react";
import { X, ChevronRight } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import { NODE_TYPE_STYLES } from "../../constants/colors";
import { findRelatedNodeIds, findNodeById } from "../../constants/graphData";

const TONE_BY_TYPE = {
  equipment: "primary",
  incident: "danger",
  document: "warning",
  person: "purple",
  recommendation: "success",
};

export default function GraphNodeDrawer({ node, onClose, onSelectRelated }) {
  if (!node) return null;
  const style = NODE_TYPE_STYLES[node.type];
  const relatedIds = findRelatedNodeIds(node.id);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <Badge tone={TONE_BY_TYPE[node.type]}>{style.label}</Badge>
        <button onClick={onClose} className="bg-transparent border-none cursor-pointer">
          <X size={15} className="text-subtext" />
        </button>
      </div>
      <h3 className="m-0 mb-1 text-base font-extrabold text-ink">{node.label}</h3>
      <p className="m-0 mb-4 text-xs text-subtext">Node ID: {node.id}</p>

      <p className="m-0 mb-1.5 text-[11px] font-bold text-subtext uppercase">AI summary</p>
      <p className="text-[12.5px] leading-relaxed text-ink m-0 mb-4">
        This node has {relatedIds.length} direct relationships in the knowledge graph, spanning equipment lineage,
        incident history and supporting documentation.
      </p>

      <p className="m-0 mb-2 text-[11px] font-bold text-subtext uppercase">Relationships</p>
      {relatedIds.map((relatedId) => {
        const relatedNode = findNodeById(relatedId);
        if (!relatedNode) return null;
        const relatedStyle = NODE_TYPE_STYLES[relatedNode.type];
        return (
          <div
            key={relatedId}
            onClick={() => onSelectRelated(relatedId)}
            className="flex items-center gap-2 py-2 border-b border-hairline cursor-pointer"
          >
            <div className={`w-[7px] h-[7px] rounded-full ${relatedStyle.dot}`} />
            <span className="text-[12.5px] text-ink">{relatedNode.label}</span>
            <ChevronRight size={12} className="text-subtext ml-auto" />
          </div>
        );
      })}
    </Card>
  );
}
