async function checkBackend() {

    const status =
        document.getElementById("backendStatus");

    status.innerText =
        "Checking backend...";

    try {

        const response =
            await fetch("/api/health");

        const data =
            await response.json();

        status.innerText =
            "Backend Status: " + data.message;

    } catch (error) {

        status.innerText =
            "Backend connection failed";

    }
}
