"use client";

import { useEffect } from "react";

export function GoogleTrackingTag({ html }) {
  useEffect(() => {
    const snippet = String(html || "").trim();
    if (!snippet) return undefined;

    const fragment = document.createRange().createContextualFragment(snippet);
    const nodes = Array.from(fragment.childNodes);
    const injected = [];

    nodes.forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const script = document.createElement("script");
        Array.from(node.attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
        script.text = node.textContent || "";
        document.head.appendChild(script);
        injected.push(script);
        return;
      }

      document.head.appendChild(node);
      injected.push(node);
    });

    return () => {
      injected.forEach((node) => {
        node.parentNode?.removeChild(node);
      });
    };
  }, [html]);

  return null;
}
