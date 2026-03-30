import React from "react";

/**
 * Renders child elements only if the given conditional evaluates to true.
 */
export function RenderOptional({ enabled, children }) {
    return enabled === true ? <React.Fragment>{children}</React.Fragment> : null;
}
