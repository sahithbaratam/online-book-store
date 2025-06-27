document.addEventListener('DOMContentLoaded', function() {
    const paymentOptions = document.querySelectorAll('.option');
    const paymentDetails = document.querySelectorAll('.payment-details');
    const paymentDetailsBtn = document.getElementById('payment-details-btn');
    const confirmationBtn = document.getElementById('confirmation-btn');
    const paymentFormContainer = document.querySelector('.payment-form-container');
    const confirmation = document.getElementById('confirmation');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentDetails.forEach(detail => detail.classList.add('hidden'));
            const selectedOption = option.getAttribute('data-option');
            document.getElementById(`${selectedOption}-details`).classList.remove('hidden');
        });
    });

    paymentDetailsBtn.addEventListener('click', function() {
        paymentFormContainer.style.display = 'flex';
        confirmation.classList.add('hidden');
        paymentDetailsBtn.classList.add('active');
        confirmationBtn.classList.remove('active');
    });

    confirmationBtn.addEventListener('click', function() {
        paymentFormContainer.style.display = 'none';
        confirmation.classList.remove('hidden');
        paymentDetailsBtn.classList.remove('active');
        confirmationBtn.classList.add('active');
    });
});
