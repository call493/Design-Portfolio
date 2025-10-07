const questionSet = [
    {
        id: "intro",
        prompt: "State your full name and organizational unit.",
        guidance: "Enunciate clearly and specify the branch or region overseeing the interview.",
    },
    {
        id: "context",
        prompt: "Describe the purpose of today’s visit and how the respondent was recruited.",
        guidance: "Outline outreach channels and note any consent scripts read before recording.",
    },
    {
        id: "insight",
        prompt: "Share the most pressing challenge the respondent highlighted so far.",
        guidance: "Summarize in under forty seconds and note any follow-up questions required.",
    },
];

const sessionKey = "auralynx-session-state";

const questionPosition = document.getElementById("questionPosition");
const questionTotal = document.getElementById("questionTotal");
const questionTitle = document.getElementById("questionTitle");
const questionHint = document.getElementById("questionHint");
const questionProgress = document.getElementById("questionProgress");
const responseText = document.getElementById("responseText");
const savedState = document.getElementById("savedState");
const sessionLog = document.getElementById("sessionLog");

const prevButton = document.getElementById("prevQuestion");
const nextButton = document.getElementById("nextQuestion");
const saveButton = document.getElementById("saveProgress");
const markRecordedButton = document.getElementById("markRecorded");
const resetSessionButton = document.getElementById("resetSession");

const recordToggle = document.getElementById("recordToggle");
const recordIndicator = document.getElementById("recordIndicator");
const recordTimer = document.getElementById("recordTimer");
const audioLog = document.getElementById("audioLog");

questionTotal.textContent = String(questionSet.length);

function loadState() {
    const raw = window.localStorage.getItem(sessionKey);
    if (!raw) {
        return {
            currentIndex: 0,
            responses: {},
            log: [],
            recordedQuestions: {},
            lastSaved: null,
        };
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            currentIndex: parsed.currentIndex ?? 0,
            responses: parsed.responses ?? {},
            log: Array.isArray(parsed.log) ? parsed.log : [],
            recordedQuestions: parsed.recordedQuestions ?? {},
            lastSaved: parsed.lastSaved ?? null,
        };
    } catch (error) {
        console.error("Failed to parse session state", error);
        window.localStorage.removeItem(sessionKey);
        return {
            currentIndex: 0,
            responses: {},
            log: [],
            recordedQuestions: {},
            lastSaved: null,
        };
    }
}

let sessionState = loadState();

function persistState() {
    sessionState.lastSaved = new Date().toISOString();
    window.localStorage.setItem(sessionKey, JSON.stringify(sessionState));
}

function formatTime(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }
    return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
}

function renderQuestion() {
    const safeIndex = Math.min(Math.max(sessionState.currentIndex, 0), questionSet.length - 1);
    sessionState.currentIndex = safeIndex;
    const currentQuestion = questionSet[safeIndex];

    questionPosition.textContent = String(safeIndex + 1);
    questionTitle.textContent = currentQuestion.prompt;
    questionHint.textContent = currentQuestion.guidance;
    responseText.value = sessionState.responses[currentQuestion.id] ?? "";

    const completedCount = questionSet.filter((item) => (sessionState.responses[item.id] ?? "").trim().length > 0).length;
    const percentage = Math.round((completedCount / questionSet.length) * 100);
    questionProgress.value = Number.isFinite(percentage) ? percentage : 0;

    const recordedState = sessionState.recordedQuestions[currentQuestion.id];
    markRecordedButton.textContent = recordedState ? "Recording marked" : "Mark recording complete";
    markRecordedButton.disabled = Boolean(recordedState);

    updateSavedStateSummary(completedCount);
    renderLog();
    toggleNavigationButtons();
}

function updateSavedStateSummary(completedCount) {
    if (!sessionState.lastSaved) {
        savedState.textContent = "Responses are stored locally on this device until Drive sync.";
        return;
    }

    savedState.textContent = `${completedCount} of ${questionSet.length} responses saved · Last checkpoint ${formatTime(sessionState.lastSaved)}`;
}

function renderLog() {
    sessionLog.textContent = "";
    if (sessionState.log.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No checkpoints yet. Save a response to generate history.";
        sessionLog.appendChild(emptyItem);
        return;
    }

    const sortedLog = [...sessionState.log].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    sortedLog.slice(0, 6).forEach((entry) => {
        const listItem = document.createElement("li");
        const question = questionSet.find((item) => item.id === entry.questionId);
        const questionLabel = question ? question.prompt : entry.questionId;
        listItem.innerHTML = `<time>${formatTime(entry.timestamp)}</time><br>${questionLabel}`;
        sessionLog.appendChild(listItem);
    });
}

