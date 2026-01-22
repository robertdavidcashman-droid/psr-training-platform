-- Questions and Citations Schema
-- This provides database storage for the training content

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id text PRIMARY KEY,
  topic_id text NOT NULL,
  criterion_id text, -- Direct link to assessment criteria
  difficulty text NOT NULL,
  type text NOT NULL,
  stem text NOT NULL,
  options jsonb, -- Stores MCQ options
  correct_option text,
  explanation text NOT NULL,
  references jsonb DEFAULT '[]'::jsonb, -- Stores structured citations
  tags text[] DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Performance Indexes for Questions
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_criterion_id ON questions(criterion_id);
CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING gin(tags);

-- Question Citations Table (Normalized for complex queries)
CREATE TABLE IF NOT EXISTS question_citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  instrument_name text NOT NULL, -- e.g. "PACE 1984"
  pinpoint_reference text NOT NULL, -- e.g. "s.58"
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Performance Indexes for Citations
CREATE INDEX IF NOT EXISTS idx_question_citations_question_id ON question_citations(question_id);
CREATE INDEX IF NOT EXISTS idx_question_citations_instrument ON question_citations(instrument_name);

-- Authority Pins Table (for mapping criteria to authorities)
CREATE TABLE IF NOT EXISTS authority_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  authority_id text NOT NULL, -- Reference to an authority record
  criterion_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Performance Indexes for Authority Pins
CREATE INDEX IF NOT EXISTS idx_authority_pins_authority_id ON authority_pins(authority_id);
CREATE INDEX IF NOT EXISTS idx_authority_pins_criterion_id ON authority_pins(criterion_id);
