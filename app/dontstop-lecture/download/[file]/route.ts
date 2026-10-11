const allowedFiles = new Set([
  "profile-institution.pdf", "profile-friendly.pdf", "proposal-institution.pdf", "proposal-small-group.pdf",
  "profile-institution.docx", "profile-friendly.docx", "proposal-institution.docx", "proposal-small-group.docx", "lecture-kit.zip",
  "proposal-institution.pptx", "proposal-small-group.pptx",
])

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  if (!allowedFiles.has(file)) return new Response("자료를 찾을 수 없습니다.", { status: 404 })
  const source = new URL(`/dontstop-lecture/${file}`, request.url)
  const upstream = await fetch(source, { redirect: "error" })
  if (!upstream.ok) return new Response("자료를 찾을 수 없습니다.", { status: 404 })
  const extension = file.split(".").pop()
  const mime = extension === "pdf" ? "application/pdf" : extension === "zip" ? "application/zip" : extension === "pptx" ? "application/vnd.openxmlformats-officedocument.presentationml.presentation" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  return new Response(upstream.body, { headers: {
    "Content-Type": mime,
    "Content-Disposition": `attachment; filename="${file}"`,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=300",
  } })
}

