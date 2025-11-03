-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Components table
CREATE TABLE components (
  id TEXT PRIMARY KEY DEFAULT substring(md5(random()::text || clock_timestamp()::text) from 1 for 8),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT DEFAULT 'javascript' CHECK (language IN ('javascript', 'typescript')),
  
  -- Privacy & Permissions
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  
  -- Preview settings
  preview_settings JSONB DEFAULT '{
    "layout": "center",
    "width": "auto",
    "height": "auto",
    "padding": 32,
    "background": "#ffffff",
    "scale": 1
  }'::jsonb,
  
  -- Props documentation (optional)
  props JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(created_by, slug)
);

-- Component collaborators (for edit permissions)
CREATE TABLE component_collaborators (
  component_id TEXT NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor' CHECK (role IN ('viewer', 'editor')),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID NOT NULL REFERENCES auth.users(id),
  PRIMARY KEY (component_id, user_id)
);

-- Component dependencies (for caching and analysis)
CREATE TABLE component_dependencies (
  component_id TEXT NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  depends_on TEXT NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  depth INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (component_id, depends_on)
);

-- Indexes for performance
CREATE INDEX idx_components_created_by ON components(created_by);
CREATE INDEX idx_components_visibility ON components(visibility) WHERE visibility = 'public';
CREATE INDEX idx_components_slug ON components(slug);
CREATE INDEX idx_components_tags ON components USING GIN(tags);
CREATE INDEX idx_collaborators_user ON component_collaborators(user_id);
CREATE INDEX idx_dependencies_component ON component_dependencies(component_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to check if user can view component
CREATE OR REPLACE FUNCTION can_view_component(component_id TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM components c
    WHERE c.id = component_id
    AND (
      c.visibility = 'public'
      OR c.created_by = user_id
      OR EXISTS (
        SELECT 1 FROM component_collaborators cc
        WHERE cc.component_id = c.id
        AND cc.user_id = user_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can edit component
CREATE OR REPLACE FUNCTION can_edit_component(component_id TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM components c
    WHERE c.id = component_id
    AND (
      c.created_by = user_id
      OR EXISTS (
        SELECT 1 FROM component_collaborators cc
        WHERE cc.component_id = c.id
        AND cc.user_id = user_id
        AND cc.role = 'editor'
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_dependencies ENABLE ROW LEVEL SECURITY;

-- Components Policies

-- Anyone can view public components
CREATE POLICY "Public components are viewable by everyone"
  ON components FOR SELECT
  USING (visibility = 'public');

-- Users can view their own components
CREATE POLICY "Users can view own components"
  ON components FOR SELECT
  USING (auth.uid() = created_by);

-- Users can view components they collaborate on
CREATE POLICY "Users can view collaborated components"
  ON components FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM component_collaborators
      WHERE component_id = id
      AND user_id = auth.uid()
    )
  );

-- Users can create components
CREATE POLICY "Authenticated users can create components"
  ON components FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own components
CREATE POLICY "Users can update own components"
  ON components FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can update components they have editor access to
CREATE POLICY "Editors can update collaborated components"
  ON components FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM component_collaborators
      WHERE component_id = id
      AND user_id = auth.uid()
      AND role = 'editor'
    )
  );

-- Only creators can delete components
CREATE POLICY "Only creators can delete components"
  ON components FOR DELETE
  USING (auth.uid() = created_by);

-- Collaborators Policies

-- Users can view collaborators of components they can view
CREATE POLICY "Users can view collaborators of accessible components"
  ON component_collaborators FOR SELECT
  USING (
    can_view_component(component_id, auth.uid())
  );

-- Only creators can add collaborators
CREATE POLICY "Only creators can add collaborators"
  ON component_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM components
      WHERE id = component_id
      AND created_by = auth.uid()
    )
  );

-- Only creators can remove collaborators
CREATE POLICY "Only creators can remove collaborators"
  ON component_collaborators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM components
      WHERE id = component_id
      AND created_by = auth.uid()
    )
  );

-- Dependencies Policies (read-only for users)

-- Anyone can view dependencies of public components
CREATE POLICY "Anyone can view public component dependencies"
  ON component_dependencies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM components
      WHERE id = component_id
      AND visibility = 'public'
    )
  );

-- Users can view dependencies of their own components
CREATE POLICY "Users can view own component dependencies"
  ON component_dependencies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM components
      WHERE id = component_id
      AND created_by = auth.uid()
    )
  );