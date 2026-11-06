"use client";

import { useState } from "react";
import { HeadToHeadComparison } from "@/components/motion/comparison";

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
  }
];
const features = [
  {
    "id": "projects",
    "label": "Projects",
    "values": {
      "studio": "Unlimited",
      "basic": "Up to 10",
      "enterprise": "Unlimited"
    }
  },
  {
    "id": "members",
    "label": "Team members",
    "values": {
      "studio": "Unlimited",
      "basic": "Up to 5",
      "enterprise": "Unlimited"
    }
  },
  {
    "id": "knowledge",
    "label": "Shared knowledge base",
    "values": {
      "studio": true,
      "basic": false,
      "enterprise": true
    }
  },
  {
    "id": "search",
    "label": "Search across your work",
    "values": {
      "studio": true,
      "basic": true,
      "enterprise": true
    }
  },
  {
    "id": "automation",
    "label": "Workflow automation",
    "values": {
      "studio": true,
      "basic": false,
      "enterprise": true
    }
  },
  {
    "id": "governance",
    "label": "Export your data",
    "values": {
      "studio": true,
      "basic": true,
      "enterprise": true
    }
  },
  {
    "id": "support",
    "label": "Support",
    "values": {
      "studio": "Priority",
      "basic": "Community",
      "enterprise": "Dedicated"
    }
  }
];

export function HeadToHeadComparisonPreview() {
  const [includeGovernance, setIncludeGovernance] = useState(true);
  return <div className="w-full"><HeadToHeadComparison title="The details make the difference." description="Compare the essentials, then focus on what matters to your team." products={products} features={features.filter(feature => includeGovernance || feature.id !== "governance")} featuredId="studio" /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Illustrative comparison data and controls</summary><p className="mt-4 leading-6">Fictional products and features, not verified vendor claims. Replace with your own comparison data.</p><label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={includeGovernance} onChange={event => setIncludeGovernance(event.target.checked)} />Include governance features</label></details></div>;
}
