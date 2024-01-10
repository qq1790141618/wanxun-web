const serve = inject('serve')

export async function(data, taskName) {
    return fetch(serve + '/import/task/create?name=' + taskName, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
    })
    .then((response) => {
        return Promise.resolve(response.json())
    })
}