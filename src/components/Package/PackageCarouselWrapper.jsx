"use client";

import React from 'react';
import ResponsiveCarousel from "@/components/Package/ResponsiveCarousel.jsx";

const PackageCarouselWrapper = ({ packages, formatNumeric }) => {
  return (
    <ResponsiveCarousel 
      packages={packages} 
      formatNumericStr={formatNumeric} 
    />
  );
};

export default PackageCarouselWrapper;
