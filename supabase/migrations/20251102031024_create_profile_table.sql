CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT NOT NULL
);

INSERT INTO profiles(id, username, avatar_url)
SELECT
  id,
  raw_user_meta_data->>'user_name' as username,
  raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE components
  DROP CONSTRAINT components_created_by_fkey;

ALTER TABLE components
  ADD CONSTRAINT components_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES profiles(id);

ALTER TABLE component_collaborators
  DROP CONSTRAINT component_collaborators_user_id_fkey, 
  DROP CONSTRAINT component_collaborators_added_by_fkey;

ALTER TABLE component_collaborators
  ADD CONSTRAINT component_collaborators_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id),
  ADD CONSTRAINT component_collaborators_added_by_fkey
  FOREIGN KEY (added_by) REFERENCES profiles(id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );
