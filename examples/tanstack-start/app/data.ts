export const fetchUser = async () => {
    try {
        const res = await fetch('https://randommer.io/Name', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: 'type=firstname&number=1',
            method: 'POST',
            cache: 'no-cache',
        })
        const [user] = await res.json()

        return user as string
    } catch {
        return undefined
    }
}
