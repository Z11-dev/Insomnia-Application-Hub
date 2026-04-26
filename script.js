// 🔑 MULTIPLE ACCOUNTS
const accounts = [
    {user: "admin", pass: "1234"},
    {user: "owner", pass: "5678"}
];

// 🔗 DISCORD WEBHOOK
const webhookURL = "PASTE_YOUR_WEBHOOK_HERE";

// LOAD DATA
let apps = JSON.parse(localStorage.getItem("apps")) || [];

// LOGIN
function login() {
    const u = document.getElementById("loginUser").value;
    const p = document.getElementById("loginPass").value;

    const valid = accounts.find(acc => acc.user === u && acc.pass === p);

    if(valid){
        window.location.href = "admin.html";
    } else {
        alert("Invalid login");
    }
}

// SUBMIT APPLICATION
function submitApp() {
    const app = {
        id: Date.now(),
        username: document.getElementById("username").value,
        discord: document.getElementById("discord").value,
        why: document.getElementById("why").value,
        traits: document.getElementById("traits").value,
        division: document.getElementById("division").value,
        experience: document.getElementById("experience").value,
        activity: document.getElementById("activity").value,
        status: "pending"
    };

    apps.push(app);
    localStorage.setItem("apps", JSON.stringify(apps));

    sendToDiscord(app);

    alert("Application Submitted!");
}

// DISCORD WEBHOOK
function sendToDiscord(app) {
    fetch(webhookURL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            content: "**New Application Submitted!**",
            embeds: [{
                title: app.username,
                color: 10494192,
                fields: [
                    {name: "Discord", value: app.discord},
                    {name: "Why", value: app.why},
                    {name: "Traits", value: app.traits},
                    {name: "Division", value: app.division},
                    {name: "Experience", value: app.experience},
                    {name: "Active", value: app.activity}
                ]
            }]
        })
    });
}

// RENDER APPS
function render(type) {
    const container = document.getElementById("apps");
    if(!container) return;

    container.innerHTML = "";

    apps.filter(a => a.status === type).forEach(app => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <b>${app.username}</b><br>
            ${app.discord}<br><br>

            <b>Why:</b> ${app.why}<br>
            <b>Traits:</b> ${app.traits}<br>
            <b>Division:</b> ${app.division}<br>
            <b>Experience:</b> ${app.experience}<br>
            <b>Active:</b> ${app.activity}<br><br>

            ${type === "pending" ? `
                <button onclick="update(${app.id}, 'accepted')">Accept</button>
                <button onclick="update(${app.id}, 'declined')">Decline</button>
            ` : ""}

            <button onclick="removeApp(${app.id})">Delete</button>
        `;

        container.appendChild(div);
    });
}

// UPDATE STATUS
function update(id, status) {
    apps = apps.map(a => a.id === id ? {...a, status} : a);
    localStorage.setItem("apps", JSON.stringify(apps));
    render(status);
}

// DELETE
function removeApp(id) {
    apps = apps.filter(a => a.id !== id);
    localStorage.setItem("apps", JSON.stringify(apps));
    render("pending");
}