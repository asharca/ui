"use client";

import { useState } from "react";
import {
  DeploymentList,
  type DeploymentItem,
} from "@/components/motion/deployment-list";

const INITIAL_DEPLOYMENTS: DeploymentItem[] = [
  {
    id: "d1",
    title: "Show yearly savings on plan cards",
    branch: "feat/annual-billing",
    sha: "c71e4b9",
    age: "1m",
    authorInitials: "MD",
    authorAccent: "bg-amber-600",
    environment: "Preview",
    duration: "23.0s",
    stage: 3,
    status: "Building",
    url: "https://annual-billing-preview.example.com",
  },
  {
    id: "d2",
    title: "Add annual billing toggle to pricing",
    branch: "main",
    sha: "8f3c2a1",
    age: "22m",
    authorInitials: "TH",
    authorAccent: "bg-sky-600",
    environment: "Production",
    duration: "43s",
    stage: 5,
    status: "Ready",
    current: true,
    url: "https://app.example.com",
  },
  {
    id: "d3",
    title: "Keep chart tooltips inside the viewport",
    branch: "fix/chart-tooltips",
    sha: "5a90d2e",
    age: "1h",
    authorInitials: "IV",
    authorAccent: "bg-rose-600",
    environment: "Preview",
    duration: "38s",
    stage: 5,
    status: "Ready",
    url: "https://chart-tooltips-preview.example.com",
  },
  {
    id: "d4",
    title: "Fix invoice rounding on yearly plans",
    branch: "main",
    sha: "e41b9d0",
    age: "3h",
    authorInitials: "SO",
    authorAccent: "bg-emerald-600",
    environment: "Production",
    duration: "51s",
    stage: 5,
    status: "Ready",
    url: "https://v413.app.example.com",
  },
  {
    id: "d5",
    title: "Draft seat-based pricing table",
    branch: "feat/team-seats",
    sha: "b2f8c6a",
    age: "5h",
    authorInitials: "AD",
    authorAccent: "bg-violet-600",
    environment: "Preview",
    duration: "29s",
    stage: 2,
    status: "Error",
    url: "https://team-seats-preview.example.com",
  },
  {
    id: "d6",
    title: "Cache usage queries per workspace",
    branch: "main",
    sha: "9d13a7f",
    age: "1d",
    authorInitials: "JH",
    authorAccent: "bg-cyan-600",
    environment: "Production",
    duration: "48s",
    stage: 5,
    status: "Ready",
    url: "https://v412.app.example.com",
  },
  {
    id: "d7",
    title: "Bump chart-kit to 2.3.1",
    branch: "chore/deps",
    sha: "47cc0e2",
    age: "2d",
    authorInitials: "MO",
    authorAccent: "bg-indigo-600",
    environment: "Preview",
    duration: "45s",
    stage: 5,
    status: "Ready",
    url: "https://deps-preview.example.com",
  },
];

export function DeploymentsListPreview() {
  const [items, setItems] = useState(INITIAL_DEPLOYMENTS);

  const promote = (id: string) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        current: item.id === id,
        environment: item.id === id ? "Production" : item.environment,
      })),
    );
  };

  const deployNew = () => {
    const id = `d-${Date.now()}`;
    setItems((prev) => [
      {
        id,
        title: "Polish checkout tax breakdown copy",
        branch: "feat/tax-copy",
        sha: Math.random().toString(16).slice(2, 9),
        age: "just now",
        authorInitials: "MD",
        authorAccent: "bg-sky-600",
        environment: "Preview",
        duration: "32s",
        stage: 5,
        status: "Ready",
        url: "https://tax-copy-preview.example.com",
      },
      ...prev,
    ]);
  };

  return (
    <DeploymentList
      deployments={items}
      onDeploy={deployNew}
      onPromote={promote}
      onRollback={promote}
    />
  );
}
