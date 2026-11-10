import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createDocumentLink, listAllApplications, reviewApplication } from "../../utils/portal-api";

const statusLabel = (status) => status.replaceAll("_", " ");

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [documentLinks, setDocumentLinks] = useState({});

  useEffect(() => {
    let active = true;
    listAllApplications().then((items) => { if (active) setApplications(items); })
      .catch((issue) => { if (active) setError(issue.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleApplications = useMemo(() => applications.filter((application) => {
    const applicant = application.applicant ?? {};
    const searchable = `${applicant.full_name ?? ""} ${applicant.email ?? ""} ${applicant.institution ?? ""}`;
    return searchable.toLowerCase().includes(query.toLowerCase()) && (statusFilter === "All statuses" || application.status === statusFilter);
  }), [applications, query, statusFilter]);
  const countByStatus = (status) => applications.filter((item) => item.status === status).length;
  const pendingCount = countByStatus("pending") + countByStatus("under_review");

  async function changeStatus(id, status) {
    setError("");
    setBusyId(id);
    try {
      const updated = await reviewApplication(id, status);
      setApplications((items) => items.map((item) => item.id === id ? { ...item, ...updated } : item));
    } catch (issue) { setError(issue.message); }
    finally { setBusyId(""); }
  }

  async function loadDocumentLinks(application) {
    setError("");
    try {
      const [cv, studentId, institutionLetter] = await Promise.all([
        createDocumentLink(application.cv_path), createDocumentLink(application.student_id_path), createDocumentLink(application.institution_letter_path),
      ]);
      setDocumentLinks((links) => ({ ...links, [application.id]: { cv, studentId, institutionLetter } }));
    } catch (issue) { setError(issue.message); }
  }

  return (
    <main className="admin-page">
      <div className="admin-heading"><div><p className="admin-eyebrow">NGIC INTERNSHIP PORTAL</p><h1>Application dashboard</h1><p>Review and manage internship applications submitted through the intern portal.</p></div><Link className="admin-home-link" to="/home">View intern portal</Link></div>
      <section className="admin-stats" aria-label="Application totals">
        <article className="admin-stat"><span>Total applications</span><strong>{applications.length}</strong></article>
        <article className="admin-stat"><span>Pending review</span><strong>{pendingCount}</strong></article>
        <article className="admin-stat"><span>Approved</span><strong>{countByStatus("approved")}</strong></article>
        <article className="admin-stat"><span>Rejected</span><strong>{countByStatus("rejected")}</strong></article>
      </section>
      <section className="admin-list">
        <div className="admin-list-heading"><div><h2>Internship applications</h2><p>{loading ? "Loading…" : `${visibleApplications.length} shown`}</p></div><div className="admin-filters">
          <label className="visually-hidden" htmlFor="application-search">Search applicants</label><input id="application-search" type="search" placeholder="Search applicants" value={query} onChange={(event) => setQuery(event.target.value)} />
          <label className="visually-hidden" htmlFor="application-status">Filter by status</label><select id="application-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option value="pending">Pending</option><option value="under_review">Under review</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
        </div></div>
        {error && <p className="form-message" role="alert">{error}</p>}
        {!loading && visibleApplications.length === 0 ? <div className="admin-empty"><h3>{applications.length ? "No matching applications" : "No applications yet"}</h3><p>{applications.length ? "Try a different name or status filter." : "Applications submitted from the intern portal will appear here for review."}</p></div> : !loading && (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Applicant</th><th>Internship period</th><th>Submitted</th><th>Status</th><th>Documents</th><th>Review</th></tr></thead><tbody>
            {visibleApplications.map((application) => {
              const applicant = application.applicant ?? {};
              const links = documentLinks[application.id];
              return <tr key={application.id}>
                <td><strong>{applicant.full_name || "Intern"}</strong><small>{applicant.email || "Applicant profile unavailable"}</small></td>
                <td>{application.internship_period_months} months</td><td>{new Date(application.submitted_at).toLocaleDateString()}</td>
                <td><span className={`admin-status status-${application.status}`}>{statusLabel(application.status)}</span></td>
                <td>{links ? <div className="admin-document-links"><a href={links.cv} target="_blank" rel="noreferrer">CV</a><a href={links.studentId} target="_blank" rel="noreferrer">Student ID</a><a href={links.institutionLetter} target="_blank" rel="noreferrer">Institution letter</a></div> : <button className="admin-secondary" type="button" onClick={() => loadDocumentLinks(application)}>View files</button>}</td>
                <td className="admin-actions"><button type="button" onClick={() => changeStatus(application.id, "approved")} disabled={busyId === application.id || application.status === "approved"}>Approve</button><button type="button" className="admin-reject" onClick={() => changeStatus(application.id, "rejected")} disabled={busyId === application.id || application.status === "rejected"}>Reject</button></td>
              </tr>;
            })}
          </tbody></table></div>
        )}
      </section>
      <p className="admin-storage-note">Application files are stored privately and opened through expiring links.</p>
    </main>
  );
}
