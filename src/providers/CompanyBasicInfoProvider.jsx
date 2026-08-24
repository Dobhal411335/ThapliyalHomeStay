"use client";

import { createContext, useContext } from "react";

const CompanyBasicInfoContext = createContext(null);

export function CompanyBasicInfoProvider({ value = null, children }) {
  return (
    <CompanyBasicInfoContext.Provider value={value}>
      {children}
    </CompanyBasicInfoContext.Provider>
  );
}

export function useCompanyBasicInfo() {
  return useContext(CompanyBasicInfoContext);
}
