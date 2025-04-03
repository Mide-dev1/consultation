document.addEventListener('DOMContentLoaded', function() {
    // Form handling for consultation
    const form = document.getElementById('consultationForm');
    const challengeSelect = document.getElementById('challenge');
    const otherChallengeGroup = document.getElementById('otherChallengeGroup');
    const otherChallengeInput = document.getElementById('otherChallenge');
    const submitButton = document.getElementById('submitButton');

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

        try {
            // Get form values
            const email = document.getElementById('email').value.trim();
            const name = document.getElementById('name').value.trim();
            const selectedChallenge = challengeSelect.value.trim();
            const challengeText = selectedChallenge === 'other' && otherChallengeInput 
                ? otherChallengeInput.value.trim() 
                : selectedChallenge;

            // Validate form data
            if (!email || !name || !challengeText) {
                throw new Error('Please fill in all required fields');
            }

             // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address');
        }

            const formData = {
                email: email,
                amount: 15000, // Amount in Naira
                name: name,
                challenge: challengeText
            };

            console.log('Sending payment data:', formData); // Debug log

            const response = await fetch('https://consultation-phi.vercel.app/api/payment/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status); // Debug log

            const responseData = await response.json();
            console.log('Response data:', responseData); // Debug log

            if (!response.ok) {
                   // Check for validation errors
            if (responseData.details) {
                const errorMessages = Object.values(responseData.details)
                    .filter(msg => msg !== null)
                    .join('\n');
                throw new Error(errorMessages || responseData.message);
            }
                throw new Error(responseData.message || 'Payment initialization failed');
            }

            if (responseData.success && responseData.authorization_url) {
                // Store form data in localStorage for receipt generation
                localStorage.setItem('paymentData', JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    service: formData.challenge,
                    amount: formData.amount
                }));
                // Redirect to Paystack
                window.location.href = responseData.authorization_url;
            } else {
                throw new Error(responseData.message || 'Invalid payment response');
            }
        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert(error.message || 'Payment initialization failed. Please try again.');
        } finally {
            // Reset button state
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
