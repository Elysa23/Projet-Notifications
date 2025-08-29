const AIRTABLE_API_URL = "https://api.airtable.com/v0/{JH2Uij2OiuQksf}/{Tâches}";
const AIRTABLE_API_KEY = "Bearer {pato0HiokHJUrdHW3.cfa85d1e364be68f6bcb37059bc811e840832e11d506f95308dc31d77b26018f}";

export async function getTasks() {
  const res = await fetch(AIRTABLE_API_URL, {
    headers: { Authorization: AIRTABLE_API_KEY }
  });
  const data = await res.json();
  return data.records;
}

export async function updateTaskStatus(taskId: string, status: string) {
  const res = await fetch(`${AIRTABLE_API_URL}/${taskId}`, {
    method: "PATCH",
    headers: {
      Authorization: AIRTABLE_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: { statut: status }
    })
  });
  return await res.json();
}