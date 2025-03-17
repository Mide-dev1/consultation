document.addEventListener('DOMContentLoaded', function() {
    const consultationForm = document.getElementById('consultationForm');
    
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const challenge = document.getElementById('challenge').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        // Here you would typically send this data to your backend
        console.log('Form submitted:', { challenge, name, email });
        
        // Redirect to payment platform (replace with your actual payment platform URL)
        // This is just an example - you should replace this with your actual payment integration
        const paymentAmount = 99.99; // Consultation fee in dollars
        const paymentUrl = `https://your-payment-platform.com/pay?amount=${paymentAmount}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
        
        // Redirect to payment platform
        window.location.href = paymentUrl;
    });
}); 

document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for testimonial cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up');
                // Once the animation is triggered, we don't need to observe this element anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the element is visible
    });

    // Get all testimonial cards and observe them
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        observer.observe(card);
    });

    // ... existing form handling code ...
});

document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for intro section
    const introObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const introTitle = entry.target.querySelector('h2');
                const introText = entry.target.querySelector('p');
                
                if (introTitle) introTitle.classList.add('slide-in-left');
                if (introText) introText.classList.add('slide-in-right');
                
                // Once the animation is triggered, we don't need to observe anymore
                introObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });

    // Observe the intro section
    const introSection = document.querySelector('.intro');
    if (introSection) {
        introObserver.observe(introSection);
    }
});