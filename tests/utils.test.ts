import { describe, it, expect } from "vitest";
import {
  cn,
  formatPercent,
  formatNumber,
  generateId,
  hashString,
  shuffleArray,
} from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("should handle conditional classes", () => {
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });

    it("should merge Tailwind classes correctly", () => {
      expect(cn("px-4", "px-8")).toBe("px-8");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });
  });

  describe("formatPercent", () => {
    it("should format percentage", () => {
      expect(formatPercent(75)).toBe("75%");
      expect(formatPercent(75.5)).toBe("76%");
      expect(formatPercent(0)).toBe("0%");
      expect(formatPercent(100)).toBe("100%");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with locale", () => {
      expect(formatNumber(1000)).toMatch(/1[,.]?000/);
      expect(formatNumber(1234567)).toMatch(/1[,.]?234[,.]?567/);
    });
  });

  describe("generateId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("should generate string IDs", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe("hashString", () => {
    it("should return consistent hash for same string", () => {
      const hash1 = hashString("test");
      const hash2 = hashString("test");
      expect(hash1).toBe(hash2);
    });

    it("should return different hash for different strings", () => {
      const hash1 = hashString("test1");
      const hash2 = hashString("test2");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("shuffleArray", () => {
    it("should return array of same length", () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.length).toBe(arr.length);
    });

    it("should contain same elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it("should not mutate original array", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });
  });
});
