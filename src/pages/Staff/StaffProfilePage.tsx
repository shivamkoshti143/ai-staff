import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { getStaffProfile, StaffProfile } from "../../services/api";

const rowClass = "grid grid-cols-1 gap-3 md:grid-cols-3";

export default function StaffProfilePage() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getStaffProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load staff profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <PageMeta title="AI Staff | Profile" description="Staff profile panel" />
      <div className="space-y-6">
        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Staff Profile</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your personal and employment details.
          </p>
          {error ? <p className="mt-2 text-sm text-error-500">{error}</p> : null}
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
          {loading ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <div className="space-y-4">
              <div className={rowClass}>
                <Detail label="Name" value={`${profile.first_name} ${profile.last_name}`} />
                <Detail label="Company" value={profile.company_name} />
                <Detail label="Employee Code" value={profile.employee_code} />
              </div>
              <div className={rowClass}>
                <Detail label="Department" value={profile.department} />
                <Detail label="Designation" value={profile.designation} />
                <Detail label="Employment Type" value={profile.employment_type} />
              </div>
              <div className={rowClass}>
                <Detail label="Email" value={profile.email} />
                <Detail label="Phone" value={profile.phone} />
                <Detail label="Alt. Phone" value={profile.alternate_phone || "-"} />
              </div>
              <div className={rowClass}>
                <Detail label="Date of Joining" value={profile.date_of_joining || "-"} />
                <Detail label="Experience (Years)" value={String(profile.experience_years)} />
                <Detail label="Status" value={profile.status} />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Detail
                  label="Address"
                  value={`${profile.address_line1}${profile.address_line2 ? `, ${profile.address_line2}` : ""}, ${profile.city}, ${profile.state}, ${profile.postal_code}, ${profile.country}`}
                />
              </div>
              <div className={rowClass}>
                <Detail label="Emergency Contact" value={profile.emergency_contact_name} />
                <Detail label="Emergency Phone" value={profile.emergency_contact_phone} />
                <Detail label="Notes" value={profile.notes || "-"} />
              </div>
            </div>
          ) : (
            <p>No staff profile found.</p>
          )}
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}
