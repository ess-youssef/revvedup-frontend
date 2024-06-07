import { User } from "@/lib/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function getImagePath(imagePath: string) {
  return "http://localhost:8000/" + imagePath.replace("public/", "storage/");
}

export function getFullName(user: User) {
  return user.firstname + " " + user.lastname;
}

export function useDebouncedState<T>(
  defaultValue: T,
  delay: number
): [T, T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);
  const [debounced, setDebounced] = useState<T>(defaultValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(state);
    }, delay);
    return () => clearTimeout(timeout);
  }, [state]);

  return [state, debounced, setState];
}
