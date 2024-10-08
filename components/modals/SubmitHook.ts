import { useState } from "react";

export function useSubmit<T>(fn: (data: T) => Promise<void>) {
  const [pending, setPending] = useState(false);

  const wrappedSubmit = async (data: T) => {
    setPending(true);
    const res = await fn(data);
    setPending(false);
    return res;
  };

  return {
    pending,
    submit: wrappedSubmit,
  };
}
