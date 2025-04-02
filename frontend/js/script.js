document.addEventListener('DOMContentLoaded', function() {
    // Form handling for consultation
    const form = document.getElementById('consultationForm');
    const challengeSelect = document.getElementById('challenge');
    const otherChallengeGroup = document.getElementById('otherChallengeGroup');
    const otherChallengeInput = document.getElementById('otherChallenge');
    const submitButton = form.querySelector('button[type="submit"]');

    // Show/hide other challenge text box based on selection
    challengeSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherChallengeGroup.style.display = 'block';
            otherChallengeInput.required = true;
        } else {
            otherChallengeGroup.style.display = 'none';
            otherChallengeInput.required = false;
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Processing...';

         // Get the selected challenge
        const selectedChallenge = document.getElementById('challenge').value;
        const challengeText = selectedChallenge === 'other' 
            ? document.getElementById('otherChallenge').value 
            : selectedChallenge;

        const formData = {
            email: document.getElementById('email').value,
            amount: 15000, // Amount in USD
            name: document.getElementById('name').value,
            challenge: challengeText, // Pass the actual challenge text
            metadata: {
                service: challengeText // Include in metadata for Paystack display
            }
        };
        

        try {
            const response = await fetch('https://consultation-phi.vercel.app/api/payment/initialize' {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

             console.log('Response status:', response.status); // Add this for debugging

            if (!response.ok) {
                // const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            console.log('Response data:', data); // Add this for debugging
            
            if (data.success) {
                // Store form data in localStorage for receipt generation
                localStorage.setItem('paymentData', JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    service: formData.challenge,
                    amount: formData.amount
                }));
                // Redirect to Paystack
                window.location.href = data.authorization_url;
            } else {
                throw new Error(data.message || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('Payment initialization failed. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = 'Proceed to Payment';
        }
    });

    // Intersection Observer for testimonial cards
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up');
                testimonialObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Get all testimonial cards and observe them
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        testimonialObserver.observe(card);
    });

    // Intersection Observer for intro section
    const introObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const introTitle = entry.target.querySelector('h2');
                const introText = entry.target.querySelector('p');
                
                if (introTitle) introTitle.classList.add('slide-in-left');
                if (introText) introText.classList.add('slide-in-right');
                
                introObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe the intro section
    const introSection = document.querySelector('.intro');
    if (introSection) {
        introObserver.observe(introSection);
    }
});
