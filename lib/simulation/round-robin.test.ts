import { describe, test, expect } from "@jest/globals";
import { distributeRoundRobin } from "./round-robin";

describe("distributeRoundRobin", () => {
  test("distributes items correctly without filter 1", () => {
    let items = [1, 4, 6, 7, 8, 9, 10, 23];
    let outputSpeeds = [2, 1, 3];

    expect(distributeRoundRobin(items, outputSpeeds)).toStrictEqual([
      [1, 7],
      [4],
      [6, 8, 9],
    ]);
  });

  test("distributes items correctly without filter 2", () => {
    let items = [1, 4, 6, 7, 8];
    let outputSpeeds = [1, 1, 5];

    expect(distributeRoundRobin(items, outputSpeeds)).toStrictEqual([
      [1],
      [4],
      [6, 7, 8],
    ]);
  });

  test("handles empty inputs", () => {
    let items: number[] = [];
    let outputSpeeds = [1, 1, 5];

    expect(distributeRoundRobin(items, outputSpeeds)).toStrictEqual([
      [],
      [],
      [],
    ]);
  });

  test("handles empty outputs", () => {
    let items: number[] = [1, 2, 3, 4];
    let outputSpeeds: number[] = [];

    expect(distributeRoundRobin(items, outputSpeeds)).toStrictEqual([]);
  });

  test("distributes items correctly with filter 1", () => {
    let items = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    let outputSpeeds = [3, 1, 2];
    let filter: ((i: number) => boolean)[] = [
      (i) => i % 2 == 0,
      (i) => i % 2 == 1,
      (i) => i % 2 == 0,
    ];

    expect(distributeRoundRobin(items, outputSpeeds, filter)).toStrictEqual([
      [10, 6, 2],
      [9],
      [8, 4],
    ]);
  });

  test("distributes items correctly with filter 2", () => {
    let items = [
      { id: 1, prop: "a" },
      { id: 3, prop: "b" },
      { id: 4, prop: "d" },
      { id: 5, prop: "t" },
      { id: 7, prop: "a" },
    ];
    let outputSpeeds = [3, 4];
    let filter: ((i: (typeof items)[0]) => boolean)[] = [
      (i) => i.prop === "a",
      () => true,
    ];

    expect(distributeRoundRobin(items, outputSpeeds, filter)).toStrictEqual([
      [
        { id: 1, prop: "a" },
        { id: 7, prop: "a" },
      ],
      [
        { id: 3, prop: "b" },
        { id: 4, prop: "d" },
        { id: 5, prop: "t" },
      ],
    ]);
  });

  test("distributes items correctly when no filter matches", () => {
    let items = [
      { id: 1, prop: "a" },
      { id: 3, prop: "b" },
      { id: 4, prop: "d" },
      { id: 5, prop: "t" },
      { id: 7, prop: "a" },
    ];
    let outputSpeeds = [3, 4];
    let filter: ((i: (typeof items)[0]) => boolean)[] = [
      (i) => i.prop === "z",
      () => false,
    ];

    expect(distributeRoundRobin(items, outputSpeeds, filter)).toStrictEqual([
      [],
      [],
    ]);
  });

  test("throws if outputSpeeds and outputFilterPredicates do not have matching lengths", () => {
    let items = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    let outputSpeeds = [3, 1, 2];
    let filter: ((i: number) => boolean)[] = [
      (i) => i % 2 == 0,
      (i) => i % 2 == 1,
      (i) => i % 2 == 0,
      (i) => i % 2 == 1,
    ];

    expect(() =>
      distributeRoundRobin(items, outputSpeeds, filter),
    ).toThrowError();
  });
});
