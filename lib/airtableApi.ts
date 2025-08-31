// lib/airtableApi.ts
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;

export async function getTasks() {
  const res = await fetch(AIRTABLE_API_URL, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
    cache: "no-store", // pour forcer Next.js à recharger à chaque appel
  });
  const data = await res.json();
  return data.records;
}

export async function updateTaskStatus(taskId: string, status: string) {
  const res = await fetch(`${AIRTABLE_API_URL}/${taskId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: { statut: status },
    }),
  });
  return await res.json();
}
