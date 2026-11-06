"use client";

import { IsometricMetricsGallery } from "@/components/motion/content-sections";


export function ContentIsometricMetricsGalleryPreview() {
  return <IsometricMetricsGallery {...{ "eyebrow": "BUILT FOR MOMENTUM", "title": "Less time managing.\nMore time moving.", "description": "", "metrics": [{"id": "time", "value": "3.2 h", "label": "Time returned", "description": "Less time reconstructing context, more time making a useful decision.", "href": "https://example.com/metrics/time"}, {"id": "coverage", "value": "94%", "label": "Evidence coverage", "description": "Keep each recommendation connected to the source that supports it.", "href": "https://example.com/metrics/coverage"}, {"id": "handoffs", "value": "2×", "label": "Clearer handoffs", "description": "Give every workflow an owner, an expected outcome and a readable history.", "href": "https://example.com/metrics/handoffs"}] }} />;
}
