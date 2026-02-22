import { getAuthSession } from "../utils/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

type RequestOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
  requiresAuth?: boolean;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.requiresAuth) {
    const session = getAuthSession();
    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((json as { message?: string }).message || "Request failed");
  }

  return json as T;
}

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
};

export type StaffProfile = {
  id: number;
  company_id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alternate_phone: string | null;
  gender: "male" | "female" | "other" | null;
  date_of_birth: string | null;
  employee_code: string;
  department: string;
  designation: string;
  employment_type: "full-time" | "part-time" | "contract" | "intern";
  date_of_joining: string;
  experience_years: number;
  salary: number;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: "active" | "inactive" | "on-leave";
  notes: string | null;
  created_at: string;
};

export type VacancyRecord = {
  id: number;
  company_id: number;
  created_by_staff_id: number;
  company_name: string;
  created_by_name: string;
  job_title: string;
  department: string;
  designation: string | null;
  employment_type: "full-time" | "part-time" | "contract" | "intern";
  openings: number;
  experience_min: number;
  experience_max: number;
  salary_min: number;
  salary_max: number;
  currency: string;
  location_type: "onsite" | "hybrid" | "remote";
  city: string | null;
  state: string | null;
  country: string | null;
  application_deadline: string | null;
  description: string;
  responsibilities: string | null;
  requirements: string;
  skills: string | null;
  match_threshold: number;
  mcq_question_count: number;
  mcq_pass_threshold: number;
  status: "draft" | "open" | "closed" | "filled";
  created_at: string;
  updated_at: string;
};

export type ApplicationRecord = {
  id: number;
  vacancy_id: number;
  company_id: number;
  candidate_id: number;
  resume_path: string;
  cover_letter: string | null;
  match_percentage: number;
  match_threshold: number;
  screening_result: "passed" | "rejected";
  screening_notes: string | null;
  mcq_required: number;
  mcq_total_questions: number;
  mcq_correct_answers: number;
  mcq_score_percentage: number;
  mcq_pass_threshold: number;
  mcq_status: "not_required" | "pending" | "passed" | "failed";
  practical_round_status: "not_eligible" | "eligible" | "completed";
  practical_status?: "not_started" | "in_progress" | "passed" | "failed" | "timeout" | null;
  practical_score_percentage?: number;
  practical_pass_threshold?: number;
  practical_report_notes?: string | null;
  status: "under_review" | "shortlisted" | "rejected" | "hired";
  applied_at: string;
  job_title: string;
  department: string;
  employment_type: string;
  company_name: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
};

export type VacancyPayload = {
  job_title: string;
  department: string;
  designation: string;
  employment_type: "full-time" | "part-time" | "contract" | "intern";
  openings: number;
  experience_min: number;
  experience_max: number;
  salary_min: number;
  salary_max: number;
  currency: string;
  location_type: "onsite" | "hybrid" | "remote";
  city: string;
  state: string;
  country: string;
  application_deadline: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  match_threshold: number;
  mcq_question_count: number;
  mcq_pass_threshold: number;
  status: "draft" | "open" | "closed" | "filled";
};

