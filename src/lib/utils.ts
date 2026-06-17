import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import zxcvbn from "zxcvbn";

export function delay(ms: number) {
  if (ms < 1) {
    ms = 1;
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type PasswordStrength = {
  label: string;
  color: string;
  estimation: string;
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  try {
    const strength = zxcvbn(password);

    const labels = [
      {
        color: "#f05454",
        label: "sangat lemah",
      },
      {
        color: "#f2691f",
        label: "lemah",
      },
      {
        color: "#f2cc24",
        label: "cukup",
      },
      {
        color: "#82ed58",
        label: "kuat",
      },
      {
        color: "#389c11",
        label: "sangat kuat",
      },
    ];

    const result = labels[strength.score.valueOf()];

    return {
      ...result,
      estimation: formatTimeCrack(
        strength.crack_times_display.offline_fast_hashing_1e10_per_second,
      ),
    };
  } catch {
    throw new Error("level not found");
  }
};

function formatTimeCrack(text: string | number): string {
  if (typeof text == "number") {
    return "instant";
  }

  return text
    .replace("seconds", "detik")
    .replace("second", "detik")
    .replace("minutes", "menit")
    .replace("minute", "menit")
    .replace("hours", "jam")
    .replace("hour", "jam")
    .replace("days", "hari")
    .replace("day", "hari")
    .replace("years", "tahun")
    .replace("year", "tahun")
    .replace("centuries", "abad")
    .replace("century", "abad");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
