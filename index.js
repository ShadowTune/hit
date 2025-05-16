document.addEventListener('DOMContentLoaded', () => {
  const durationFilter = document.getElementById('duration-filter');
  const searchInput = document.querySelector('input[type="search"]');
  const courseCards = document.querySelectorAll('.card');

  // index.js

  // DOM elements
  const searchForm = document.getElementById("search-form");
  const cards = document.querySelectorAll(".card");

  // Prevent form submit reload, do filtering on input
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterCourses();
  });

  // Filter on search input change (debounce for better UX could be added)
  searchInput.addEventListener("input", filterCourses);

  // Filter on duration change
  durationFilter.addEventListener("change", filterCourses);

  function filterCourses() {
    const query = searchInput.value.trim().toLowerCase();
    const duration = durationFilter.value;

    cards.forEach((card) => {
      const courseName = card.getAttribute("data-course").toLowerCase();
      const courseDuration = card.getAttribute("data-duration");

      const matchesSearch = courseName.includes(query);
      const matchesDuration = duration === "all" || courseDuration === duration;

      if (matchesSearch && matchesDuration) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }

  // Dummy placeholders for your other functions, define as needed
  function learnMore(courseName) {
    alert(`Learn more about "${courseName}" - feature coming soon!`);
  }

  function submitProject(event, courseName) {
    event.preventDefault();
    alert(`Project submitted for "${courseName}" - feature coming soon!`);
  }

  function viewPeerReviews(courseName) {
    alert(`Viewing peer reviews for "${courseName}" - feature coming soon!`);
  }

  // Run filtering on page load
  filterCourses();

  // Load continue learning from localStorage
  const lastCourse = localStorage.getItem('lastCourse');
  if (lastCourse) {
    const continueDiv = document.getElementById('continue-learning');
    const continueLink = document.getElementById('continue-link');
    continueLink.href = `#${lastCourse.replace(/\s+/g, '-').toLowerCase()}`;
    continueLink.textContent = lastCourse;
    continueDiv.style.display = 'block';

    const card = [...courseCards].find(c => c.dataset.course === lastCourse);
    if (card) {
      card.querySelector('.last-viewed').style.display = 'inline-block';
    }
  }
});

function learnMore(courseName) {
  localStorage.setItem('lastCourse', courseName);
  alert(`You clicked Learn More for ${courseName}. This can be redirected to a course detail page.`);
}

function submitProject(event, courseName) {
  event.preventDefault();
  const form = event.target;
  const textarea = form.querySelector('textarea');
  const submissionText = textarea.value.trim();

  if (submissionText === '') return;

  const submissionsKey = `submissions-${courseName}`;
  const submissions = JSON.parse(localStorage.getItem(submissionsKey)) || [];
  submissions.push(submissionText);
  localStorage.setItem(submissionsKey, JSON.stringify(submissions));

  displaySubmissions(courseName);
  textarea.value = '';

  const feedback = document.getElementById('feedback-message');
  feedback.textContent = `Project submitted for ${courseName}!`;
  setTimeout(() => (feedback.textContent = ''), 3000);
}

function displaySubmissions(courseName) {
  const submissionsKey = `submissions-${courseName}`;
  const submissions = JSON.parse(localStorage.getItem(submissionsKey)) || [];

  const listId = `submissions-${courseName.toLowerCase().replace(/\s+/g, '-')}`;
  const listDiv = document.getElementById(listId);
  listDiv.innerHTML = '';

  submissions.forEach((text, index) => {
    const div = document.createElement('div');
    div.className = 'submission-item';
    div.innerHTML = `<strong>Submission ${index + 1}:</strong><pre>${text}</pre>`;
    listDiv.appendChild(div);
  });
}

function viewPeerReviews(courseName) {
  const reviewsKey = `submissions-${courseName}`;
  const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];

  const listId = `peer-reviews-${courseName.toLowerCase().replace(/\s+/g, '-')}`;
  const listDiv = document.getElementById(listId);
  listDiv.innerHTML = '';

  if (reviews.length === 0) {
    listDiv.innerHTML = '<p>No peer submissions yet.</p>';
    return;
  }

  reviews.forEach((text, index) => {
    const div = document.createElement('div');
    div.className = 'peer-review-item';
    div.innerHTML = `<strong>Peer Submission ${index + 1}:</strong><pre>${text}</pre>`;
    listDiv.appendChild(div);
  });
}
