import { Component, type ReactNode } from "react";

/** Keeps the page usable if WebGL is unavailable or a scene crashes. */
export class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    console.error("3D scene failed", error);
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
