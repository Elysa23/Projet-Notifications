import { markTaskAsCompleted } from "@/lib/airtableApi";

export async function POST() {
    try {
        const result = await markTaskAsCompleted();

        return Response.json(
            {
                success: true,
                data: result,
                message: `${result.length} tâches mises à jour`
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