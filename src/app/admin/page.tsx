import { listJobs } from "@/services/jobQueue";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const all = await listJobs();
  return (
    <main style={{ maxWidth: 960, margin: "0 auto" }}>
      <h1>Admin: job history</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>ID</th>
            <th style={{ textAlign: "left" }}>File</th>
            <th style={{ textAlign: "left" }}>Status</th>
            <th style={{ textAlign: "left" }}>Progress</th>
            <th style={{ textAlign: "left" }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {all.map((j) => (
            <tr key={j.id}>
              <td>{j.id.slice(0, 8)}</td>
              <td>{j.filename}</td>
              <td>{j.status}</td>
              <td>{j.progress}%</td>
              <td>{j.createdAt.toISOString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
