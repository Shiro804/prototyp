export function distributeRoundRobin<T>(
  items: T[],
  outputSpeeds: number[],
  outputFilterPredicates?: ((i: T) => boolean)[]
): T[][] {
  if (outputSpeeds.length === 0) {
    return [];
  }

  if (!outputFilterPredicates) {
    outputFilterPredicates = Array(outputSpeeds.length).fill(() => true);
  } else if (outputSpeeds.length !== outputFilterPredicates.length) {
    throw new Error(
      "The number of output speeds must be equal to the number of whitelists."
    );
  }

  let result: T[][] = outputSpeeds.map(() => []);

  let outputs = outputSpeeds.length;
  let remainingItems = [...items];
  let outputIndex = 0;
  let availableItems = outputSpeeds.map(() => true);

  while (
    result.some((r, i) => r.length < outputSpeeds[i] && availableItems[i])
  ) {
    if (outputIndex == outputs) {
      outputIndex = 0;
    }

    if (
      result[outputIndex].length < outputSpeeds[outputIndex] &&
      availableItems[outputIndex]
    ) {
      const nextAvailableItemIndex = remainingItems.findIndex(
        outputFilterPredicates[outputIndex]
      );

      if (nextAvailableItemIndex > -1) {
        result[outputIndex].push(
          remainingItems.splice(nextAvailableItemIndex, 1)[0]
        );
      } else {
        availableItems[outputIndex] = false;
      }
    }

    outputIndex++;
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
