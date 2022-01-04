import { diff } from "jest-diff";

export const jestDiffCheck = ({
  expected,
  received,
}: {
  expected: string;
  received: string;
}) => {
  const options = {
    contextLines: 5,
    expand: false,
    aAnnotation: "Snapshot",
    bAnnotation: "Received",
    includeChangeCounts: true,
    emptyFirstOrLastLinePlaceholder: "↵", // U+21B5
  };
  console.log("received.length", received.length);
  const difference = diff(received, expected, options);
  console.log(difference);
};
