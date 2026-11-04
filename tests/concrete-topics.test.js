// سلامة بطاقات وحدة الكونكريت
import { describe, it, expect } from 'vitest';
import topics from '../src/modules/concrete/data/topics.json';

describe('بطاقات الكونكريت', () => {
  it('معرّفات وأرقام فريدة وحالات صحيحة', () => {
    expect(new Set(topics.map((t) => t.id)).size).toBe(topics.length);
    expect(topics.map((t) => t.n)).toEqual(topics.map((_, i) => i + 1));
    topics.forEach((t) => {
      expect(['ready', 'review', 'soon']).toContain(t.status);
      expect(t.title.length).toBeGreaterThan(0);
    });
  });
});