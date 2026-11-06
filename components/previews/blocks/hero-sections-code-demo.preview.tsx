"use client";

import { CodeDemoHero } from "@/components/motion/hero-sections";


export function HeroCodeDemoPreview() {
  return <CodeDemoHero {...{ "eyebrow": "Free fine-tuning in beta", "title": "Inference that adapts to your traffic autonomously", "description": "One request away from production-grade inference. Fieldwork watches where your model struggles, then quietly retrains on your own data — no MLOps team required.", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "promotion": {"label": "Read the inference guide", "href": "https://example.com/docs/inference"}, "samples": [{"id": "summarize", "label": "Summarize", "language": "curl", "request": "curl https://api.example.com/v1/inference \\\n  -H \"Authorization: Bearer $API_KEY\" \\\n  -d '{\"task\":\"summarize\",\"input\":\"Your approved source text\"}'", "response": "{\n  \"status\": \"complete\",\n  \"summary\": \"A concise, source-grounded result.\",\n  \"usage\": { \"input_tokens\": 42, \"output_tokens\": 12 }\n}"}, {"id": "classify", "label": "Classify", "language": "curl", "request": "curl https://api.example.com/v1/inference \\\n  -H \"Authorization: Bearer $API_KEY\" \\\n  -d '{\"task\":\"classify\",\"input\":\"A customer question\"}'", "response": "{\n  \"status\": \"complete\",\n  \"category\": \"product-support\",\n  \"confidence\": 0.96\n}"}] }} />;
}
