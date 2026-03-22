CREATE TABLE interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  movie_id text,
  event_type text,
  created_at timestamp DEFAULT now()
);
