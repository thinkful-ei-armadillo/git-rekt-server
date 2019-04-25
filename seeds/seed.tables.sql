BEGIN;
TRUNCATE
  "pointers",
  "queue",
  "user";

INSERT INTO "user"("id", "user_name", "title", "name", "password","slack_user_id")
VALUES
  (
    1,
    'admin',
    'mentor',
    'Dunder Mifflin Admin',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'UJ3CMD8UV'
  ),
  (
    2,
    'student1',
    'student',
    'Matthew',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'UJ3CMD8UV'
  ),
  (
    3,
    'student2',
    'student',
    'Hunter',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'UJ3CMD8UV'
  ),
  (
    4,
    'student3',
    'student',
    'Jonathan',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'UJ3CMD8UV'
  ),
  (
    5,
    'student4',
    'student',
    'Robin',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'UJ3CMD8UV'
  ),
  (
    6,
    'professX',
    'mentor',
    'Xavier',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'UJ3CMD8UV'
  ),
    (
    7,
    'Queen D',
    'mentor',
    'Daenerys Targaryen',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'UJ3CMD8UV'
  );
  
  INSERT INTO "queue" ("id", "description", "user_name", "mentor_user_name", "dequeue", "completed", "next")
  VALUES
    (1, 'help me i dont know what im doing', 'student2', 'professX', TRUE, FALSE, null),
    (2, 'help me i dont know what im doing', 'student3', 'Queen D', TRUE, FALSE, null),
    (3, 'help me i dont know what im doing', 'student4', NULL, FALSE, FALSE, 4),
    (4, 'help me i dont know what im doing', 'student1', NULL, FALSE, FALSE, 5),
    (5, 'help me i dont know what im doing', 'student4', NULL, FALSE, FALSE, null);

  INSERT INTO "pointers"("id", "head", "tail")
  VALUES
    (1, 3, 5);

COMMIT;