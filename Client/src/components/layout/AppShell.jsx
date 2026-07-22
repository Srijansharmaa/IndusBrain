import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ErrorBoundary from "../common/ErrorBoundary";

export default function AppShell({ page, setPage, user, dark, setDark, children, searchQuery,
  setSearchQuery, }) {
  return (
    <div className="flex min-h-screen bg-surface font-sans">
      <Sidebar page={page} setPage={setPage} user={user} />
      <div className="flex-1 min-w-0">
        <TopBar user={user} dark={dark} setDark={setDark} onSearch={setSearchQuery} />
        <div className="p-[22px]">
          <div key={page} className="fade-in-up">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
