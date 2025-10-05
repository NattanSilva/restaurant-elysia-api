CREATE TABLE "restaurants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "restaurants_name_unique" UNIQUE("name"),
	CONSTRAINT "restaurants_contact_unique" UNIQUE("contact")
);
