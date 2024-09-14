-- Create a table for user-specific settings
create table
  public.user_settings (
    user_id uuid not null,
    country text null default 'CA'::text,
    minimum_savings_threshold integer null default 30,
    cleanup_days_threshold integer null default 5,
    maximum_posts_per_session integer null default 15,
    delay_between_posts integer null default 300,
    delay_between_sessions integer null default 3600,
    recently_updated_hour_threshold integer null default 5,
    special_message_threshold integer null default 70,
    random_image_toggle boolean null default false,
    associate_tag text null,
    start_time time without time zone null,
    end_time time without time zone null,
    fb_group_link text null,
    fb_page_id text null,
    logins jsonb null,
    access_token text null,
    updated_at timestamp with time zone null default now(),
    running_status boolean null default false,
    associate_tag_percentage integer null default 0,
    first_line_message text not null default '🎉 Limited Time Offer! 🎉'::text,
    bottom_line_message text not null default ''::text,
    constraint user_settings_pkey primary key (user_id),
    constraint user_settings_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Profiles are viewable by self." on profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create Stripe Customer Table
-- One stripe customer per user (PK enforced)
-- Limit RLS policies -- mostly only server side access
create table stripe_customers (
  user_id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  stripe_customer_id text unique
);
alter table stripe_customers enable row level security;

-- Create a table for "Contact Us" form submissions
-- Limit RLS policies -- only server side access
create table contact_requests (
  id uuid primary key default gen_random_uuid(),
  updated_at timestamp with time zone,
  first_name text,
  last_name text,
  email text,
  phone text,
  message_body text
);
alter table contact_requests enable row level security;

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');\
    -- Insert default settings data
  insert into public.user_settings (user_id)
  values (new.id);
  return new;


end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
