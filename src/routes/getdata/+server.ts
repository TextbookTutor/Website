export async function GET() {
    return await fetch('http://localhost:8000/getcourses');
}