import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertTriangle size={26} className="text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">Something went wrong</p>
            <p className="mt-1 max-w-sm text-sm text-subtext">
              This page hit an unexpected error. You can try reloading, or head back to the dashboard.
            </p>
          </div>
          <button
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <RotateCcw size={15} /> Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
