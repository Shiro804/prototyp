export function distributeRoundRobin<T>(
  items: T[],
  outputSpeeds: number[],
  outputWhitelists: T[][],
): T[][] {
  if (outputSpeeds.length === 0) {
    return [];
  }

  if (outputSpeeds.length !== outputWhitelists.length) {
    throw new Error(
      "The number of output speeds must be equal to the number of whitelists.",
    );
  }

  let result: T[][] = outputSpeeds.map((_) => []);

  let keys = outputSpeeds.length;
  let itemIndex = 0;
  let keyIndex = 0;
  let full = outputSpeeds.map((_) => false);

  while (itemIndex < items.length) {
    if (keyIndex == keys) {
      keyIndex = 0;
    }

    if (result[keyIndex].length < outputSpeeds[keyIndex]) {
      result[keyIndex].push(items[itemIndex]);
      itemIndex++;

      if (result[keyIndex].length == outputSpeeds[keyIndex]) {
        full[keyIndex] = true;
      }

      if (full.every((f) => f === true)) {
        break;
      }
    }

    keyIndex++;
  }

  // let itemsTaken = 0;
  // while (itemsTaken < take) {
  //   for (
  //     let key = 0;
  //     itemsTaken < take && key < distributeTo.length;
  //     key++, itemsTaken++
  //   ) {
  //     itemsDistributed[distributeTo[key]].push(items[itemsTaken]);
  //   }
  // }

  return result;
}
