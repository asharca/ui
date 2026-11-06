"use client";

import { PlatformOverview } from "@/components/motion/content-sections";


export function ContentPlatformOverviewPreview() {
  return <PlatformOverview {...{ "eyebrow": "THE WHOLE PICTURE", "title": "More than a tool. A place to do your best work.", "description": "Three connected layers. One less thing to work around.", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "capabilities": [{"id": "context", "title": "Shared context", "description": "Keep approved knowledge close to every decision.", "link": {"label": "Explore shared context", "href": "https://example.com/context"}, "metric": {"value": "120+", "label": "sources in one workspace"}, "features": ["Permission-aware retrieval", "Cited answers"]}, {"id": "workflow", "title": "Connected workflows", "description": "Turn a repeatable process into a clear, inspectable run.", "link": {"label": "Explore connected workflows", "href": "https://example.com/workflow"}, "metric": {"value": "3.2 h", "label": "recovered per week"}, "features": ["Human review points", "Readable run traces"]}, {"id": "insight", "title": "Useful insight", "description": "Learn from outcomes without losing the story behind them.", "link": {"label": "Explore useful insight", "href": "https://example.com/insight"}, "metric": {"value": "94%", "label": "review coverage"}, "features": ["Source-level evidence", "Team-level reporting"]}] }} />;
}
