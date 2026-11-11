import { Component, type ReactNode } from "react";

/** Keeps the page usable if WebGL is unavailable or a scene crashes. */
export class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("3D scene failed", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
