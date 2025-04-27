export async function uploadStudents(formData: any) {
  return fetch('http://127.0.0.1:8000/api/upload-attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ students: formData })
  });
}
