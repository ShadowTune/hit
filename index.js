document.addEventListener("DOMContentLoaded", () => {
  const continueLearningDiv = document.getElementById("continue-learning");
  const continueLink = document.getElementById("continue-link");
  const cards = document.querySelectorAll(".card");
  const moduleSelect = document.getElementById("module-select");
  const moduleContent = document.getElementById("module-content");
  const moduleTitle = document.getElementById("module-title");
  const quizFeedback = document.getElementById("quiz-feedback");
  const durationFilter = document.getElementById("duration-filter");
  const categorySelect = document.getElementById("category-select");
  const levelSelect = document.getElementById("level-select");
  const sortSelect = document.getElementById("sort-select");
  const clearFiltersBtn = document.getElementById("clear-filters");
  const viewToggles = document.querySelectorAll(".view-toggle .toggle-btn");
  const coursesList = document.querySelector(".courses-list");
  const activeFilters = document.querySelector(".active-filters");

  // Device Detection
  const detectDevice = () => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "mobile";
    if (/tablet/i.test(ua)) return "tablet";
    return "desktop";
  };
  document.body.setAttribute("data-device", detectDevice());

  // Cloud Storage Integration (Simulated with localStorage)
  const CLOUD_STORAGE_KEY = "eduPathData";
  const saveToCloud = (data) => {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
    syncData();
  };
  const loadFromCloud = () => JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}");

  // Sync Architecture
  let syncQueue = [];
  const syncData = () => {
    const syncData = {
      lastCourse: continueLearningDiv?.dataset.course || "",
      lastModule: sessionStorage.getItem("lastModule") || "",
      filters: {
        category: categorySelect.value,
        level: levelSelect.value,
        duration: durationFilter.value,
        sort: sortSelect.value,
      },
      view: coursesList.classList.contains("list-view") ? "list" : "grid",
      submissions: Object.fromEntries(
        Object.keys(peerSubmissions).map((course) => [
          course,
          JSON.parse(sessionStorage.getItem(`submissions-${course}`) || "[]"),
        ])
      ),
      timestamp: new Date().toISOString(),
    };
    syncQueue.push(syncData);
    setTimeout(() => {
      saveToCloud(syncData);
      syncQueue = syncQueue.filter((item) => item.timestamp !== syncData.timestamp);
    }, 1000);
  };

  // Check for saved progress with cloud sync
  if (continueLearningDiv && continueLink) {
    const cloudData = loadFromCloud();
    if (cloudData.lastCourse) {
      continueLearningDiv.dataset.course = cloudData.lastCourse;
      continueLink.textContent = cloudData.lastCourse;
      continueLink.href = `#${cloudData.lastCourse.replace(/\s+/g, "-")}`;
      continueLearningDiv.style.display = "block";
      cards.forEach((card) => {
        if (card.dataset.course === cloudData.lastCourse) {
          card.querySelector(".last-viewed").style.display = "block";
          card.style.border = "2px solid var(--primary-color)";
          card.style.backgroundColor = "rgba(0, 123, 255, 0.05)";
        }
      });
    }
    continueLink.addEventListener("click", () => {
      const course = continueLearningDiv.dataset.course;
      sessionStorage.setItem(
        "lastCourse",
        JSON.stringify({ course, timestamp: new Date().toISOString() })
      );
      saveToCloud({ lastCourse: course });
    });
  }

  // Microlearning Modules with Sync
  if (moduleSelect && moduleContent && moduleTitle) {
    const modules = {
      "html-basics": {
        title: "HTML Basics",
        content: "Learn to create a basic HTML structure in under 5 minutes.",
        quiz: { q1: "true" },
      },
      "css-styling": {
        title: "CSS Styling",
        content: "Apply basic CSS to style your HTML in under 5 minutes.",
        quiz: { q1: "true" },
      },
    };
    const cloudData = loadFromCloud();
    moduleSelect.value = cloudData.lastModule || "html-basics";
    moduleSelect.dispatchEvent(new Event("change"));

    moduleSelect.addEventListener("change", (e) => {
      const moduleId = e.target.value;
      const module = modules[moduleId];
      moduleTitle.textContent = module.title;
      moduleContent.querySelector("p").textContent = module.content;
      const videoSource = document.querySelector("video source");
      if (videoSource) {
        videoSource.src = `videos/${moduleId}.mp4`;
        document.querySelector("video").load();
      }
      sessionStorage.setItem("lastModule", moduleId);
      saveToCloud({ lastModule: moduleId });
    });

    function scheduleRepetition(moduleId) {
      setTimeout(() => {
        alert(`Time to review ${modules[moduleId].title}!`);
        moduleSelect.value = moduleId;
        moduleSelect.dispatchEvent(new Event("change"));
      }, 24 * 60 * 60 * 1000); // 24-hour reminder
    }
    scheduleRepetition(moduleSelect.value);
  }

  // Quiz Submission with Sync
  window.submitQuiz = function (event) {
    event.preventDefault();
    const form = event.target;
    const answer = form.querySelector('input[name="q1"]:checked')?.value;
    const correctAnswer = modules[moduleSelect.value].quiz.q1;
    const score = answer === correctAnswer ? 100 : 0;
    quizFeedback.textContent = answer === correctAnswer ? "Correct! Well done!" : "Incorrect. Try again!";
    saveToCloud({
      quizResult: {
        module: moduleSelect.value,
        answer,
        correct: answer === correctAnswer,
        timestamp: new Date().toISOString(),
      },
    });
    if (answer === correctAnswer) updatePoints(20); // Award points for correct quiz
    updateBadge("quiz-master", answer === correctAnswer);

    // Update progress stats for microlearning
    const courseTitle = "Microlearning";
    let progressData = JSON.parse(
      localStorage.getItem(`progress-${courseTitle}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}'
    );
    progressData.quizzes.push(score);
    progressData.lessons += 1;
    progressData.progress = Math.round((progressData.lessons / 5) * 100); // Assuming 5 lessons max for microlearning
    progressData.time += 5; // Simulate 5 minutes per quiz
    updateProgressStats(courseTitle, progressData);
    saveToCloud({ [`progress-${courseTitle}`]: progressData });
    checkMilestones(courseTitle, progressData.progress);
  };

  // Gamification
  let userPoints = parseInt(localStorage.getItem("userPoints") || 0);
  function updatePoints(points) {
    userPoints += points;
    localStorage.setItem("userPoints", userPoints);
    checkBadges();
  }

  function updateBadge(badgeId, condition) {
    if (condition) {
      const badgeElement = document.getElementById(badgeId);
      if (badgeElement && badgeElement.style.display !== "inline") {
        badgeElement.style.display = "inline";
        updatePoints(50); // Bonus points for earning a badge
      }
    }
  }

  function checkBadges() {
    if (userPoints >= 50) updateBadge("course-explorer", true);
    if (quizFeedback.textContent.includes("Correct")) updateBadge("quiz-master", true);
  }

  // Milestone and Achievement System
  function checkMilestones(courseTitle, progress) {
    const milestones = [25, 50, 75, 100];
    milestones.forEach((milestone) => {
      if (progress >= milestone && !localStorage.getItem(`milestone-${courseTitle}-${milestone}`)) {
        updateBadge(`milestone-${milestone}`, true);
        localStorage.setItem(`milestone-${courseTitle}-${milestone}`, "true");
        updatePoints(30); // Award points for milestone
      }
    });
  }

  // Progress Statistics
  function updateProgressStats(courseTitle, progressData) {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      if (card.dataset.course === courseTitle) {
        const statsElement = card.querySelector(".progress-stats");
        if (statsElement) {
          const totalLessons = parseInt(statsElement.querySelector("p:nth-child(2)").textContent.match(/\d+/)[0]) || 5; // Default to 5 for microlearning
          statsElement.querySelector(".lessons-completed").textContent = `${progressData.lessons}/${totalLessons}`;
          statsElement.querySelector(".time-spent").textContent = `${progressData.time || 0}`;
          const avgQuizScore =
            progressData.quizzes.length > 0
              ? Math.round(progressData.quizzes.reduce((a, b) => a + b, 0) / progressData.quizzes.length)
              : 0;
          statsElement.querySelector(".avg-quiz-score").textContent = `${avgQuizScore}%`;
        }
      }
    });
  }

  // Filter and Sort Logic with Sync
  if (categorySelect && levelSelect && sortSelect && durationFilter) {
    const applyFilters = () => {
      const category = categorySelect.value;
      const level = levelSelect.value;
      const duration = durationFilter.value;
      const sort = sortSelect.value;
      const courses = Array.from(document.querySelectorAll(".course-card"));

      const filteredCourses = courses.filter((course) => {
        const matchesCategory = category === "All" || course.dataset.category === category;
        const matchesLevel = level === "All" || course.dataset.level === level;
        const matchesDuration = duration === "all" || course.dataset.duration === duration;
        return matchesCategory && matchesLevel && matchesDuration;
      });

      filteredCourses.sort((a, b) => {
        if (sort === "Popularity") {
          const studentsA = parseInt(a.querySelector("p:nth-child(3)").textContent.match(/\d+/)[0]);
          const studentsB = parseInt(b.querySelector("p:nth-child(3)").textContent.match(/\d+/)[0]);
          return studentsB - studentsA;
        } else if (sort === "A-Z (Alphabetical Order)") {
          return a.querySelector("h2").textContent.localeCompare(b.querySelector("h2").textContent);
        } else if (sort === "Z-A (Reverse Alphabetical)") {
          return b.querySelector("h2").textContent.localeCompare(a.querySelector("h2").textContent);
        }
        return 0;
      });

      courses.forEach((course) => (course.style.display = "none"));
      filteredCourses.forEach((course) => (course.style.display = "block"));

      activeFilters.innerHTML = "";
      if (category !== "All")
        activeFilters.innerHTML += `<span class="filter-tag">Category: ${category} <button onclick="clearFilter('category')" aria-label="Remove category filter">x</button></span>`;
      if (level !== "All")
        activeFilters.innerHTML += `<span class="filter-tag">Level: ${level} <button onclick="clearFilter('level')" aria-label="Remove level filter">x</button></span>`;
      if (duration !== "all")
        activeFilters.innerHTML += `<span class="filter-tag">Duration: ${duration} weeks <button onclick="clearFilter('duration')" aria-label="Remove duration filter">x</button></span>`;
      syncData();
    };

    const savedFilters = loadFromCloud().filters || {};
    categorySelect.value = savedFilters.category || "All";
    levelSelect.value = savedFilters.level || "All";
    durationFilter.value = savedFilters.duration || "all";
    sortSelect.value = savedFilters.sort || "Popularity";
    applyFilters();

    categorySelect.addEventListener("change", () => {
      sessionStorage.setItem("categoryFilter", categorySelect.value);
      applyFilters();
    });
    levelSelect.addEventListener("change", () => {
      sessionStorage.setItem("levelFilter", levelSelect.value);
      applyFilters();
    });
    durationFilter.addEventListener("change", () => {
      sessionStorage.setItem("durationFilter", durationFilter.value);
      applyFilters();
    });
    sortSelect.addEventListener("change", applyFilters);

    clearFiltersBtn.addEventListener("click", () => {
      categorySelect.value = "All";
      levelSelect.value = "All";
      durationFilter.value = "all";
      sortSelect.value = "Popularity";
      sessionStorage.setItem("categoryFilter", "All");
      sessionStorage.setItem("levelFilter", "All");
      sessionStorage.setItem("durationFilter", "all");
      applyFilters();
    });

    window.clearFilter = function (type) {
      if (type === "category") categorySelect.value = "All";
      if (type === "level") levelSelect.value = "All";
      if (type === "duration") durationFilter.value = "all";
      sessionStorage.setItem(`${type}Filter`, type === "duration" ? "all" : "All");
      applyFilters();
    };

    viewToggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewToggles.forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        if (btn.getAttribute("aria-label") === "List view") {
          coursesList.classList.add("list-view");
        } else {
          coursesList.classList.remove("list-view");
        }
        syncData();
      });
    });
  }

  // Initialize submissions and peer reviews with cloud sync
  const initializeSubmissions = () => {
    const courses = [
      "Web Development Fundamentals",
      "Data Science Essentials",
      "Digital Marketing Strategies",
      "Python Programming Basics",
      "UI/UX Design Principles",
      "Business Analytics",
      "Machine Learning with Python",
      "Project Management Basics",
      "Introduction to Cybersecurity",
      "Graphic Design with Canva",
    ];
    const cloudData = loadFromCloud();
    courses.forEach((course) => {
      const submissions =
        cloudData.submissions?.[course] || JSON.parse(sessionStorage.getItem(`submissions-${course}`) || "[]");
      const submissionList = document.getElementById(`submissions-${course.toLowerCase().replace(/\s+/g, "-")}`);
      if (submissionList) {
        submissionList.innerHTML = submissions
          .map((sub, index) => `
          <div class="submission-item">
            <p><strong>Submission ${index + 1}:</strong> ${sub.content}</p>
            <p><small>Submitted on: ${sub.timestamp}</small></p>
          </div>
        `)
          .join("");
      }
    });
    syncData();
  };

  const initializePeerReviews = () => {
    if (!sessionStorage.getItem("peerSubmissions")) {
      sessionStorage.setItem("peerSubmissions", JSON.stringify(peerSubmissions));
    }
  };

  window.submitProject = function (event, course) {
    event.preventDefault();
    const form = event.target;
    const submissionText = form.querySelector("textarea").value;
    const timestamp = new Date().toISOString();
    let submissions = JSON.parse(sessionStorage.getItem(`submissions-${course}`) || "[]");
    submissions.push({ content: submissionText, timestamp });
    sessionStorage.setItem(`submissions-${course}`, JSON.stringify(submissions));
    const feedback = document.getElementById("feedback-message");
    feedback.textContent = `Project submitted successfully for ${course}!`;
    setTimeout(() => (feedback.textContent = ""), 2000);
    form.reset();
    initializeSubmissions();
    saveToCloud({ submissions: { [course]: submissions } });
    updatePoints(15); // Award points for project submission

    // Update progress on project submission
    let progressData = JSON.parse(
      localStorage.getItem(`progress-${course}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}'
    );
    progressData.lessons += 1;
    progressData.progress = Math.round(
      (progressData.lessons / parseInt(document.querySelector(`.course-card h2`).closest(".course-card").querySelector(".progress-stats p:nth-child(2)").textContent.match(/\d+/)[0])) *
        100
    );
    progressData.time += 10; // Simulate 10 minutes per project
    updateProgressStats(course, progressData);
    saveToCloud({ [`progress-${course}`]: progressData });
    checkMilestones(course, progressData.progress);
  };

  window.viewPeerReviews = function (course) {
    const peerReviewList = document.getElementById(`peer-reviews-${course.toLowerCase().replace(/\s+/g, "-")}`);
    const peerData = JSON.parse(sessionStorage.getItem("peerSubmissions"));
    const submissions = peerData[course] || [];
    peerReviewList.innerHTML = submissions
      .map((sub) => `
      <div class="peer-submission" data-submission-id="${sub.id}">
        <p><strong>Submission:</strong> ${sub.content}</p>
        <div class="reviews">
          ${sub.reviews
            .map(
              (review) => `
            <p><strong>Rating:</strong> ${review.rating}/5 - <strong>Comment:</strong> ${review.comment}</p>
          `
            )
            .join("")}
        </div>
        <form class="review-form" onsubmit="submitReview(event, '${course}', ${sub.id})">
          <label for="rating-${course}-${sub.id}">Rating (1-5):</label>
          <input type="number" id="rating-${course}-${sub.id}" name="rating" min="1" max="5" required>
          <label for="comment-${course}-${sub.id}">Comment:</label>
          <textarea id="comment-${course}-${sub.id}" name="comment" placeholder="Your feedback" required></textarea>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    `)
      .join("");
  };

  window.submitReview = function (event, course, submissionId) {
    event.preventDefault();
    const form = event.target;
    const rating = form.querySelector('input[name="rating"]').value;
    const comment = form.querySelector('textarea[name="comment"]').value;
    let peerData = JSON.parse(sessionStorage.getItem("peerSubmissions"));
    const submission = peerData[course].find((sub) => sub.id === submissionId);
    submission.reviews.push({ rating, comment, timestamp: new Date().toISOString() });
    sessionStorage.setItem("peerSubmissions", JSON.stringify(peerData));
    const feedback = document.getElementById("feedback-message");
    feedback.textContent = "Review submitted successfully!";
    setTimeout(() => (feedback.textContent = ""), 2000);
    form.reset();
    viewPeerReviews(course);
    saveToCloud({ peerSubmissions: peerData });
    updatePoints(10); // Award points for review
  };

  window.learnMore = function (course) {
    const feedback = document.getElementById("feedback-message");
    feedback.textContent = `You selected the ${course} course. Redirecting to course details...`;
    sessionStorage.setItem(
      "lastCourse",
      JSON.stringify({
        course: course,
        timestamp: new Date().toISOString(),
      })
    );
    setTimeout(() => (feedback.textContent = ""), 2000);
    saveToCloud({ lastCourse: course });
    updatePoints(5); // Award points for exploring a course

    // Update progress on learn more
    let progressData = JSON.parse(
      localStorage.getItem(`progress-${course}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}'
    );
    progressData.lessons += 1;
    progressData.progress = Math.round(
      (progressData.lessons /
        parseInt(document.querySelector(`.course-card[data-course="${course}"] .progress-stats p:nth-child(2)`).textContent.match(/\d+/)[0])) *
        100
    );
    progressData.time += 5; // Simulate 5 minutes
    updateProgressStats(course, progressData);
    saveToCloud({ [`progress-${course}`]: progressData });
    checkMilestones(course, progressData.progress);
  };

  initializeSubmissions();
  initializePeerReviews();

  // Initialize progress for all cards
  cards.forEach((card) => {
    const courseTitle = card.dataset.course;
    let progressData = JSON.parse(
      localStorage.getItem(`progress-${courseTitle}`) || '{"progress": 0, "lessons": 0, "time": 0, "quizzes": []}'
    );
    updateProgressStats(courseTitle, progressData);
    checkMilestones(courseTitle, progressData.progress);
  });
});