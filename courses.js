document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("category-select");
    const levelSelect = document.getElementById("level-select");
    const durationFilter = document.getElementById("duration-filter");
    const sortSelect = document.getElementById("sort-select");
    const clearFiltersBtn = document.getElementById("clear-filters");
    const courseCards = document.querySelectorAll(".course-card");
    const activeFilters = document.querySelector(".active-filters");
    const toggleButtons = document.querySelectorAll(".toggle-btn");
    const moduleSelect = document.getElementById("module-select");
    const moduleContent = document.getElementById("module-content");
    const moduleTitle = document.getElementById("module-title");
    const quizFeedback = document.getElementById("quiz-feedback");
    const pollResults = document.getElementById("poll-results");
    const userPoints = document.getElementById("user-points");
    const jobCategorySelect = document.getElementById("job-category");
    const jobLevelSelect = document.getElementById("job-level");
    const searchJobsBtn = document.getElementById("search-jobs");
    const jobList = document.getElementById("job-list");
    const templateSelect = document.getElementById("template-select");
    const resumeName = document.getElementById("resume-name");
    const resumeEmail = document.getElementById("resume-email");
    const resumeSkills = document.getElementById("resume-skills");
    const generateResumeBtn = document.querySelector(".resume-input button");
    const resumePreview = document.getElementById("resume-preview");

    // Device Detection
    const detectDevice = () => {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return "mobile";
        if (/tablet/i.test(ua)) return "tablet";
        return "desktop";
    };
    document.body.setAttribute("data-device", detectDevice());

    // Cloud Storage (Simulated with localStorage)
    const CLOUD_STORAGE_KEY = "eduPathData";
    const saveToCloud = (data) => {
        localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
    };
    const loadFromCloud = () => JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}");

    // Sync Architecture
    let syncQueue = [];
    const syncData = () => {
        const state = {
            category: categorySelect.value,
            level: levelSelect.value,
            duration: durationFilter.value,
            sort: sortSelect.value,
            view: document.querySelector(".courses-list").classList.contains("list-view") ? "list" : "grid",
            timestamp: new Date().toISOString(),
        };
        syncQueue.push(state);
        setTimeout(() => {
            saveToCloud(state);
            syncQueue = syncQueue.filter((item) => item.timestamp !== state.timestamp);
        }, 1000);
    };

    // Filters and View Toggle
    function applyFilters() {
        const selectedCategory = categorySelect.value.toLowerCase();
        const selectedLevel = levelSelect.value.toLowerCase();
        const selectedDuration = durationFilter.value.toLowerCase();
        const selectedSort = sortSelect.value.toLowerCase();

        let visibleCards = Array.from(courseCards);

        visibleCards.forEach((card) => {
            const category = card.dataset.category.toLowerCase();
            const level = card.dataset.level.toLowerCase();
            const duration = card.dataset.duration.toLowerCase();

            const matchesCategory = selectedCategory === "all" || category === selectedCategory;
            const matchesLevel = selectedLevel === "all" || level === selectedLevel;
            const matchesDuration = selectedDuration === "all" || duration === selectedDuration;

            if (matchesCategory && matchesLevel && matchesDuration) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        if (selectedSort === "a-z") {
            visibleCards.sort((a, b) => a.querySelector("h2").textContent.localeCompare(b.querySelector("h2").textContent));
        } else if (selectedSort === "z-a") {
            visibleCards.sort((a, b) => b.querySelector("h2").textContent.localeCompare(a.querySelector("h2").textContent));
        }

        visibleCards.forEach((card, index) => (card.style.order = index));
        showActiveFilters();
        syncData();
    }

    function showActiveFilters() {
        activeFilters.innerHTML = "";
        const filters = [];
        if (categorySelect.value !== "all") filters.push(`Category: ${categorySelect.value}`);
        if (levelSelect.value !== "all") filters.push(`Level: ${levelSelect.value}`);
        if (durationFilter.value !== "all") filters.push(`Duration: ${durationFilter.value} weeks`);
        activeFilters.textContent = filters.length ? filters.join(", ") : "No active filters.";
    }

    clearFiltersBtn.addEventListener("click", () => {
        categorySelect.value = "all";
        levelSelect.value = "all";
        durationFilter.value = "all";
        sortSelect.value = "popularity";
        applyFilters();
    });

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            toggleButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const view = btn.getAttribute("aria-label").includes("List") ? "list-view" : "";
            document.querySelector(".courses-list").className = "courses-list" + (view ? ` ${view}` : "");
            syncData();
        });
    });

    // Initial Load
    const initialState = loadFromCloud();
    if (initialState.category) categorySelect.value = initialState.category;
    if (initialState.level) levelSelect.value = initialState.level;
    if (initialState.duration) durationFilter.value = initialState.duration;
    if (initialState.sort) sortSelect.value = initialState.sort;
    if (initialState.view === "list") document.querySelector(".toggle-btn[aria-label='List view']").click();
    applyFilters();

    // Microlearning and Quizzes
    if (moduleSelect) {
        const modules = {
            "html-basics": { title: "HTML Basics", content: "Learn to create a basic HTML structure in under 5 minutes.", quiz: { q1: "true" } },
            "css-styling": { title: "CSS Styling", content: "Apply basic CSS to style your HTML in under 5 minutes.", quiz: { q1: "true" } },
        };
        moduleSelect.value = initialState.lastModule || "html-basics";
        updateModule();

        moduleSelect.addEventListener("change", updateModule);

        function updateModule() {
            const module = modules[moduleSelect.value];
            moduleTitle.textContent = module.title;
            moduleContent.querySelector("#module-description").textContent = module.content;
            const videoSource = moduleContent.querySelector("video source");
            if (videoSource) {
                videoSource.src = `videos/${moduleSelect.value}.mp4`;
                moduleContent.querySelector("video").load();
            }
            saveToCloud({ lastModule: moduleSelect.value });
        }
    }

    window.submitQuiz = (event) => {
        event.preventDefault();
        const form = event.target;
        const answer = form.querySelector('input[name="q1"]:checked')?.value;
        const correctAnswer = { "html-basics": "true", "css-styling": "true" }[moduleSelect.value];
        quizFeedback.textContent = answer === correctAnswer ? "Correct! Well done!" : "Incorrect. Try again!";
        if (answer === correctAnswer) updatePoints(20);
        updateBadge("quiz-master", answer === correctAnswer);

        // Update progress
        const courseTitle = "Microlearning";
        let progressData = JSON.parse(localStorage.getItem(`progress-${courseTitle}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}');
        progressData.quizzes.push(answer === correctAnswer ? 100 : 0);
        progressData.lessons += 1;
        progressData.progress = Math.min((progressData.lessons / 5) * 100, 100);
        progressData.time += 5;
        updateProgressStats(courseTitle, progressData);
        saveToCloud({ [`progress-${courseTitle}`]: progressData });
        checkMilestones(courseTitle, progressData.progress);
    };

    // Polls
    window.submitPoll = (event) => {
        event.preventDefault();
        const form = event.target;
        const vote = form.querySelector('input[name="poll"]:checked')?.value;
        if (vote) {
            let pollData = JSON.parse(localStorage.getItem("pollData") || '{}');
            pollData[vote] = (pollData[vote] || 0) + 1;
            localStorage.setItem("pollData", JSON.stringify(pollData));
            updatePollResults();
            form.reset();
        }
    };

    function updatePollResults() {
        const pollData = JSON.parse(localStorage.getItem("pollData") || '{}');
        pollResults.style.display = "block";
        pollResults.querySelector("#very-count").textContent = pollData.very || 0;
        pollResults.querySelector("#somewhat-count").textContent = pollData.somewhat || 0;
        pollResults.querySelector("#not-count").textContent = pollData.not || 0;
    }
    updatePollResults();

    // Gamification
    let points = parseInt(localStorage.getItem("userPoints")) || 0;
    if (userPoints) userPoints.textContent = points;

    function updatePoints(amount) {
        points += amount;
        localStorage.setItem("userPoints", points);
        if (userPoints) userPoints.textContent = points;
        checkBadges();
    }

    function updateBadge(badgeId, condition) {
        if (condition) {
            const badge = document.getElementById(badgeId);
            if (badge && badge.style.display !== "inline") {
                badge.style.display = "inline";
                updatePoints(50);
            }
        }
    }

    function checkBadges() {
        if (points >= 50) updateBadge("course-explorer", true);
        if (quizFeedback.textContent.includes("Correct")) updateBadge("quiz-master", true);
    }

    // Progress Tracking
    function checkMilestones(courseTitle, progress) {
        const milestones = [25, 50, 75, 100];
        milestones.forEach((milestone) => {
            if (progress >= milestone && !localStorage.getItem(`milestone-${courseTitle}-${milestone}`)) {
                updateBadge(`milestone-${milestone}`, true);
                localStorage.setItem(`milestone-${courseTitle}-${milestone}`, "true");
                updatePoints(30);
            }
        });
    }

    function updateProgressStats(courseTitle, progressData) {
        const card = document.querySelector(`.course-card h2`).closest(".course-card");
        if (card) {
            const stats = card.querySelector(".progress-stats");
            if (stats) {
                stats.querySelector(".lessons-completed").textContent = `${progressData.lessons}/5`;
                stats.querySelector(".time-spent").textContent = `${progressData.time} mins`;
                const avgScore = progressData.quizzes.length ? Math.round(progressData.quizzes.reduce((a, b) => a + b, 0) / progressData.quizzes.length) : 0;
                stats.querySelector(".avg-quiz-score").textContent = `${avgScore}%`;
                card.querySelector(".progress-tracker progress").value = progressData.progress;
                card.querySelector(".progress-percentage").textContent = `${progressData.progress}%`;
            }
        }
    }

    courseCards.forEach((card) => {
        card.querySelector(".enroll-btn").addEventListener("click", () => {
            const courseTitle = card.querySelector("h2").textContent;
            let progressData = JSON.parse(localStorage.getItem(`progress-${courseTitle}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}');
            progressData.progress = Math.min(progressData.progress + 10, 100);
            progressData.lessons += 1;
            progressData.time += 10;
            updateProgressStats(courseTitle, progressData);
            saveToCloud({ [`progress-${courseTitle}`]: progressData });
            checkMilestones(courseTitle, progressData.progress);
            updatePoints(10);
        });
    });

    // Social Learning
    window.postDiscussion = (event, course) => {
        event.preventDefault();
        const form = event.target;
        const content = form.querySelector("textarea").value.trim();
        if (content) {
            let discussions = JSON.parse(localStorage.getItem(`discussions-${course}`) || "[]");
            discussions.push({ content, timestamp: new Date().toISOString(), user: "Anonymous" });
            localStorage.setItem(`discussions-${course}`, JSON.stringify(discussions));
            form.reset();
            updateDiscussion(course);
            updatePoints(10);
            updateBadge("discussion-leader", discussions.length >= 3);
        }
    };

    function updateDiscussion(course) {
        const list = document.getElementById(`discussions-${course.toLowerCase().replace(/\s+/g, "-")}`);
        if (list) {
            const discussions = JSON.parse(localStorage.getItem(`discussions-${course}`) || "[]");
            list.innerHTML = discussions.map(d => `<div class="discussion-item"><p>${d.content}</p><small>${new Date(d.timestamp).toLocaleString()}</small></div>`).join("");
        }
    }

    window.submitProject = (event, course) => {
        event.preventDefault();
        const form = event.target;
        const content = form.querySelector("textarea").value.trim();
        if (content) {
            let submissions = JSON.parse(localStorage.getItem(`submissions-${course}`) || "[]");
            submissions.push({ content, timestamp: new Date().toISOString() });
            localStorage.setItem(`submissions-${course}`, JSON.stringify(submissions));
            form.reset();
            updateSubmissions(course);
            updatePoints(15);

            // Update progress
            let progressData = JSON.parse(localStorage.getItem(`progress-${course}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}');
            progressData.lessons += 1;
            progressData.progress = Math.min((progressData.lessons / 5) * 100, 100);
            progressData.time += 10;
            updateProgressStats(course, progressData);
            saveToCloud({ [`progress-${course}`]: progressData });
            checkMilestones(course, progressData.progress);
        }
    };

    function updateSubmissions(course) {
        const list = document.getElementById(`submissions-${course.toLowerCase().replace(/\s+/g, "-")}`);
        if (list) {
            const submissions = JSON.parse(localStorage.getItem(`submissions-${course}`) || "[]");
            list.innerHTML = submissions.map((s, i) => `<div class="submission-item"><p>Submission ${i + 1}: ${s.content}</p><small>${new Date(s.timestamp).toLocaleString()}</small></div>`).join("");
        }
    }

    window.viewPeerReviews = (course) => {
        const list = document.getElementById(`peer-reviews-${course.toLowerCase().replace(/\s+/g, "-")}`);
        if (list) {
            const peerData = JSON.parse(localStorage.getItem("peerSubmissions") || '{}');
            const submissions = peerData[course] || [];
            list.innerHTML = submissions.map(s => `<div><p>${s.content}</p><p>Reviews: ${s.reviews.map(r => `${r.rating}/5: ${r.comment}`).join("<br>")}</p></div>`).join("");
        }
    };

    // Career Resource Center
    window.openResource = (type) => {
        const resources = {
            guides: "Download our career guides PDF here.",
            tips: "Watch our interview tips video here.",
        };
        alert(resources[type] || "Resource not available.");
        updatePoints(5);
    };

    window.openAssessment = () => {
        const skills = JSON.parse(localStorage.getItem("userSkills") || '[]');
        const score = Math.floor(Math.random() * 100);
        alert(`Skill Assessment Score: ${score}%. Skills detected: ${skills.join(", ") || "None"}`);
        if (score > 70) updatePoints(10);
    };

    // Job Matching Feature
    const jobs = [
        { title: "Junior Web Developer", category: "web", level: "entry", skills: ["HTML", "CSS"] },
        { title: "Data Analyst", category: "data", level: "mid", skills: ["Python", "Pandas"] },
        { title: "UI Designer", category: "design", level: "entry", skills: ["Figma", "Adobe XD"] },
    ];

    searchJobsBtn.addEventListener("click", () => {
        const category = jobCategorySelect.value;
        const level = jobLevelSelect.value;
        const userSkills = JSON.parse(localStorage.getItem("userSkills") || '[]');
        const progressData = JSON.parse(localStorage.getItem(`progress-Microlearning`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}');

        const matchedJobs = jobs.filter(job => {
            const catMatch = category === "all" || job.category === category;
            const lvlMatch = level === "all" || job.level === level;
            const skillMatch = job.skills.some(skill => userSkills.includes(skill)) || progressData.progress >= 50;
            return catMatch && lvlMatch && skillMatch;
        });

        jobList.innerHTML = matchedJobs.map(job => `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p>Level: ${job.level}</p>
                <p>Skills: ${job.skills.join(", ")}</p>
                <button onclick="applyJob('${job.title}')">Apply</button>
            </div>
        `).join("");
        updatePoints(5);
    });

    window.applyJob = (title) => {
        alert(`Applied for ${title}! Check your email for confirmation.`);
        updatePoints(10);
    };

    // Resume Builder
    window.generateResume = () => {
        const template = templateSelect.value;
        const name = resumeName.value || "Your Name";
        const email = resumeEmail.value || "your.email@example.com";
        const skills = resumeSkills.value.split(",").map(s => s.trim()).filter(s => s);

        localStorage.setItem("userSkills", JSON.stringify(skills));

        const resumeContent = `
            <h2>${name}</h2>
            <p>Email: ${email}</p>
            <h3>Skills</h3>
            <ul>${skills.map(s => `<li>${s}</li>`).join("")}</ul>
        `;
        resumePreview.innerHTML = `<div class="resume-template-${template}">${resumeContent}</div>`;
        updatePoints(15);
    };

    // Industry Partner Connections
    window.connectPartner = (partner) => {
        alert(`Connecting to ${partner}... Please check your profile for next steps.`);
        updatePoints(10);
    };

    // Initialize
    courseCards.forEach(card => {
        const courseTitle = card.querySelector("h2").textContent;
        let progressData = JSON.parse(localStorage.getItem(`progress-${courseTitle}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}');
        updateProgressStats(courseTitle, progressData);
        checkMilestones(courseTitle, progressData.progress);
    });
});