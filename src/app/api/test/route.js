export async function GET(request) {
    return new Response(JSON.stringify({ message: 'Hello, GET method! Test !!' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}