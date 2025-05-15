document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
  
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', function () {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
  
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-times');
        }
      });
    }
  
    // Learn More Feedback Function
    window.learnMore = function (courseName) {
      const feedback = document.getElementById('feedback-message');
      if (feedback) {
        feedback.textContent = `You clicked "Learn More" for ${courseName}. More details coming soon!`;
        feedback.style.opacity = 1;
        feedback.style.position = 'absolute';
        feedback.style.top = '1rem';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = '#28a745';
        feedback.style.color = '#fff';
        feedback.style.padding = '1rem 2rem';
        feedback.style.borderRadius = '6px';
        feedback.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
        feedback.style.zIndex = 9999;
  
        setTimeout(() => {
          feedback.style.opacity = 0;
        }, 3000);
      } else {
        alert(`You clicked "Learn More" for ${courseName}`);
      }
    };
  
    // Keyboard accessibility (tab navigation)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const button = this.querySelector('.learn-more');
          if (button) {
            button.click();
          }
        }
      });
    });
  });