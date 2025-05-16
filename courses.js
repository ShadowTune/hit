document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("category-select");
    const levelSelect = document.getElementById("level-select");
    const durationFilter = document.getElementById("duration-filter");
    const sortSelect = document.getElementById("sort-select");
    const clearFiltersBtn = document.getElementById("clear-filters");
    const courseCards = document.querySelectorAll(".course-card");
    const activeFilters = document.querySelector(".active-filters");

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
            // Assuming popularity is based on student count (descending)
            visibleCards.sort((a, b) => {
                const aStudents = parseInt(a.querySelector("p:nth-child(3)").textContent.match(/\d+/)[0]);
                const bStudents = parseInt(b.querySelector("p:nth-child(3)").textContent.match(/\d+/)[0]);
                return bStudents - aStudents;
            });
        } else if (selectedSort === "newest") {
            // Assuming newer courses have higher duration (as a proxy)
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

    // Initial application of filters
    applyFilters();
});