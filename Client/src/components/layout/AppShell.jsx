import React,{useState} from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import KnowledgeGraphPanel from "../graph/KnowledgeGraphPanel";
import { PAGES_WITH_SIDE_GRAPH } from "../../constants/navigation";

export default function AppShell({ page, setPage, user, dark, setDark, graph, children, onExpandGraph, searchQuery,
  setSearchQuery, }) {
  const showSideGraph = PAGES_WITH_SIDE_GRAPH.includes(page);

  return (
    <div className="flex min-h-screen bg-surface font-sans">
      <Sidebar page={page} setPage={setPage} user={user} />
      <div className="flex-1 min-w-0">
        <TopBar user={user} dark={dark} setDark={setDark} onSearch={setSearchQuery} />
        <div
          className="p-[22px] grid gap-[18px] items-start"
          style={{ gridTemplateColumns: showSideGraph ? "1fr 300px" : "1fr" }}
        >
          <div className="min-w-0">{children}</div>
          {showSideGraph && (
            <div className="sticky top-[84px]" style={{ height: "calc(100vh - 106px)" }}>
              <KnowledgeGraphPanel
                activePath={graph.activePath}
                activeNode={graph.activeNode}
                setActiveNode={graph.setActiveNode}
                onExpand={onExpandGraph}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
