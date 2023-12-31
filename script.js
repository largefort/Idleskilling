function isFullscreen() {
    return document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
}

let skills = 0;
let skillsPerSecond = 1;
let skillsPerClick = 1;
let db;

let upgradesOwned = {
    click: 0,
    auto: 0
};
let upgradeCosts = {
    click: 10,
    auto: 15
};

const newSkills = [
    { id: 'coding', name: 'Coding', baseCost: 50, baseIncome: 2 },
    { id: 'design', name: 'Design', baseCost: 100, baseIncome: 3 },
    { id: 'writing', name: 'Writing', baseCost: 150, baseIncome: 4 },
    { id: 'cooking', name: 'Cooking', baseCost: 200, baseIncome: 5 },
    { id: 'photography', name: 'Photography', baseCost: 250, baseIncome: 6 },
    { id: 'music_production', name: 'Music Production', baseCost: 300, baseIncome: 7 },
    { id: 'marketing', name: 'Marketing', baseCost: 350, baseIncome: 8 },
    { id: 'networking', name: 'Networking', baseCost: 400, baseIncome: 9 },
    { id: 'meditation', name: 'Meditation', baseCost: 450, baseIncome: 10 },
    { id: 'fitness_training', name: 'Fitness Training', baseCost: 500, baseIncome: 11 },
    { id: 'negotiation', name: 'Negotiation', baseCost: 550, baseIncome: 12 },
    { id: 'gardening', name: 'Gardening', baseCost: 600, baseIncome: 13 }
];

let skillLevels = {};

newSkills.forEach(skill => {
    skillLevels[skill.id] = 0;
});

const request = indexedDB.open("IdleGameDB", 1);
request.onerror = function(event) {};
request.onsuccess = function(event) {
    db = event.target.result;
    loadGameData();
};
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("gameData")) {
        db.createObjectStore("gameData", { keyPath: "id" });
    }
};

function loadGameData() {
    const transaction = db.transaction(["gameData"], "readonly");
    const store = transaction.objectStore("gameData");
    const getRequest = store.get("currentGameData");
    getRequest.onsuccess = function(event) {
        if (getRequest.result) {
            skills = getRequest.result.skills || 0;
            skillsPerSecond = getRequest.result.skillsPerSecond || 1;
            skillsPerClick = getRequest.result.skillsPerClick || 1;
            upgradesOwned = getRequest.result.upgradesOwned || { click: 0, auto: 0 };
            upgradeCosts = getRequest.result.upgradeCosts || { click: 10, auto: 15 };
            skillLevels = getRequest.result.skillLevels || skillLevels;
            updateDisplay();
            renderSkills();
        }
    };
}

function saveGameData() {
    const transaction = db.transaction(["gameData"], "readwrite");
    const store = transaction.objectStore("gameData");
    const gameData = {
        id: "currentGameData",
        skills: skills,
        skillsPerSecond: skillsPerSecond,
        skillsPerClick: skillsPerClick,
        upgradesOwned: upgradesOwned,
        upgradeCosts: upgradeCosts,
        skillLevels: skillLevels
    };
    store.put(gameData);
}

function work() {
    skills += skillsPerClick;
    updateDisplay();
    saveGameData();
}

setInterval(() => {
    skills += skillsPerSecond;
    updateDisplay();
    saveGameData();
}, 1000);

function updateDisplay() {
    document.getElementById('skill-count').innerText = skills;
    document.getElementById('skills-per-second').innerText = skillsPerSecond;
}

function showSection(sectionId) {
    document.getElementById('home-section').hidden = true;
    document.getElementById('upgrades-section').hidden = true;
    document.getElementById('skills-section').hidden = true;
    document.getElementById(sectionId + '-section').hidden = false;
}

function buyUpgrade(type) {}

function buySkill(skillId) {
    const skill = newSkills.find(s => s.id === skillId);
    const cost = skill.baseCost * (skillLevels[skillId] + 1);
    if (skills >= cost) {
        skills -= cost;
        skillsPerSecond += skill.baseIncome;
        skillLevels[skillId] += 1;
        updateDisplay();
        renderSkills();
        saveGameData();
    } else {
        alert("Not enough skills!");
    }
}

function renderSkills() {
    const skillsDiv = document.getElementById('skills-list');
    skillsDiv.innerHTML = '';
    newSkills.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'mb-3';
        const button = document.createElement('button');
        button.className = 'btn btn-info mb-1';
        button.onclick = () => buySkill(skill.id);
        button.textContent = `${skill.name} (Cost: ${skill.baseCost * (skillLevels[skill.id] + 1)} skills)`;
        const levelDisplay = document.createElement('p');
        levelDisplay.textContent = `Level: ${skillLevels[skill.id]} | Income: ${skill.baseIncome * skillLevels[skill.id]} skills/second`;
        skillDiv.appendChild(button);
        skillDiv.appendChild(levelDisplay);
        skillsDiv.appendChild(skillDiv);
    });
}

setInterval(() => {
    saveGameData();
}, 10000);

// Advanced Force Fullscreen Feature
function toggleFullscreen() {
    const elem = document.documentElement;
    if (!isFullscreen()) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const isFullScreen = isFullscreen();

    if (isFullScreen) {
        // Code to run when entering fullscreen
    } else {
        // Code to run when exiting fullscreen
    }
}
