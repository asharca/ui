"use client";

import { useState } from "react";
import { SpotlightComparison } from "@/components/motion/comparison";

const products = [
  {
    "id": "studio",
    "name": "Studio"
  },
  {
    "id": "basic",
    "name": "Basic"
  },
  {
    "id": "enterprise",
    "name": "Enterprise"
  },
  {
    "id": "atlas",
    "name": "Atlas"
  }
];
const features = [
  {
    "id": "feature-0",
    "label": "Quick workspace setup",
    "values": {
      "studio": true,
      "basic": true,
      "enterprise": true,
      "atlas": false,
      "fieldwork": true
    }
  },
  {
    "id": "feature-1",
    "label": "Unlimited projects",
    "values": {
      "studio": true,
      "basic": false,
      "enterprise": false,
      "atlas": true,
      "fieldwork": false
    }
  },
  {
    "id": "feature-2",
    "label": "Guest collaboration",
    "values": {
      "studio": true,
      "basic": true,
      "enterprise": false,
      "atlas": false,
      "fieldwork": true
    }
  },
  {
    "id": "feature-3",
    "label": "Files alongside your work",
    "values": {
      "studio": true,
      "basic": true,
      "enterprise": true,
      "atlas": false,
      "fieldwork": false
    }
  },
  {
    "id": "feature-4",
    "label": "Search across projects",
    "values": {
      "studio": true,
      "basic": false,
      "enterprise": true,
      "atlas": true,
      "fieldwork": false
    }
  },
  {
    "id": "feature-5",
    "label": "Complete version history",
    "values": {
      "studio": true,
      "basic": false,
      "enterprise": false,
      "atlas": true,
      "fieldwork": false
    }
  },
  {
    "id": "governance",
    "label": "Export your data",
    "values": {
      "studio": true,
      "basic": true,
      "enterprise": true,
      "atlas": true,
      "fieldwork": true
    }
  }
];

export function SpotlightComparisonPreview() {
  const [includeGovernance, setIncludeGovernance] = useState(true);
  return <div className="w-full"><SpotlightComparison title="Built for the way your team works." description="All the essentials, together. See how Studio compares with other ways to organize your work." products={products} features={features.filter(feature => includeGovernance || feature.id !== "governance")} featuredId="studio" /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative comparison data and controls</summary><p className="mt-4 leading-6">Fictional products and features, not verified vendor claims. Replace with your own comparison data.</p><label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={includeGovernance} onChange={event => setIncludeGovernance(event.target.checked)} />Include governance features</label></details></div>;
}
