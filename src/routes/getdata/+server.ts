export async function GET() {
    return await fetch('http://127.0.0.1:8000/getcourses');
}