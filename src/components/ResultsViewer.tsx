"use client";

interface Props {
  jobId: string;
  status: string;
  resultPath?: string | null;
}

// Note: a "Retry" button for failed jobs is not implemented yet. See open
// issue "Add retry button for failed jobs".
export default function ResultsViewer({ jobId, status, resultPath }: Props) {
  if (status !== "complete") {
    return <p>Job {jobId} is {status}. Results will appear once processing finishes.</p>;
  }
  return (
    <div>
      <h2>Translated manuscript ready</h2>
      <p>Stored at: {resultPath ?? "(in-memory)"}</p>
      <p>Open the result via the download link in production builds.</p>
    </div>
  );
}
