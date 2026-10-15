"use client";

import { useState } from "react";
import { DateTimePicker } from "@/components/motion/date-time-picker";

export function DateTimePickerPreview() {
	const [value, setValue] = useState("2026-10-15T09:30");
	return (
		<div className="flex w-full flex-col items-center gap-5 px-2 py-16">
			<DateTimePicker
				value={value}
				onValueChange={setValue}
				name="scheduledAt"
			/>
			<p className="text-xs text-muted-foreground">
				Pick a moment. Make it happen.
			</p>
		</div>
	);
}
