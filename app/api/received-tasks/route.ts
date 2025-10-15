import { getReceivedTasks } from "@/lib/airtableApi";

export async function GET() {
    try {
        const tasks = await getReceivedTasks();
        return Response.json({
            success: true,
            data: tasks,
            message: `${tasks.length}, tâches récupérées `

        });

    }

    catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        }, { status: 500 });
    }
}