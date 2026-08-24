"use client";
import { useEffect, useRef } from "react";
import { Container } from "@/components/common/Container";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";

const DEFAULT_WIDGET_SRC = "https://widget.trustmary.com/";

export function RetreatsSection() {
  const widgetRef = useRef(null);
  const companyInfo = useCompanyBasicInfo();
  const widgetSrc = companyInfo?.googleUrl || DEFAULT_WIDGET_SRC;

  useEffect(() => {
    const container = widgetRef.current;
    if (!container || !widgetSrc) return undefined;

    const script = document.createElement("script");
    script.src = widgetSrc;
    script.async = true;
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [widgetSrc]);

  return (
      <Container>
        <div ref={widgetRef} />
      </Container>
  );
}
