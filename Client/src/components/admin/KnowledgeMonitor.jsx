import React, { useEffect, useState } from "react";
import { Share2, FileText, GitBranch, Loader2 } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";
import Badge from "../common/Badge";
import KnowledgeGrowthChart from "../analytics/KnowledgeGrowthChart";
import { getGraphNodes, getGraphEdges } from "../../services/graphService";
import { getDocuments } from "../../services/documentService";
import { getKnowledgeGrowth } from "../../services/analyticsService";

export default function KnowledgeMonitor() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [growth, setGrowth] = useState([]);

  useEffect(() => {
    getGraphNodes().then(setNodes);
    getGraphEdges().then(setEdges);
    getDocuments().then(setDocuments);
    getKnowledgeGrowth().then(setGrowth);
  }, []);

  const statusCounts = documents.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <Share2 size={18} className="text-primary" />
            </div>
            <div>
              <p className="m-0 text-xl font-extrabold text-ink">{nodes.length}</p>
              <p className="m-0 text-xs text-subtext">Knowledge nodes</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple/10">
              <GitBranch size={18} className="text-purple" />
            </div>
            <div>
              <p className="m-0 text-xl font-extrabold text-ink">{edges.length}</p>
              <p className="m-0 text-xs text-subtext">Relationships</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <FileText size={18} className="text-success" />
            </div>
            <div>
              <p className="m-0 text-xl font-extrabold text-ink">{documents.length}</p>
              <p className="m-0 text-xs text-subtext">Documents indexed</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle icon={Loader2} title="AI processing status" />
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">{statusCounts.completed || 0} completed</Badge>
          <Badge tone="warning">{statusCounts.processing || 0} processing</Badge>
          <Badge tone="danger">{statusCounts.failed || 0} failed</Badge>
        </div>
      </Card>

      <KnowledgeGrowthChart data={growth} />
    </div>
  );
}
