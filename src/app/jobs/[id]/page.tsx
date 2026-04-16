import JobProgress from "@/components/JobProgress";
import ResultsViewer from "@/components/ResultsViewer";
import { getJob } from "@/services/jobQueue";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) {
    return <main><h1>Job not found</h1></main>;
  }
  return (
    <main style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1>Job {id}</h1>
      <p>File: {job.filename}</p>
      <JobProgress jobId={id} />
      <ResultsViewer
        jobId={id}
        status={job.status}
        resultPath={job.resultPath}
      />
    </main>
  );
}
