import { useRouter } from 'next/router';
import { useState, FormEvent, ChangeEvent } from 'react';
import { applyToJob } from '../../../lib/api';

export default function Apply() {
  const router = useRouter();
  const { id } = router.query;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return alert('Choose a file');
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('elevatr_token') : undefined;
      const jobId = Array.isArray(id) ? id[0] : id;
      if (!jobId) return alert('Missing job id');
      await applyToJob(jobId, file, token || undefined);
      alert('Applied — check backend for record');
      router.push('/jobs');
    } catch (err) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Apply</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Resume</label>
          <input type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Apply'}</button>
      </form>
    </main>
  );
}
