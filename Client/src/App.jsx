import React, { useState } from "react";
import LoginScreen from "./components/auth/LoginScreen";
import AppShell from "./components/layout/AppShell";
import DashboardPage from "./pages/DashboardPage";
import CopilotPage from "./pages/CopilotPage";
import GraphExplorerPage from "./pages/GraphExplorerPage";
import DocumentsPage from "./pages/DocumentsPage";
import MaintenancePage from "./pages/MaintenancePage";
import CompliancePage from "./pages/CompliancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminPage from "./pages/AdminPage";
import SettingsPage from "./pages/SettingsPage";
import { useAuth } from "./hooks/useAuth";
import { useKnowledgeGraph } from "./hooks/useKnowledgeGraph";

const PAGE_COMPONENTS = {
  dashboard: DashboardPage,
  copilot: CopilotPage,
  graph: GraphExplorerPage,
  documents: DocumentsPage,
  maintenance: MaintenancePage,
  compliance: CompliancePage,
  analytics: AnalyticsPage,
  admin: AdminPage,
  settings: SettingsPage,
};

export default function App() {
  const { user, login } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const graph = useKnowledgeGraph();

  if (!user) return <LoginScreen onLogin={login} />;

  const PageComponent = PAGE_COMPONENTS[page];

  return (
    <AppShell
      page={page}
      setPage={setPage}
      user={user}
      dark={dark}
      setDark={setDark}
      graph={graph}
      onExpandGraph={() => setPage("graph")}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <PageComponent user={user} graph={graph} searchQuery={searchQuery} />
    </AppShell>
  );
}
