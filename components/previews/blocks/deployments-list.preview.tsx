"use client";

import { useState } from "react";
import {
  DeploymentList,
  type DeploymentItem,
} from "@/components/motion/deployment-list";

const INITIAL_DEPLOYMENTS: DeploymentItem[] = [
  {
    id: "d1",
    title: "Add annual billing toggle to pricing",
    branch: "main",
    sha: "8f3c2a1",
    age: "22m",
    environment: "Production",
    duration: "43s",
    stage: 5,
    status: "Ready",
    current: true,
    url: "https://app.example.com",
  },
  {
    id: "d2",
    title: "Show yearly savings on plan cards",
    branch: "feat/annual-billing",
    sha: "c71e4b9",
    age: "1m",
    environment: "Preview",
    duration: "17.0s",
    stage: 3,
    status: "Building",
    url: "https://annual-billing-preview.example.com",
  },
  {
    id: "d3",
    title: "Tighten webhook retry backoff timing",
    branch: "fix/webhook-retry",
    sha: "9d2a104",
    age: "3h",
    environment: "Preview",
    duration: "38s",
    stage: 5,
    status: "Ready",
    url: "https://webhook-retry-preview.example.com",
  },
  {
    id: "d4",
    title: "Upgrade typography scale on docs pages",
    branch: "main",
    sha: "4a18bc3",
    age: "1d",
    environment: "Production",
    duration: "41s",
    stage: 5,
    status: "Ready",
    url: "https://v412.app.example.com",
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
