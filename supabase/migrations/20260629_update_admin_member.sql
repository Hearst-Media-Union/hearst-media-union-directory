create or replace function public.update_admin_member(
  p_member_id uuid,
  p_employee_number text,
  p_union_id text,
  p_is_active boolean,
  p_inactive_reason text,
  p_legal_first_name text,
  p_legal_last_name text,
  p_preferred_name text,
  p_work_email text,
  p_personal_email text,
  p_primary_phone text,
  p_location text,
  p_assignment_name text,
  p_unit_title text,
  p_brand text,
  p_unit_tier text,
  p_annual_salary_or_hourly_rate numeric,
  p_date_of_birth date,
  p_gender text,
  p_ethnicity text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_is_active boolean;
begin
  select is_active
  into current_is_active
  from public.members
  where id = p_member_id;

  if current_is_active is null then
    raise exception 'Member not found';
  end if;

  update public.members
  set
    employee_number = nullif(trim(p_employee_number), ''),
    union_id = nullif(trim(p_union_id), ''),
    is_active = p_is_active,
    inactive_reason = case
      when p_is_active then null
      else nullif(trim(p_inactive_reason), '')
    end,
    inactive_at = case
      when p_is_active then null
      when current_is_active = true and p_is_active = false then now()
      else inactive_at
    end,
    legal_first_name = trim(p_legal_first_name),
    legal_last_name = trim(p_legal_last_name),
    preferred_name = nullif(trim(p_preferred_name), ''),
    preferred_name_source = 'admin',
    work_email = nullif(trim(p_work_email), ''),
    personal_email = nullif(trim(p_personal_email), ''),
    personal_email_source = 'admin',
    primary_phone = nullif(trim(p_primary_phone), ''),
    primary_phone_source = 'admin',
    location = nullif(trim(p_location), ''),
    assignment_name = nullif(trim(p_assignment_name), ''),
    unit_title = nullif(trim(p_unit_title), ''),
    brand = nullif(trim(p_brand), ''),
    unit_tier = nullif(trim(p_unit_tier), '')
  where id = p_member_id;

  insert into public.member_sensitive_details (
    member_id,
    annual_salary_or_hourly_rate,
    date_of_birth,
    gender,
    ethnicity
  )
  values (
    p_member_id,
    p_annual_salary_or_hourly_rate,
    p_date_of_birth,
    nullif(trim(p_gender), ''),
    nullif(trim(p_ethnicity), '')
  )
  on conflict (member_id)
  do update set
    annual_salary_or_hourly_rate = excluded.annual_salary_or_hourly_rate,
    date_of_birth = excluded.date_of_birth,
    gender = excluded.gender,
    ethnicity = excluded.ethnicity;
end;
$$;