// Compatibility types for cloned pages that are not active in staff routes.
export type CompanyProfile = {
  id: number;
  name: string;
  legal_name: string | null;
  registration_number: string;
  tax_id: string | null;
  industry: string;
  website: string | null;
  email: string;
  phone: string;
  alternate_phone: string | null;
  founded_date: string | null;
  employee_count: number;
  company_size: string;
  description: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  contact_person_name: string;
  contact_person_designation: string | null;
  contact_person_email: string;
  contact_person_phone: string;
  status: string;
  created_at: string;
};
export type CompanyRecord = CompanyProfile;
export type CompanyStaffRecord = {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alternate_phone: string | null;
  gender: "male" | "female" | "other" | null;
  date_of_birth: string | null;
  employee_code: string;
  department: string;
  designation: string;
  employment_type: "full-time" | "part-time" | "contract" | "intern";
  date_of_joining: string;
  experience_years: number;
  salary: number;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: "active" | "inactive" | "on-leave";
  notes: string | null;
  created_at: string;
};
export type CompanyStaffPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  gender: "male" | "female" | "other" | "";
  date_of_birth: string;
  employee_code: string;
  department: string;
  designation: string;
  employment_type: "full-time" | "part-time" | "contract" | "intern";
  date_of_joining: string;
  experience_years: number;
  salary: number;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: "active" | "inactive" | "on-leave";
  notes: string;
  login_password: string;
};
export type EntityRecord = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
};
export type CompanyRegistrationPayload = {
  name: string;
  legal_name: string;
  registration_number: string;
  tax_id: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  alternate_phone: string;
  founded_date: string;
  employee_count: number;
  company_size: string;
  description: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  contact_person_name: string;
  contact_person_designation: string;
  contact_person_email: string;
  contact_person_phone: string;
  status: string;
  login_password: string;
};

export const loginStaff = (email: string, password: string) =>
  apiRequest<LoginResponse>("/auth/staff/login", {
    method: "POST",
    body: { email, password },
  });

export const getStaffProfile = () => apiRequest<StaffProfile>("/staff/me", { requiresAuth: true });
export const getStaffVacancies = () => apiRequest<VacancyRecord[]>("/staff/vacancies", { requiresAuth: true });
export const createStaffVacancy = (payload: VacancyPayload) =>
  apiRequest<VacancyRecord>("/staff/vacancies", {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
export const updateStaffVacancy = (id: number, payload: VacancyPayload) =>
  apiRequest<VacancyRecord>(`/staff/vacancies/${id}`, {
    method: "PUT",
    body: payload,
    requiresAuth: true,
  });

export const getStaffApplications = () =>
  apiRequest<ApplicationRecord[]>("/staff/applications", { requiresAuth: true });

export const getStaffApplicationReport = (applicationId: number) =>
  apiRequest<{
    application: ApplicationRecord;
    mcq_questions: Array<Record<string, unknown>>;
    override_history: Array<{
      id: number;
      previous_status: string | null;
      new_status: string;
      override_category?: string;
      override_note: string;
      created_at: string;
      admin_name: string;
      admin_email: string;
    }>;
  }>(
    `/staff/applications/${applicationId}/report`,
    { requiresAuth: true },
  );

export const getStaffApplicationReportPdfUrl = (applicationId: number) =>
  `${API_BASE}/staff/applications/${applicationId}/report.pdf?token=${encodeURIComponent(getAuthSession()?.token || "")}`;

// Compatibility exports retained for cloned components outside active routes.
export const loginCompany = loginStaff;
export const loginAdmin = loginStaff;
export const getCompanyProfile = getStaffProfile as unknown as () => Promise<CompanyProfile>;
export const getCompanyStaff = () =>
  apiRequest<CompanyStaffRecord[]>("/company/staff", { requiresAuth: true });
export const createCompanyStaff = (payload: CompanyStaffPayload) =>
  apiRequest<CompanyStaffRecord>("/company/staff", {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
export const updateCompanyStaff = (id: number, payload: CompanyStaffPayload) =>
  apiRequest<CompanyStaffRecord>(`/company/staff/${id}`, {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
export const getCompanies = () => apiRequest<CompanyProfile[]>("/company", { requiresAuth: true });
export const registerCompany = (payload: CompanyRegistrationPayload) =>
  apiRequest<CompanyProfile>("/company/register", {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
export const updateCompany = (id: number, payload: CompanyRegistrationPayload) =>
  apiRequest<CompanyProfile>(`/company/${id}`, {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
export const getEntities = (entity: "staff" | "candidate") =>
  apiRequest<EntityRecord[]>(`/${entity}`, { requiresAuth: true });
export const createEntity = (
  entity: "staff" | "candidate",
  payload: Omit<EntityRecord, "id" | "created_at">,
) =>
  apiRequest<EntityRecord>(`/${entity}`, {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
