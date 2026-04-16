const ALERT_API = "http://localhost:8080/api/flood-alert/check";
const CHAT_API = "http://localhost:8080/api/chat";

const map = L.map("map", { zoomControl: true }).setView([7.8731, 80.7718], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: "abc",
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

setTimeout(() => map.invalidateSize(true), 300);
window.addEventListener("resize", () => map.invalidateSize(true));

const els = {
    themeBtn: document.getElementById("themeBtn"),
    menuBtn: document.getElementById("menuBtn"),
    navLinks: document.getElementById("navLinks"),
    locateBtn: document.getElementById("locateBtn"),
    clearBtn: document.getElementById("clearBtn"),

    riskLevel: document.getElementById("riskLevel"),
    nearestZone: document.getElementById("nearestZone"),
    waterLevel: document.getElementById("waterLevel"),
    instructions: document.getElementById("instructions"),
    lat: document.getElementById("lat"),
    lng: document.getElementById("lng"),
    gpsAccuracy: document.getElementById("gpsAccuracy"),

    districtSelect: document.getElementById("districtSelect"),
    emergencyList: document.getElementById("emergencyList"),

    chatBox: document.getElementById("chatBox"),
    chatInput: document.getElementById("chatInput"),
    chatSendBtn: document.getElementById("chatSendBtn"),
};

let userMarker = null;
let userCircle = null;

function resetDashboard() {
    els.riskLevel.textContent = "-";
    els.nearestZone.textContent = "-";
    els.waterLevel.textContent = "-";
    els.instructions.textContent = "Press Locate Me to get flood instructions.";
    els.lat.textContent = "-";
    els.lng.textContent = "-";
    els.gpsAccuracy.textContent = "-";
}

function clearMapUserLayers() {
    if (userMarker) map.removeLayer(userMarker);
    if (userCircle) map.removeLayer(userCircle);
    userMarker = null;
    userCircle = null;
}

function colorByRisk(risk) {
    if (risk === "HIGH") return "#ef4444";
    if (risk === "MEDIUM") return "#f59e0b";
    return "#10b981";
}

function updateActiveNav() {
    const sectionIds = ["home", "live", "data", "emergency", "assistant"];
    let current = "home";

    for (const id of sectionIds) {
        const sec = document.getElementById(id);
        if (!sec) continue;
        if (window.scrollY >= sec.offsetTop - 100) current = id;
    }

    document.querySelectorAll(".links a").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
}

els.menuBtn.addEventListener("click", () => {
    els.navLinks.classList.toggle("open");
});

document.querySelectorAll(".links a").forEach((a) => {
    a.addEventListener("click", () => {
        els.navLinks.classList.remove("open");
    });
});

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

els.themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    setTimeout(() => map.invalidateSize(true), 150);
});

els.clearBtn.addEventListener("click", () => {
    clearMapUserLayers();
    map.setView([7.8731, 80.7718], 7);
    resetDashboard();
    setTimeout(() => map.invalidateSize(true), 150);
});

els.locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;

            els.lat.textContent = latitude.toFixed(6);
            els.lng.textContent = longitude.toFixed(6);
            els.gpsAccuracy.textContent = `${Math.round(accuracy)} m`;

            if (accuracy > 1000) {
                els.instructions.textContent =
                    "GPS accuracy is low. Try enabling precise location, Wi-Fi, and moving outdoors.";
            }

            clearMapUserLayers();

            userMarker = L.marker([latitude, longitude]).addTo(map);

            userCircle = L.circle([latitude, longitude], {
                radius: 5000,
                color: "#60a5fa",
                fillColor: "#60a5fa",
                fillOpacity: 0.12,
                weight: 2,
            }).addTo(map);

            map.setView([latitude, longitude], 12);
            setTimeout(() => map.invalidateSize(true), 150);

            try {
                const res = await fetch(ALERT_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ latitude, longitude }),
                });

                if (!res.ok) throw new Error("Server error: " + res.status);

                const data = await res.json();

                els.riskLevel.textContent = data.riskLevel ?? "-";
                els.nearestZone.textContent = data.nearestZone ?? "-";
                els.waterLevel.textContent = data.currentWaterLevel != null
                    ? `${Number(data.currentWaterLevel).toFixed(2)} m`
                    : "-";
                if (accuracy <= 1000) {
                    els.instructions.textContent = data.instructions ?? "-";
                }

                const c = colorByRisk(data.riskLevel);
                userCircle.setStyle({ color: c, fillColor: c, fillOpacity: 0.14 });
            } catch {
                els.instructions.textContent =
                    "Could not connect to backend. Make sure Spring Boot is running on port 8080.";
            }
        },
        () => {
            els.instructions.textContent =
                "Location permission denied. Allow location access and try again.";
        },
        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        }
    );
});

/* Emergency contacts */
const commonNumbers = [
    { label: "Police Emergency", number: "119" },
    { label: "Ambulance / Fire", number: "110" },
    { label: "Disaster Management Centre (DMC)", number: "117" }
];

const districtNumbers = {
    Colombo: [
        { label: "Colombo General Hospital", number: "+94 11 2691111" },
        { label: "CMC Emergency", number: "+94 11 2686000" }
    ],
    Gampaha: [{ label: "Gampaha District Secretariat", number: "+94 33 2222233" }],
    Kalutara: [{ label: "Kalutara District Secretariat", number: "+94 34 2222233" }],
    Kandy: [{ label: "Kandy National Hospital", number: "+94 81 2233337" }],
    Galle: [{ label: "Galle Teaching Hospital", number: "+94 91 2232261" }],
    Matara: [{ label: "Matara General Hospital", number: "+94 41 2222261" }]
};

function renderEmergencyContacts(district) {
    const districtSpecific = districtNumbers[district] || [
        { label: `${district} District Secretariat`, number: "Check official district contact list" }
    ];

    const all = [...commonNumbers, ...districtSpecific];
    els.emergencyList.innerHTML = all
        .map(item => `<div class="chat-line"><strong>${item.label}:</strong> ${item.number}</div>`)
        .join("");
}

els.districtSelect.addEventListener("change", (e) => {
    const district = e.target.value;
    if (!district) {
        els.emergencyList.textContent = "Select a district to view emergency numbers.";
        return;
    }
    renderEmergencyContacts(district);
});

/* AI Assistant */
function addChatLine(type, text) {
    const line = document.createElement("div");
    line.className = "chat-line " + (type === "user" ? "chat-user" : "chat-bot");
    line.textContent = (type === "user" ? "You: " : "Assistant: ") + text;
    els.chatBox.appendChild(line);
    els.chatBox.scrollTop = els.chatBox.scrollHeight;
}

async function sendChat() {
    const message = els.chatInput.value.trim();
    if (!message) return;

    addChatLine("user", message);
    els.chatInput.value = "";

    try {
        const res = await fetch(CHAT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) throw new Error("Chat API error");

        const data = await res.json();
        addChatLine("bot", data.reply || "No response.");
    } catch {
        addChatLine("bot", "Chat service unavailable right now.");
    }
}

els.chatSendBtn.addEventListener("click", sendChat);
els.chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChat();
});

resetDashboard();
addChatLine("bot", "Hello! Ask me about flood safety, evacuation, or preparedness.");