document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("category-select");
    const levelSelect = document.getElementById("level-select");
    const durationFilter = document.getElementById("duration-filter");
    const sortSelect = document.getElementById("sort-select");
    const clearFiltersBtn = document.getElementById("clear-filters");
    const courseCards = document.querySelectorAll(".course-card");
    const activeFilters = document.querySelector(".active-filters");

    // List of freeCodeCamp course URLs for random selection
    const courseYouTubeLinks = {
        "Responsive Web Design": "https://www.youtube.com/watch?v=zJSY8tbf_ys&t=2sE",
        "JavaScript Algorithms": "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        "Data Analysis with Python": "https://www.youtube.com/watch?v=EsDFiZPljYo&list=PLWKjhJtqVAblvI1i46ScbKV2jH1gdL7VQ8",
        "Scientific Computing with Python": "https://www.youtube.com/watch?v=rfscVS0vtbwM",
        "Front-End Libraries": "https://www.youtube.com/watch?v=zJSY8tbf_ys&t=2s",
        "Back-End Development": "https://www.youtube.com/watch?v=tN6oJu2DqCM&list=PLWKjhJtqVAbn21gs5UnLhCQ82f923WCgM",
        "Quality Assurance": "https://www.youtube.com/watch?v=VwK5kkP4aNM",
        "Information Security": "https://www.youtube.com/watch?v=v7BNtpw53AA"
    };

    // Function to get a random freeCodeCamp link
    function getRandomFreeCodeCampLink() {
        const keys = Object.keys(courseYouTubeLinks);
        const randomIndex = Math.floor(Math.random() * keys.length);
        return courseYouTubeLinks[keys[randomIndex]];
    }

    // Apply filters based on category, level, duration, and sort
    function applyFilters() {
        const selectedCategory = categorySelect.value.toLowerCase();
        const selectedLevel = levelSelect.value.toLowerCase();
        const selectedDuration = durationFilter.value.toLowerCase();
        const selectedSort = sortSelect.value.toLowerCase();

        // Convert NodeList to Array for sorting
        let visibleCards = Array.from(courseCards);

        // Filter courses
        visibleCards.forEach((card) => {
            const category = card.dataset.category.toLowerCase();
            const level = card.dataset.level.toLowerCase();
            const duration = card.dataset.duration.toLowerCase();

            const matchesCategory = selectedCategory === "all" || category === selectedCategory;
            const matchesLevel = selectedLevel === "all" || level === selectedLevel;
            const matchesDuration = selectedDuration === "all" || duration === selectedDuration;

            card.style.display = matchesCategory && matchesLevel && matchesDuration ? "block" : "none";
        });

        // Sort filtered courses
        visibleCards = visibleCards.filter(card => card.style.display !== "none");
        if (selectedSort === "popularity") {
            visibleCards.sort((a, b) => {
                const aStudents = parseInt(a.querySelector("p:nth-child(3)").textContent.match(/\d+/)[0]);
                const bStudents = parseInt(b.querySelector("p:nth-child(3)").textContent.match(/\d+/)[0]);
                return bStudents - aStudents;
            });
        } else if (selectedSort === "newest") {
            visibleCards.sort((a, b) => b.dataset.duration - a.dataset.duration);
        } else if (selectedSort === "a-z") {
            visibleCards.sort((a, b) => 
                a.querySelector("h2").textContent.localeCompare(b.querySelector("h2").textContent)
            );
        } else if (selectedSort === "z-a") {
            visibleCards.sort((a, b) => 
                b.querySelector("h2").textContent.localeCompare(a.querySelector("h2").textContent)
            );
        }

        // Reorder visible cards in the DOM
        visibleCards.forEach((card, index) => {
            card.style.order = index;
        });

        // Update active filters display
        updateActiveFilters();
    }

    // Update the active filters display
    function updateActiveFilters() {
        const filters = [];
        if (categorySelect.value !== "all") filters.push(`Category: ${categorySelect.value}`);
        if (levelSelect.value !== "all") filters.push(`Level: ${levelSelect.value}`);
        if (durationFilter.value !== "all") filters.push(`Duration: ${durationFilter.value} weeks`);
        activeFilters.textContent = filters.length ? filters.join(", ") : "No active filters.";
    }

    // Handle enroll button click
    function handleEnroll(event) {
        const enrollBtn = event.target.closest(".enroll-btn");
        if (!enrollBtn) return;

        // Change button text to "Enrolled"
        enrollBtn.textContent = "Enrolled";
        enrollBtn.disabled = true;
        enrollBtn.classList.remove("learn-more");
        enrollBtn.removeAttribute("onclick");

        // Create a new "Learn More" button
        const learnMoreBtn = document.createElement("a");
        learnMoreBtn.className = "enroll-btn learn-more visible"; // Added 'visible' class
        learnMoreBtn.href = getRandomFreeCodeCampLink();
        learnMoreBtn.target = "_blank";
        learnMoreBtn.textContent = "Course Contents";
        const icon = document.createElement("i");
        icon.className = "fas fa-arrow-right";
        icon.setAttribute("aria-hidden", "true");
        learnMoreBtn.appendChild(icon);

        // Append the new button to the footer
        const footer = enrollBtn.closest("footer");
        footer.appendChild(learnMoreBtn);

        // Ensure the button is visible by forcing a style update
        learnMoreBtn.style.display = "inline-block";
        learnMoreBtn.style.visibility = "visible";
        learnMoreBtn.style.opacity = "1";
    }

    // Event listeners for filter changes
    categorySelect.addEventListener("change", applyFilters);
    levelSelect.addEventListener("change", applyFilters);
    durationFilter.addEventListener("change", applyFilters);
    sortSelect.addEventListener("change", applyFilters);

    // Clear filters logic
    clearFiltersBtn.addEventListener("click", () => {
        categorySelect.value = "all";
        levelSelect.value = "all";
        durationFilter.value = "all";
        sortSelect.value = "popularity";
        applyFilters();
    });

    // Add event listener for enroll button clicks
    document.querySelectorAll(".enroll-btn").forEach(btn => {
        btn.addEventListener("click", handleEnroll);
    });

    // Initial application of filters
    applyFilters();
});