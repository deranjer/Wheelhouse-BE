DROP TABLE if exists "users"
cascade;
DROP TABLE if exists "compentencies"
cascade;
DROP TABLE if exists "user_competencies"
cascade;
DROP TABLE if exists "user_updates"
cascade;
DROP TABLE if exists "projects"
cascade;
DROP TABLE if exists "categories"
cascade;
DROP TABLE if exists "project_categories"
cascade;
DROP TABLE if exists "milestones"
cascade;
Drop Table if exists "positions"
cascade;
DROP TABLE if exists "messages"
cascade;
DROP TABLE if exists "status_update"
cascade;
DROP TABLE if exists "reactions"
cascade;
DROP TABLE if exists "status_reactions"
cascade;
DROP TABLE if exists "portfolio"
cascade;
DROP TABLE if exists "portfolio_content"
cascade;

CREATE TABLE "users"
(
  "id" integer PRIMARY KEY,
  "full_name" varchar,
  "username" varchar UNIQUE NOT NULL,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "profile_photo_url" varchar,
  "tagline" varchar(250),
  "header_photo_url" varchar,
  "work_status" varchar NOT NULL,
  "bio" text
);

CREATE TABLE "compentencies"
(
  "id" integer PRIMARY KEY,
  "tag" varchar NOT NULL
);

CREATE TABLE "user_competencies"
(
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "competency_id" integer
);

CREATE TABLE "user_updates"
(
  "id" integer PRIMARY KEY,
  "date" timestamp,
  "update_text" varchar,
  "user_id" integer,
  "message_id" integer
);

CREATE TABLE "projects"
(
  "id" integer PRIMARY KEY,
  "name" varchar,
  "user_id" integer,
  "logo_url" varchar,
  "header_photo_url" varchar,
  "tagline" varchar,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "categories"
(
  "id" integer PRIMARY KEY,
  "tag" varchar
);

CREATE TABLE "project_categories"
(
  "id" integer PRIMARY KEY,
  "project_id" integer NOT NULL,
  "category_id" integer NOT NULL
);

CREATE TABLE "milestones"
(
  "id" integer PRIMARY KEY,
  "date" timestamp,
  "description" varchar,
  "project_id" integer
);

CREATE TABLE "positions"
(
  "id" integer PRIMARY KEY,
  "project_id" integer NOT NULL,
  "user_id" integer,
  "title" varchar,
  "description" varchar
);

CREATE TABLE "messages"
(
  "id" integer PRIMARY KEY,
  "date" timestamptz,
  "message" text,
  "sender_id" integer,
  "receiver_id" integer,
  "sequence_number" integer
);

CREATE TABLE "status_update"
(
  "id" integer PRIMARY KEY,
  "date" timestamptz,
  "status" varchar,
  "user_id" integer
);

CREATE TABLE "reactions"
(
  "id" integer PRIMARY KEY,
  "content" varchar
);

CREATE TABLE "status_reactions"
(
  "id" integer PRIMARY KEY,
  "status_id" integer,
  "reaction_id" integer
);

CREATE TABLE "portfolio"
(
  "id" integer PRIMARY KEY,
  "user_id" integer
);

CREATE TABLE "portfolio_content"
(
  "id" integer PRIMARY KEY,
  "card_image" bytea,
  "card_link" varchar,
  "card_id" integer,
  "default_images" bytea
);

ALTER TABLE "user_competencies" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_competencies" ADD FOREIGN KEY ("competency_id") REFERENCES "compentencies" ("id");

ALTER TABLE "user_updates" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "projects" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "project_categories" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "project_categories" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "milestones" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "positions" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "positions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "status_reactions" ADD FOREIGN KEY ("reaction_id") REFERENCES "reactions" ("id");

ALTER TABLE "status_update" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "status_reactions" ADD FOREIGN KEY ("id") REFERENCES "status_update" ("id");

ALTER TABLE "user_updates" ADD FOREIGN KEY ("message_id") REFERENCES "messages" ("id");

ALTER TABLE "portfolio" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "portfolio_content" ADD FOREIGN KEY ("card_id") REFERENCES "portfolio" ("id");