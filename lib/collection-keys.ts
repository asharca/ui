/** Value identity plus duplicate occurrence for caller data that has no unique ID. */
export function withOccurrenceKeys<T>(items: readonly T[], identity: (item: T) => string) {
  const occurrences = new Map<string, number>();
  return items.map((item) => {
    const value = identity(item);
    const occurrence = occurrences.get(value) ?? 0;
    occurrences.set(value, occurrence + 1);
    return { item, key: JSON.stringify([value, occurrence]) };
  });
}
