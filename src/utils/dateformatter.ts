/**
 * Utility function to format a timestamp from Firestore or an ISO string.
 *
 * @param dateInput The timestamp to format, can be a string, a Firestore timestamp object, or null/undefined.
 * @returns A formatted date string or a fallback message if the input is invalid.
 */
export const formatTimestamp = (
  dateInput:
    | string
    | { seconds: number; nanoseconds: number }
    | null
    | undefined,
): string => {
  if (!dateInput) {
    return "N/A Date";
  }

  let date: Date;
  if (
    typeof dateInput === "object" &&
    dateInput !== null &&
    "seconds" in dateInput &&
    typeof dateInput.seconds === "number"
  ) {
    date = new Date(dateInput.seconds * 1000);
  } else if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else {
    return "Invalid Date Format";
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
