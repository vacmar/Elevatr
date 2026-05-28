"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getJson, postJson } from "@/lib/api";

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

type JobDraft = {
  title: string;
  location: string;
  salary: string;
  description: string;
  skills: string;
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

const emptyDraft: JobDraft = {
  title: "",
  location: "",
  salary: "",
  description: "",
  skills: ""
};

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [draft, setDraft] = useState<JobDraft>(emptyDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [jobsData, applicationsData] = await Promise.all([
          getJson<Job[]>("/jobs"),
          getJson<Application[]>("/applications")
        ]);

        if (!mounted) {
          return;
        }

        setJobs(jobsData);
        setApplications(applicationsData);
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

  const applicationsByStatus = useMemo(() => {
    return applications.reduce(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      { pending: 0, reviewing: 0, accepted: 0, rejected: 0 }
    );
  }, [applications]);

  async function handleCreateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const skills = draft.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const created = await postJson<Job>("/jobs", {
        title: draft.title,
        location: draft.location,
        salary: draft.salary || null,
        description: draft.description,
        skills
      });

      setJobs((previous) => [created, ...previous]);
      setDraft(emptyDraft);
      setSuccessMessage("Job posted successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create job");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold text-slate-950">Recruiter Dashboard</h1>
        <p className="mt-2 text-slate-700">Publish job posts, monitor applicant pipeline, and move candidates forward.</p>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}
      {successMessage ? (
        <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Live Job Posts</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{isLoading ? "..." : jobs.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{isLoading ? "..." : applicationsByStatus.pending}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Reviewing</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{isLoading ? "..." : applicationsByStatus.reviewing}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Accepted</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{isLoading ? "..." : applicationsByStatus.accepted}</p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Create Job Posting</h2>
          <form className="mt-4 space-y-3" onSubmit={handleCreateJob}>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring"
              placeholder="Job title"
              value={draft.title}
              onChange={(event) => setDraft((previous) => ({ ...previous, title: event.target.value }))}
              required
              minLength={3}
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring"
              placeholder="Location"
              value={draft.location}
              onChange={(event) => setDraft((previous) => ({ ...previous, location: event.target.value }))}
              required
              minLength={2}
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring"
              placeholder="Salary (optional)"
              value={draft.salary}
              onChange={(event) => setDraft((previous) => ({ ...previous, salary: event.target.value }))}
            />
            <textarea
              className="min-h-[110px] w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring"
              placeholder="Describe the role and responsibilities"
              value={draft.description}
              onChange={(event) => setDraft((previous) => ({ ...previous, description: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring"
              placeholder="Skills (comma-separated)"
              value={draft.skills}
              onChange={(event) => setDraft((previous) => ({ ...previous, skills: event.target.value }))}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Recent Applications</h2>
          {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading applicants...</p> : null}
          {!isLoading && applications.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No applicants yet. New applications will appear here.</p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {applications.slice(0, 6).map((application) => (
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
      </section>
    </main>
  );
}
