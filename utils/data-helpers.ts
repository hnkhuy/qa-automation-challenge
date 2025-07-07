export function randomUsername(prefix = 'user') {
    return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}

export function randomEmail(domain = 'example.com') {
    return `test_${Math.random().toString(36).substring(2, 10)}@${domain}`;
} 