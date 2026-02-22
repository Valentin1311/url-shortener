CREATE TABLE "urls" (
	"id" bigint PRIMARY KEY NOT NULL,
	"short_code" varchar(11) NOT NULL,
	"original_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "urls_short_code_unique" UNIQUE("short_code")
);
