// Shuffling an array with any type used in .
export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}


// Central fetch wrapper — automatically attaches the JWT token if one is stored.
// Useing this instead of raw fetch() for any API call that needs authentication.
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem("token");
    return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers, // I can still override headers.
        },
    });
}