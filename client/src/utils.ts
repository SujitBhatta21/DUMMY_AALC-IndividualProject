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
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers, // I can still override headers.
        },
    });
    
    // BugFix: When session expired after 24 Hrs it was not removing token and User account render.
    // Fix: Sign user out and redirrect to login page if response status is not 200.
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/accounts/login";
    }
    return response;
}