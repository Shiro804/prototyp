import { describe, test, expect } from "@jest/globals";
import { distributeRoundRobin } from "./round-robin";

describe("distributeRoundRobin", () => {
  test("distributes items correctly 1", () => {
    let items = [1, 4, 6, 7, 8, 9, 10, 23];
    let outputSpeeds = [2, 1, 3];

    expect(distributeRoundRobin(items, outputSpeeds)).toStrictEqual([
      [1, 7],
      [4],
      [6, 8, 9],
    ]);
  });

  test("distributes items correctly 2", () => {
    let items = [1, 4, 6, 7, 8];
    let outputSpeeds = [1, 1, 5];

    expect(distributeRoundRobin(items, outputSpeeds)).toStrictEqual([
      [1],
      [4],
      [6, 7, 8],
    ]);
  });

  // test("distributes items correctly 3", () => {
  //   let items = [1, 7, 2, 8, 2];
  //   let distributeTo = [1, 2, 3, 4];
  //   let take = 2;

  //   expect(distributeRoundRobin(items, distributeTo, take)).toStrictEqual({
  //     1: [1],
  //     2: [7],
  //     3: [],
  //     4: [],
  //   });
  // });
});
