"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
          <div className="text-2xl">⚠</div>
          <p className="text-sm font-medium text-zinc-700">
            {this.props.label ?? "Something went wrong"} — this section crashed.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
