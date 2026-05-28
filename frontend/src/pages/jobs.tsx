import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchJobs } from '../lib/api';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchJobs().then((data) => { if (mounted) setJobs(data); }).catch(console.error).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Jobs</h1>
      {loading && <p>Loading…</p>}
      {!loading && jobs.length === 0 && <p>No jobs yet.</p>}
      <ul>
        {jobs.map((j) => (
          <li key={j.id}>
            <strong>{j.title}</strong> — <Link href={`/jobs/${j.id}/apply`}><a>Apply</a></Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
