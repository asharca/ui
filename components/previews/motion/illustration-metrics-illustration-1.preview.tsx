"use client";

import { TrendMetricsScene } from "@/components/motion/illustration-metrics";

export function TrendMetricsScenePreview() {
  // Original illustrative samples: their normalized contour follows the rendered
  // reference, but these are not asserted to be the reference's source dataset.
  return <TrendMetricsScene title="Revenue" presentationPlaying formatValue={value => `$${value.toLocaleString("en-US")}`} ranges={[
    { id: "month", label: "30D", total: 48250, change: "+18.4%", values: [570, 1170, 770, 2170, 1770, 2970, 2570, 3970, 4770, 4370, 5770, 6770], labels: ["Sep 19", "Sep 22", "Sep 25", "Sep 28", "Oct 1", "Oct 4", "Oct 7", "Oct 10", "Oct 12", "Oct 14", "Oct 16", "Oct 18"] },
    { id: "quarter", label: "90D", total: 136900, change: "+32.1%", axisLabels: ["Jul", "Aug", "Sep", "Oct"], values: [9200, 11000, 10200, 12400, 14000, 13000, 15600, 17200, 16400, 19000, 20800, 23400], labels: ["Jul 20", "Jul 28", "Aug 5", "Aug 13", "Aug 21", "Aug 29", "Sep 6", "Sep 14", "Sep 22", "Sep 30", "Oct 8", "Oct 18"] },
    { id: "week", label: "7D", total: 12840, change: "+6.2%", axisLabels: ["Mon", "Thu", "Sun"], values: [1240, 1420, 1300, 1360, 1600, 1480, 1540, 1720, 1600, 1780, 1720, 1900], labels: ["Mon", "Mon", "Tue", "Tue", "Wed", "Wed", "Thu", "Thu", "Fri", "Fri", "Sat", "Sun"] },
  ]} />;
}
