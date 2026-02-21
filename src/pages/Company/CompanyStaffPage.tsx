import { FormEvent, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  CompanyStaffPayload,
  CompanyStaffRecord,
  createCompanyStaff,
  getCompanyStaff,
  updateCompanyStaff,
} from "../../services/api";

const defaultForm: CompanyStaffPayload = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  alternate_phone: "",
  gender: "",
  date_of_birth: "",
  employee_code: "",
  department: "",
  designation: "",
  employment_type: "full-time",
  date_of_joining: "",
  experience_years: 0,
  salary: 0,
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  status: "active",
  notes: "",
  login_password: "",
};

export default function CompanyStaffPage() {
  const [form, setForm] = useState<CompanyStaffPayload>(defaultForm);
  const [staff, setStaff] = useState<CompanyStaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCompanyStaff();
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const update = (key: keyof CompanyStaffPayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const mapRecordToForm = (record: CompanyStaffRecord): CompanyStaffPayload => ({
    first_name: record.first_name || "",
    last_name: record.last_name || "",
    email: record.email || "",
    phone: record.phone || "",
    alternate_phone: record.alternate_phone || "",
    gender: (record.gender || "") as CompanyStaffPayload["gender"],
    date_of_birth: record.date_of_birth || "",
    employee_code: record.employee_code || "",
    department: record.department || "",
    designation: record.designation || "",
    employment_type: record.employment_type || "full-time",
    date_of_joining: record.date_of_joining || "",
    experience_years: Number(record.experience_years || 0),
    salary: Number(record.salary || 0),
    address_line1: record.address_line1 || "",
    address_line2: record.address_line2 || "",
    city: record.city || "",
    state: record.state || "",
    postal_code: record.postal_code || "",
    country: record.country || "",
    emergency_contact_name: record.emergency_contact_name || "",
    emergency_contact_phone: record.emergency_contact_phone || "",
    status: record.status || "active",
    notes: record.notes || "",
    login_password: "",
  });

  const startEdit = (record: CompanyStaffRecord) => {
    setForm(mapRecordToForm(record));
    setEditingStaffId(record.id);
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setForm(defaultForm);
    setEditingStaffId(null);
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingStaffId && !form.login_password) {
      setError("Login password is required for new staff");
      return;
    }
    if (form.login_password && form.login_password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editingStaffId) {
        await updateCompanyStaff(editingStaffId, form);
        setSuccess("Staff updated successfully.");
      } else {
        await createCompanyStaff(form);
        setSuccess("Staff created successfully.");
      }
      setForm(defaultForm);
      setConfirmPassword("");
      setEditingStaffId(null);
      await loadStaff();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save staff");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="AI Company | Staff" description="Company staff management" />
      <div className="space-y-6">
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {editingStaffId ? "Edit Staff" : "Create Staff"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add and manage full staff details for your company.
          </p>
          {error ? <p className="mt-3 text-sm text-error-500">{error}</p> : null}
          {success ? <p className="mt-3 text-sm text-success-500">{success}</p> : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 md:grid-cols-2"
        >
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="First Name *" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Last Name *" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} required />
          <input type="email" className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Email *" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Phone *" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Alternate Phone" value={form.alternate_phone} onChange={(e) => update("alternate_phone", e.target.value)} />
          <select className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Employee Code *" value={form.employee_code} onChange={(e) => update("employee_code", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Department *" value={form.department} onChange={(e) => update("department", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Designation *" value={form.designation} onChange={(e) => update("designation", e.target.value)} required />
          <select className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.employment_type} onChange={(e) => update("employment_type", e.target.value)}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </select>
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.date_of_joining} onChange={(e) => update("date_of_joining", e.target.value)} required />
          <input type="number" min={0} step={0.1} className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Experience (years)" value={form.experience_years} onChange={(e) => update("experience_years", Number(e.target.value))} />
          <input type="number" min={0} step={0.01} className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Salary" value={form.salary} onChange={(e) => update("salary", Number(e.target.value))} />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:col-span-2" placeholder="Address Line 1 *" value={form.address_line1} onChange={(e) => update("address_line1", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:col-span-2" placeholder="Address Line 2" value={form.address_line2} onChange={(e) => update("address_line2", e.target.value)} />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="City *" value={form.city} onChange={(e) => update("city", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="State *" value={form.state} onChange={(e) => update("state", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Postal Code *" value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Country *" value={form.country} onChange={(e) => update("country", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Emergency Contact Name *" value={form.emergency_contact_name} onChange={(e) => update("emergency_contact_name", e.target.value)} required />
          <input className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Emergency Contact Phone *" value={form.emergency_contact_phone} onChange={(e) => update("emergency_contact_phone", e.target.value)} required />
          <select className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700" value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
          <input
            type="password"
            className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder={editingStaffId ? "New Login Password (optional)" : "Login Password *"}
            value={form.login_password}
            onChange={(e) => update("login_password", e.target.value)}
            required={!editingStaffId}
          />
          <input
            type="password"
            className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder={editingStaffId ? "Confirm New Password" : "Confirm Password *"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={!editingStaffId || !!form.login_password}
          />
          <textarea className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:col-span-2" rows={3} placeholder="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 text-white rounded-lg bg-brand-500 w-fit disabled:opacity-60" disabled={submitting}>
              {submitting ? (editingStaffId ? "Updating..." : "Creating...") : editingStaffId ? "Update Staff" : "Create Staff"}
            </button>
            {editingStaffId ? (
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
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Code</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-left">Designation</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-4">
                      Loading staff...
                    </td>
                  </tr>
                ) : staff.length ? (
                  staff.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 dark:border-gray-800">
                      <td className="px-5 py-4">{record.first_name} {record.last_name}</td>
                      <td className="px-5 py-4">{record.employee_code}</td>
                      <td className="px-5 py-4">{record.department}</td>
                      <td className="px-5 py-4">{record.designation}</td>
                      <td className="px-5 py-4 capitalize">{record.status}</td>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => startEdit(record)} className="px-3 py-1 text-sm text-white rounded-md bg-brand-500">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-4">
                      No staff found.
                    </td>
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
