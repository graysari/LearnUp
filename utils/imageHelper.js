const IMAGE_BASE_URL =
    'https://mainserver.tail4c25a0.ts.net';

export const getProfilePictureUrl = (path) => {
    if (!path) return null;

    if (
        path.startsWith('file://') ||
        path.startsWith('content://') ||
        path.startsWith('https://') ||
        path.startsWith('http://')
    ) {
        return path;
    }

    const cleanPath = path.replace(/^\/+/, '');

    // If database already includes profiles/
    if (cleanPath.startsWith('profiles/')) {
        return `${IMAGE_BASE_URL}/${cleanPath}`;
    }

    // If database contains filename only
    return `${IMAGE_BASE_URL}/profiles/${cleanPath}`;
};