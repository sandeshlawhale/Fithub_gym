import { prisma } from "@/lib/prisma";
import TestimonialsListClient from "./TestimonialsListClient";
import { Suspense } from "react";
import TestimonialsLoading from "./loading";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    filter?: string;
  }>;
}

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default function TestimonialsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<TestimonialsLoading />}>
      <TestimonialsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TestimonialsContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || "1");
  const search = params.search || "";
  const filter = params.filter || "all"; // "all" | "pending" | "approved"

  const limit = 10;
  const skip = (page - 1) * limit;

  // Build query where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (filter === "pending") {
    where.isApproved = false;
  } else if (filter === "approved") {
    where.isApproved = true;
  }

  // Fetch count and data
  const [total, testimonials] = await Promise.all([
    prisma.testimonial.count({ where }),
    prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Convert Date objects to ISO strings for serializability
  const serializedTestimonials = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    rating: t.rating,
    review: t.review,
    consent: t.consent,
    isApproved: t.isApproved,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <TestimonialsListClient
      testimonials={serializedTestimonials}
      total={total}
      page={page}
      totalPages={totalPages}
      search={search}
      filter={filter}
    />
  );
}
