import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteSubmission, markSubmissionRead } from "@/lib/submissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  await markSubmissionRead(id, Boolean(body.read));
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  await deleteSubmission(id);
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
