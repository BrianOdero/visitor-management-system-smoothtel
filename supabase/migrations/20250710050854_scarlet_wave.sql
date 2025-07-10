/*
  # Comprehensive Visitor Management System Database Schema

  ## Overview
  This schema supports a multi-tenant visitor management system that can be used by various companies.
  It includes all necessary tables for visitor registration, host management, approval workflows,
  notifications, analytics, and security features.

  ## Key Features
  1. **Multi-tenancy**: Support for multiple companies/organizations
  2. **User Management**: Different user roles (admin, host, security, etc.)
  3. **Visitor Management**: Complete visitor lifecycle from registration to checkout
  4. **Approval Workflows**: Configurable approval processes
  5. **Notifications**: Email and SMS notifications
  6. **Security**: Access control, visitor badges, and security logs
  7. **Analytics**: Comprehensive reporting and analytics
  8. **Audit Trail**: Complete audit logging for compliance

  ## Tables Created
  1. organizations - Company/tenant information
  2. users - System users (hosts, admins, security)
  3. visitor_registrations - Main visitor registration records
  4. approval_workflows - Approval process management
  5. notifications - Notification tracking
  6. visitor_badges - Digital badge management
  7. security_logs - Security and access logs
  8. analytics_events - Event tracking for analytics
  9. system_settings - Configurable system settings
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table (Multi-tenancy support)
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#f97316',
  accent_color text DEFAULT '#059669',
  contact_email text NOT NULL,
  contact_phone text,
  address text,
  timezone text DEFAULT 'UTC',
  business_hours jsonb DEFAULT '{"monday": {"open": "09:00", "close": "17:00"}, "tuesday": {"open": "09:00", "close": "17:00"}, "wednesday": {"open": "09:00", "close": "17:00"}, "thursday": {"open": "09:00", "close": "17:00"}, "friday": {"open": "09:00", "close": "17:00"}, "saturday": null, "sunday": null}',
  settings jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table (Hosts, Admins, Security personnel)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text,
  department text,
  phone text,
  avatar_url text,
  role text NOT NULL CHECK (role IN ('admin', 'host', 'security', 'receptionist', 'viewer')),
  permissions jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Visitor registrations table (Main visitor data)
CREATE TABLE IF NOT EXISTS visitor_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  visitor_phone text NOT NULL,
  country_code text NOT NULL DEFAULT '+1',
  company text,
  purpose_of_visit text NOT NULL,
  host_id uuid REFERENCES users(id) ON DELETE SET NULL,
  host_name text NOT NULL, -- Denormalized for historical records
  host_email text NOT NULL, -- Denormalized for historical records
  expected_arrival_time timestamptz,
  expected_duration_minutes integer DEFAULT 60,
  actual_arrival_time timestamptz,
  actual_departure_time timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'checked_in', 'checked_out', 'no_show', 'cancelled')),
  approval_notes text,
  visitor_photo_url text,
  identification_type text CHECK (identification_type IN ('drivers_license', 'passport', 'national_id', 'other')),
  identification_number text,
  emergency_contact_name text,
  emergency_contact_phone text,
  special_requirements text,
  security_clearance_level text DEFAULT 'standard' CHECK (security_clearance_level IN ('standard', 'elevated', 'restricted')),
  badge_number text,
  parking_space text,
  escort_required boolean DEFAULT false,
  escort_assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  pre_registration boolean DEFAULT false,
  recurring_visit boolean DEFAULT false,
  recurring_pattern jsonb, -- For recurring visits
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Approval workflows table
CREATE TABLE IF NOT EXISTS approval_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  approver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  approver_name text NOT NULL,
  approver_email text NOT NULL,
  step_number integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'skipped')),
  decision_notes text,
  decision_made_at timestamptz,
  due_date timestamptz,
  reminder_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  visitor_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_name text,
  notification_type text NOT NULL CHECK (notification_type IN ('visitor_confirmation', 'host_notification', 'approval_request', 'approval_decision', 'check_in_notification', 'check_out_notification', 'reminder', 'security_alert')),
  subject text NOT NULL,
  message_text text,
  message_html text,
  delivery_method text NOT NULL DEFAULT 'email' CHECK (delivery_method IN ('email', 'sms', 'push', 'in_app')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  sent_at timestamptz,
  delivered_at timestamptz,
  error_message text,
  retry_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Visitor badges table (Digital badge management)
CREATE TABLE IF NOT EXISTS visitor_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  badge_number text UNIQUE NOT NULL,
  qr_code_data text NOT NULL,
  badge_template text DEFAULT 'standard',
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  access_zones text[] DEFAULT '{}',
  special_permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  visitor_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('visitor_check_in', 'visitor_check_out', 'badge_scan', 'access_granted', 'access_denied', 'security_alert', 'system_login', 'system_logout', 'data_export', 'settings_change')),
  event_description text NOT NULL,
  ip_address inet,
  user_agent text,
  location text,
  device_info jsonb,
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_category text NOT NULL,
  visitor_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  properties jsonb DEFAULT '{}',
  session_id text,
  timestamp timestamptz DEFAULT now()
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  setting_key text NOT NULL,
  setting_value jsonb NOT NULL,
  setting_type text NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'object', 'array')),
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, setting_key)
);

-- Visitor check-ins table (Separate table for check-in/out events)
CREATE TABLE IF NOT EXISTS visitor_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  check_in_time timestamptz DEFAULT now(),
  check_out_time timestamptz,
  checked_in_by uuid REFERENCES users(id) ON DELETE SET NULL,
  checked_out_by uuid REFERENCES users(id) ON DELETE SET NULL,
  check_in_location text,
  check_out_location text,
  visitor_signature_url text,
  host_signature_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Visitor groups table (For group visits)
CREATE TABLE IF NOT EXISTS visitor_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  group_name text NOT NULL,
  group_leader_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE CASCADE,
  total_visitors integer NOT NULL DEFAULT 1,
  purpose_of_visit text NOT NULL,
  host_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Visitor group members table
CREATE TABLE IF NOT EXISTS visitor_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_group_id uuid REFERENCES visitor_groups(id) ON DELETE CASCADE,
  visitor_registration_id uuid REFERENCES visitor_registrations(id) ON DELETE CASCADE,
  is_leader boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitor_registrations_organization_id ON visitor_registrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_visitor_registrations_host_id ON visitor_registrations(host_id);
CREATE INDEX IF NOT EXISTS idx_visitor_registrations_status ON visitor_registrations(status);
CREATE INDEX IF NOT EXISTS idx_visitor_registrations_created_at ON visitor_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_registrations_visitor_email ON visitor_registrations(visitor_email);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_notifications_organization_id ON notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_security_logs_organization_id ON security_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_organization_id ON analytics_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Organizations are viewable by authenticated users" ON organizations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Organizations can be managed by admins" ON organizations
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_user_id = auth.uid() 
      AND users.organization_id = organizations.id 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view users in their organization" ON users
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE TO authenticated USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can manage users in their organization" ON users
  FOR ALL TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for visitor_registrations
CREATE POLICY "Visitor registrations are viewable by organization members" ON visitor_registrations
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create visitor registrations" ON visitor_registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Organization members can update visitor registrations" ON visitor_registrations
  FOR UPDATE TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for approval_workflows
CREATE POLICY "Approval workflows are viewable by organization members" ON approval_workflows
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can create approval workflows" ON approval_workflows
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Approvers can update their approval workflows" ON approval_workflows
  FOR UPDATE TO authenticated USING (
    approver_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Notifications are viewable by organization members" ON notifications
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for visitor_badges
CREATE POLICY "Visitor badges are viewable by organization members" ON visitor_badges
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage visitor badges" ON visitor_badges
  FOR ALL TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for security_logs
CREATE POLICY "Security logs are viewable by admins and security personnel" ON security_logs
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role IN ('admin', 'security')
    )
  );

CREATE POLICY "System can create security logs" ON security_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for analytics_events
CREATE POLICY "Analytics events are viewable by admins" ON analytics_events
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "System can create analytics events" ON analytics_events
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for system_settings
CREATE POLICY "System settings are viewable by organization members" ON system_settings
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    ) OR is_public = true
  );

CREATE POLICY "Admins can manage system settings" ON system_settings
  FOR ALL TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for visitor_checkins
CREATE POLICY "Visitor checkins are viewable by organization members" ON visitor_checkins
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can manage visitor checkins" ON visitor_checkins
  FOR ALL TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for visitor_groups
CREATE POLICY "Visitor groups are viewable by organization members" ON visitor_groups
  FOR SELECT TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can manage visitor groups" ON visitor_groups
  FOR ALL TO authenticated USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for visitor_group_members
CREATE POLICY "Visitor group members are viewable by organization members" ON visitor_group_members
  FOR SELECT TO authenticated USING (
    visitor_group_id IN (
      SELECT id FROM visitor_groups 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Organization members can manage visitor group members" ON visitor_group_members
  FOR ALL TO authenticated USING (
    visitor_group_id IN (
      SELECT id FROM visitor_groups 
      WHERE organization_id IN (
        SELECT organization_id FROM users WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_organization_stats(org_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_visitors', COUNT(*),
    'pending_approvals', COUNT(*) FILTER (WHERE status = 'pending'),
    'checked_in_today', COUNT(*) FILTER (WHERE status = 'checked_in' AND DATE(created_at) = CURRENT_DATE),
    'total_hosts', (SELECT COUNT(*) FROM users WHERE organization_id = org_id AND role = 'host')
  )
  INTO result
  FROM visitor_registrations
  WHERE organization_id = org_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to automatically create approval workflows
CREATE OR REPLACE FUNCTION create_approval_workflow()
RETURNS TRIGGER AS $$
BEGIN
  -- Create approval workflow for the host
  INSERT INTO approval_workflows (
    visitor_registration_id,
    organization_id,
    approver_id,
    approver_name,
    approver_email,
    step_number,
    due_date
  )
  SELECT 
    NEW.id,
    NEW.organization_id,
    NEW.host_id,
    NEW.host_name,
    NEW.host_email,
    1,
    NOW() + INTERVAL '24 hours'
  WHERE NEW.status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic approval workflow creation
CREATE TRIGGER trigger_create_approval_workflow
  AFTER INSERT ON visitor_registrations
  FOR EACH ROW
  EXECUTE FUNCTION create_approval_workflow();

-- Create function to update visitor registration status based on approval
CREATE OR REPLACE FUNCTION update_visitor_status_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE visitor_registrations 
    SET status = 'approved', updated_at = NOW()
    WHERE id = NEW.visitor_registration_id;
  ELSIF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    UPDATE visitor_registrations 
    SET status = 'rejected', updated_at = NOW()
    WHERE id = NEW.visitor_registration_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status updates
CREATE TRIGGER trigger_update_visitor_status_on_approval
  AFTER UPDATE ON approval_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_visitor_status_on_approval();

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  org_id uuid,
  event_type text,
  event_description text,
  visitor_reg_id uuid DEFAULT NULL,
  user_id uuid DEFAULT NULL,
  metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO security_logs (
    organization_id,
    visitor_registration_id,
    user_id,
    event_type,
    event_description,
    metadata
  )
  VALUES (
    org_id,
    visitor_reg_id,
    user_id,
    event_type,
    event_description,
    metadata
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default organization (Smoothtel)
INSERT INTO organizations (
  name,
  slug,
  logo_url,
  primary_color,
  secondary_color,
  accent_color,
  contact_email,
  contact_phone,
  address
) VALUES (
  'Smoothtel',
  'smoothtel',
  '/smoothtel_logo.png',
  '#2563eb',
  '#f97316',
  '#059669',
  'info@smoothtel.com',
  '+254 700 000 000',
  'Nairobi, Kenya'
) ON CONFLICT (slug) DO NOTHING;