function toggleNavigationButtons() {
    prevButton.disabled = sessionState.currentIndex === 0;
    nextButton.disabled = sessionState.currentIndex === questionSet.length - 1;
}

function saveCurrentResponse() {
    const currentQuestion = questionSet[sessionState.currentIndex];
    const content = responseText.value.trim();
    sessionState.responses[currentQuestion.id] = content;

    sessionState.log.push({
        questionId: currentQuestion.id,
        timestamp: new Date().toISOString(),
        length: content.length,
    });

    persistState();
    renderQuestion();
}

function goToPrevious() {
    if (sessionState.currentIndex > 0) {
        sessionState.currentIndex -= 1;
        renderQuestion();
    }
}

function goToNext() {
    if (sessionState.currentIndex < questionSet.length - 1) {
        sessionState.currentIndex += 1;
        renderQuestion();
    }
}

function markCurrentRecorded() {
    const currentQuestion = questionSet[sessionState.currentIndex];
    sessionState.recordedQuestions[currentQuestion.id] = true;
    persistState();
    renderQuestion();
}

function resetSession() {
    window.localStorage.removeItem(sessionKey);
    sessionState = {
        currentIndex: 0,
        responses: {},
        log: [],
        recordedQuestions: {},
        lastSaved: null,
    };
    renderQuestion();
}

prevButton.addEventListener("click", goToPrevious);
nextButton.addEventListener("click", goToNext);
saveButton.addEventListener("click", saveCurrentResponse);
markRecordedButton.addEventListener("click", markCurrentRecorded);
resetSessionButton.addEventListener("click", resetSession);

responseText.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveCurrentResponse();
    }
});

let mediaRecorder;
let mediaStream;
let recordingTimer;
let recordingSeconds = 0;
let lastRecordingDuration = 0;

function updateTimerDisplay() {
    const minutes = String(Math.floor(recordingSeconds / 60)).padStart(2, "0");
    const seconds = String(recordingSeconds % 60).padStart(2, "0");
    recordTimer.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    recordingSeconds = 0;
    updateTimerDisplay();
    recordingTimer = window.setInterval(() => {
        recordingSeconds += 1;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    window.clearInterval(recordingTimer);
    recordingTimer = null;
}

async function beginRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        recordIndicator.textContent = "Recording unavailable";
        return;
    }

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(mediaStream);
        const chunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        });

        mediaRecorder.addEventListener("stop", () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const clipURL = URL.createObjectURL(blob);
            renderClipEntry(blob, clipURL, lastRecordingDuration);

            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        });

        mediaRecorder.start();
        recordToggle.textContent = "Stop recording";
        recordIndicator.textContent = "Recording";
        recordIndicator.classList.add("record-indicator--active");
        startTimer();
    } catch (error) {
        console.error("Unable to access microphone", error);
        recordIndicator.textContent = "Microphone permission denied";
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        lastRecordingDuration = recordingSeconds;
        mediaRecorder.stop();
    }
    stopTimer();
    recordToggle.textContent = "Start recording";
    recordIndicator.textContent = "Idle";
    recordIndicator.classList.remove("record-indicator--active");
    recordingSeconds = 0;
    updateTimerDisplay();
}

function renderClipEntry(blob, clipURL, durationSeconds) {
    const clipWrapper = document.createElement("div");
    clipWrapper.className = "clip-entry";

    const header = document.createElement("div");
    header.className = "clip-header";

    const timestamp = document.createElement("span");
    timestamp.textContent = formatTime(new Date().toISOString());

    const duration = document.createElement("span");
    const displaySeconds = Math.max(Math.round(durationSeconds), 1);
    duration.textContent = `${displaySeconds} sec`;

    header.append(timestamp, duration);

    const audioElement = document.createElement("audio");
    audioElement.setAttribute("controls", "");
    audioElement.src = clipURL;

    const actions = document.createElement("div");
    actions.className = "clip-actions";

    const downloadLink = document.createElement("a");
    downloadLink.href = clipURL;
    downloadLink.download = `auralynx-recording-${Date.now()}.webm`;
    downloadLink.textContent = "Download";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Discard";
    removeButton.addEventListener("click", () => {
        URL.revokeObjectURL(clipURL);
        clipWrapper.remove();
    });

    actions.append(downloadLink, removeButton);
    clipWrapper.append(header, audioElement, actions);
    audioLog.prepend(clipWrapper);
}

recordToggle.addEventListener("click", () => {
    if (recordToggle.textContent.startsWith("Start")) {
        beginRecording();
    } else {
        stopRecording();
    }
});

renderQuestion();
