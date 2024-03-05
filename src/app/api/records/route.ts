import { kv } from "@vercel/kv";

export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
    try {
        const { identifier, message } = await request.json();
        return Response.json({ "status": await RecordBoot(identifier, message) });
    } catch (ex: any) {
        console.error("API POST", ex);
        await RecordBoot("Failed", ex.toString());
        return Response.json({ "status": "Failure" });
    }
}

async function RecordBoot(identifier: string, message: string): Promise<string> {
    "use server";
    try {
        await kv.lpush(
            'records',
            { identifier, message, timestamp: Date.now() }
        );
        return "Success";
    } catch (error) {
        console.error("RecordBoot error!", error);
        return "Error: " + error;
    }
}

async function GetRecordedBoots() {
    try {
        // 0 is the first element; -1 is the last element
        // So this returns the whole list
        const list = await kv.lrange('records', 0, -1);
        return list;
    } catch (error) {
        // Handle errors
        return [];
    }
}

export async function GET(request: Request) {

    return Response.json({ "hello": "world", "boots": await GetRecordedBoots() });
}
