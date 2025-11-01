ALTER TABLE components
ALTER COLUMN preview_settings SET DEFAULT '{
    "layout": "center",
    "padding": 16,
    "background": "#ffffff",
    "scale": 1
  }'::jsonb