"use client";

import { useEffect, useMemo, useState } from "react";
import { getJson } from "@/lib/api";

type Job = {
  id: number;
  recruiter_id: number;
  title: string;
  location: string;
  salary: string | null;
  description: string;
  skills: string[];
};

type Application = {
  id: number;
  student_id: number;
  job_id: number;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  resume_url: string | null;
};

type Bookmark = {
  id: number;
  student_id: number;
  job_id: number;
};

function statusClass(status: Application["status"]) {
  if (status === "accepted") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (status === "rejected") {
    return "bg-rose-100 text-rose-800";
  }
  if (status === "reviewing") {
    return "bg-amber-100 text-amber-800";
  }
  return "bg-slate-100 text-slate-700";
}

export default function StudentDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [jobsData, applicationsData, bookmarksData] = await Promise.all([
          getJson<Job[]>("/jobs"),
          getJson<Application[]>("/applications"),
          getJson<Bookmark[]>("/bookmarks")
        ]);

        if (!mounted) {
          return;
        }

        setJobs(jobsData);
        setApplications(applicationsData);
        setBookmarks(bookmarksData);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const recentApplications = useMemo(() => applications.slice(0, 5), [applications]);
  const bookmarkedJobs = useMemo(
    () => jobs.filter((job) => bookmarks.some((bookmark) => bookmark.job_id === job.id)).slice(0, 5),
    [jobs, bookmarks]
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold text-slate-950">Student Dashboard</h1>
        <p className="mt-2 text-slate-700">Track your applications, discover open roles, and manage bookmarks.</p>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Open Jobs</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{isLoading ? "..." : jobs.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Your Applications</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{isLoading ? "..." : applications.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Bookmarked Roles</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{isLoading ? "..." : bookmarks.length}</p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Recent Applications</h2>
          {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading applications...</p> : null}
          {!isLoading && recentApplications.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No applications yet. Start by applying to your first role.</p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {recentApplications.map((application) => (
              <li key={application.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">Application #{application.id}</p>
                  <p className="text-sm text-slate-600">Job ID: {application.job_id}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass(application.status)}`}>
                  {application.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Bookmarked Jobs</h2>
          {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading bookmarks...</p> : null}
          {!isLoading && bookmarkedJobs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No bookmarks yet. Save roles here to compare and apply later.</p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {bookmarkedJobs.map((job) => (
              <li key={job.id} className="rounded-xl border border-slate-200 px-4 py-3">
                <p className="font-medium text-slate-900">{job.title}</p>
                <p className="mt-1 text-sm text-slate-600">{job.location}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
