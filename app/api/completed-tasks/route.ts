import { markTaskAsCompleted } from "@/lib/airtableApi";
import { count } from "console";

export async function POST(request: Request) {
    try {

        const body = await request.json();
        const taskId = body.taskId;
        const result = await markTaskAsCompleted(taskId);

        return Response.json(
            {
                success: true,
                data: result,
                message: `${count} tâches mises à jour`
            }
        );
    }
    catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue"
        }, { status: 500 });
    }
}