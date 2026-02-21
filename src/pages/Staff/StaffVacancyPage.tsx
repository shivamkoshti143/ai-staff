import { FormEvent, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  createStaffVacancy,
  getStaffVacancies,
  updateStaffVacancy,
  VacancyPayload,
  VacancyRecord,
} from "../../services/api";

const defaultForm: VacancyPayload = {
  job_title: "",
  department: "",
  designation: "",
  employment_type: "full-time",
  openings: 1,
  experience_min: 0,
  experience_max: 0,
  salary_min: 0,
  salary_max: 0,
  currency: "INR",
  location_type: "onsite",
  city: "",
  state: "",
  country: "",
  application_deadline: "",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: "",
  match_threshold: 70,
  mcq_question_count: 10,
  mcq_pass_threshold: 70,
  status: "open",
};

type FieldProps = {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

function Field({ label, required, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}

export default function StaffVacancyPage() {
  const [form, setForm] = useState<VacancyPayload>(defaultForm);
  const [vacancies, setVacancies] = useState<VacancyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadVacancies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStaffVacancies();
      setVacancies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load vacancies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacancies();
  }, []);

  const update = (key: keyof VacancyPayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const mapVacancyToForm = (vacancy: VacancyRecord): VacancyPayload => ({
    job_title: vacancy.job_title || "",
    department: vacancy.department || "",
    designation: vacancy.designation || "",
    employment_type: vacancy.employment_type || "full-time",
    openings: Number(vacancy.openings || 1),
    experience_min: Number(vacancy.experience_min || 0),
    experience_max: Number(vacancy.experience_max || 0),
    salary_min: Number(vacancy.salary_min || 0),
    salary_max: Number(vacancy.salary_max || 0),
    currency: vacancy.currency || "INR",
    location_type: vacancy.location_type || "onsite",
    city: vacancy.city || "",
    state: vacancy.state || "",
    country: vacancy.country || "",
    application_deadline: vacancy.application_deadline || "",
    description: vacancy.description || "",
    responsibilities: vacancy.responsibilities || "",
    requirements: vacancy.requirements || "",
    skills: vacancy.skills || "",
    match_threshold: Number(vacancy.match_threshold || 70),
    mcq_question_count: Number(vacancy.mcq_question_count || 10),
    mcq_pass_threshold: Number(vacancy.mcq_pass_threshold || 70),
    status: vacancy.status || "open",
  });

  const startEdit = (vacancy: VacancyRecord) => {
    setForm(mapVacancyToForm(vacancy));
    setEditingId(vacancy.id);
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setForm(defaultForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateStaffVacancy(editingId, form);
        setSuccess("Vacancy updated successfully.");
      } else {
        await createStaffVacancy(form);
        setSuccess("Vacancy created successfully.");
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadVacancies();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save vacancy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="AI Staff | Vacancies" description="Staff vacancy management" />
      <div className="space-y-6">
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {editingId ? "Edit Vacancy" : "Create Vacancy"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage vacancy details for your company.
          </p>
          {error ? <p className="mt-3 text-sm text-error-500">{error}</p> : null}
          {success ? <p className="mt-3 text-sm text-success-500">{success}</p> : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 md:grid-cols-2"
        >
          <Field label="Job Title" required>
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.job_title} onChange={(e) => update("job_title", e.target.value)} required />
          </Field>
          <Field label="Department" required>
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.department} onChange={(e) => update("department", e.target.value)} required />
          </Field>
          <Field label="Designation">
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.designation} onChange={(e) => update("designation", e.target.value)} />
          </Field>
          <Field label="Employment Type">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.employment_type} onChange={(e) => update("employment_type", e.target.value)}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </Field>
          <Field label="Openings" required>
            <input type="number" min={1} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.openings} onChange={(e) => update("openings", Number(e.target.value))} required />
          </Field>
          <Field label="Location Type">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.location_type} onChange={(e) => update("location_type", e.target.value)}>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
          </Field>
          <Field label="Min Experience (years)">
            <input type="number" min={0} step={0.1} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.experience_min} onChange={(e) => update("experience_min", Number(e.target.value))} />
          </Field>
          <Field label="Max Experience (years)">
            <input type="number" min={0} step={0.1} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.experience_max} onChange={(e) => update("experience_max", Number(e.target.value))} />
          </Field>
          <Field label="Min Salary">
            <input type="number" min={0} step={0.01} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.salary_min} onChange={(e) => update("salary_min", Number(e.target.value))} />
          </Field>
          <Field label="Max Salary">
            <input type="number" min={0} step={0.01} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.salary_max} onChange={(e) => update("salary_max", Number(e.target.value))} />
          </Field>
          <Field label="Currency">
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.currency} onChange={(e) => update("currency", e.target.value)} />
          </Field>
          <Field label="Application Deadline">
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.application_deadline} onChange={(e) => update("application_deadline", e.target.value)} />
          </Field>
          <Field label="Resume Match Threshold (%)">
            <input type="number" min={0} max={100} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.match_threshold} onChange={(e) => update("match_threshold", Number(e.target.value))} />
          </Field>
          <Field label="MCQ Question Count">
            <input type="number" min={1} max={100} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.mcq_question_count} onChange={(e) => update("mcq_question_count", Number(e.target.value))} />
          </Field>
          <Field label="MCQ Pass Threshold (%)">
            <input type="number" min={0} max={100} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.mcq_pass_threshold} onChange={(e) => update("mcq_pass_threshold", Number(e.target.value))} />
          </Field>
          <Field label="City">
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </Field>
          <Field label="State">
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.state} onChange={(e) => update("state", e.target.value)} />
          </Field>
          <Field label="Country">
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.country} onChange={(e) => update("country", e.target.value)} />
          </Field>
          <Field label="Status">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
              <option value="filled">Filled</option>
            </select>
          </Field>
          <Field label="Job Description" required className="md:col-span-2">
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} required />
          </Field>
          <Field label="Responsibilities" className="md:col-span-2">
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" rows={3} value={form.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} />
          </Field>
          <Field label="Requirements" required className="md:col-span-2">
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" rows={3} value={form.requirements} onChange={(e) => update("requirements", e.target.value)} required />
          </Field>
          <Field label="Skills" className="md:col-span-2">
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" rows={2} value={form.skills} onChange={(e) => update("skills", e.target.value)} />
          </Field>

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 text-white rounded-lg bg-brand-500 w-fit disabled:opacity-60" disabled={submitting}>
              {submitting ? (editingId ? "Updating..." : "Creating...") : editingId ? "Update Vacancy" : "Create Vacancy"}
            </button>
            {editingId ? (
              <button type="button" onClick={cancelEdit} className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100">
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Openings</th>
                  <th className="px-5 py-3 text-left">Match %</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-4">Loading vacancies...</td>
                  </tr>
                ) : vacancies.length ? (
                  vacancies.map((vacancy) => (
                    <tr key={vacancy.id} className="border-b border-gray-200 dark:border-gray-800">
                      <td className="px-5 py-4">{vacancy.job_title}</td>
                      <td className="px-5 py-4">{vacancy.department}</td>
                      <td className="px-5 py-4">{vacancy.employment_type}</td>
                      <td className="px-5 py-4">{vacancy.openings}</td>
                      <td className="px-5 py-4">{Number(vacancy.match_threshold).toFixed(0)}%</td>
                      <td className="px-5 py-4 capitalize">{vacancy.status}</td>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => startEdit(vacancy)} className="px-3 py-1 text-sm text-white rounded-md bg-brand-500">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-4">No vacancies found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
