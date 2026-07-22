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
import { useDarkMode } from "./hooks/useDarkMode";

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
  const [dark, setDark] = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState(null);
  const graph = useKnowledgeGraph();

  if (!user) return <LoginScreen onLogin={login} />;

  const PageComponent = PAGE_COMPONENTS[page];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) setPage("documents");
  };

  const askCopilotWithQuery = (text) => {
    setPendingQuery(text);
    setPage("copilot");
  };

  return (
    <AppShell
      page={page}
      setPage={setPage}
      user={user}
      dark={dark}
      setDark={setDark}
      searchQuery={searchQuery}
      setSearchQuery={handleSearch}
    >
      <PageComponent
        user={user}
        graph={graph}
        searchQuery={searchQuery}
        pendingQuery={pendingQuery}
        onConsumePendingQuery={() => setPendingQuery(null)}
        onAskCopilotQuery={askCopilotWithQuery}
        onSearchDocuments={handleSearch}
      />
    </AppShell>
  );
}
