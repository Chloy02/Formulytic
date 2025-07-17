document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('questionnaire-form');
    const sections = document.querySelectorAll('.form-section');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const successMessage = document.getElementById('success-message');

    let currentSection = 0; // 0-indexed

    function showSection(index) {
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
        updateNavigationButtons();
        updateProgressBar();
    }

    function updateNavigationButtons() {
        prevBtn.disabled = currentSection === 0;
        nextBtn.style.display = currentSection === sections.length - 1 ? 'none' : 'inline-block';
        submitBtn.style.display = currentSection === sections.length - 1 ? 'inline-block' : 'none';
    }

    function updateProgressBar() {
        const progressPercentage = ((currentSection + 1) / sections.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Section ${currentSection + 1} of ${sections.length}`;
    }

    // Event Listeners for Navigation
    nextBtn.addEventListener('click', function () {
        // Basic validation for the current section before moving to the next
        if (validateSection(currentSection)) {
            currentSection++;
            showSection(currentSection);
        } else {
            alert('Please fill out all required fields in this section.');
        }
    });

    prevBtn.addEventListener('click', function () {
        currentSection--;
        showSection(currentSection);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateSection(currentSection)) {
            // In a real application, collect all form data and send it to the server
            alert('Questionnaire submitted successfully!');
            form.reset(); // Reset form fields
            showSection(0); // Go back to the first section
            successMessage.classList.remove('hidden'); // Show success message
            setTimeout(() => {
                successMessage.classList.add('hidden'); // Hide after some time
            }, 5000);
            console.log('Form data would be sent here.');
        } else {
            alert('Please fill out all required fields in the final section.');
        }
    });

    saveDraftBtn.addEventListener('click', function () {
        // In a real application, collect current form data and save it (e.g., to localStorage or a backend)
        alert('Draft saved!');
        console.log('Draft data would be saved here.');
    });

    // --- Conditional Field Visibility Logic ---

    // Employment status before scheme -> Occupation before scheme
    const employmentBeforeRadios = document.querySelectorAll('input[name="employment_before"]');
    const occupationField = document.getElementById('occupation-field');
    employmentBeforeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'yes') {
                occupationField.style.display = 'block';
                occupationField.querySelector('input').setAttribute('required', 'true');
            } else {
                occupationField.style.display = 'none';
                occupationField.querySelector('input').removeAttribute('required');
                occupationField.querySelector('input').value = ''; // Clear value when hidden
            }
        });
    });

    // Received benefits -> Scheme types
    const receivedBenefitsRadios = document.querySelectorAll('input[name="received_benefits"]');
    const schemeTypesDiv = document.getElementById('scheme-types');
    receivedBenefitsRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'yes') {
                schemeTypesDiv.style.display = 'block';
            } else {
                schemeTypesDiv.style.display = 'none';
                schemeTypesDiv.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false; // Uncheck all when hidden
                });
            }
        });
    });

    // Other benefits checkbox -> Others specify text input
    const utilizationOthersCheckbox = document.querySelector('input[name="utilization[]"][value="others"]');
    const utilizationOthersInput = document.querySelector('input[name="utilization_others"]');
    if (utilizationOthersCheckbox && utilizationOthersInput) {
        utilizationOthersCheckbox.addEventListener('change', function () {
            if (this.checked) {
                utilizationOthersInput.style.display = 'block';
                utilizationOthersInput.setAttribute('required', 'true');
            } else {
                utilizationOthersInput.style.display = 'none';
                utilizationOthersInput.removeAttribute('required');
                utilizationOthersInput.value = '';
            }
        });
    }

    // Caste Category -> SC Sub-caste / ST Identity
    const casteCategoryRadios = document.querySelectorAll('input[name="caste_category"]');
    const scSubcasteDiv = document.getElementById('sc-subcaste');
    const stIdentityDiv = document.getElementById('st-identity');
    casteCategoryRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            scSubcasteDiv.style.display = 'none';
            stIdentityDiv.style.display = 'none';
            if (this.value === 'sc') {
                scSubcasteDiv.style.display = 'block';
                scSubcasteDiv.querySelector('input').setAttribute('required', 'true');
            } else {
                scSubcasteDiv.querySelector('input').removeAttribute('required');
                scSubcasteDiv.querySelector('input').value = '';
            }
            if (this.value === 'st') {
                stIdentityDiv.style.display = 'block';
            } else {
                stIdentityDiv.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
            }
        });
    });

    // Discrimination from in-laws -> Discrimination explain
    const inlawDiscriminationRadios = document.querySelectorAll('input[name="inlaw_discrimination"]');
    const discriminationExplainDiv = document.getElementById('discrimination-explain');
    inlawDiscriminationRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'yes') {
                discriminationExplainDiv.style.display = 'block';
                discriminationExplainDiv.querySelector('textarea').setAttribute('required', 'true');
            } else {
                discriminationExplainDiv.style.display = 'none';
                discriminationExplainDiv.querySelector('textarea').removeAttribute('required');
                discriminationExplainDiv.querySelector('textarea').value = '';
            }
        });
    });

    // Rejection Communicated -> Rejection Reasons
    const rejectionCommunicatedRadios = document.querySelectorAll('input[name="rejection_communicated"]');
    const rejectionReasonsDiv = document.getElementById('rejection-reasons');
    if (rejectionCommunicatedRadios.length > 0 && rejectionReasonsDiv) {
        rejectionCommunicatedRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.value === 'yes') {
                    rejectionReasonsDiv.style.display = 'block';
                    rejectionReasonsDiv.querySelector('textarea').setAttribute('required', 'true');
                } else {
                    rejectionReasonsDiv.style.display = 'none';
                    rejectionReasonsDiv.querySelector('textarea').removeAttribute('required');
                    rejectionReasonsDiv.querySelector('textarea').value = '';
                }
            });
        });
    }


    // Initial setup
    showSection(currentSection);

    // Basic form validation (simplified for demonstration)
    function validateSection(sectionIndex) {
        const currentFormSection = sections[sectionIndex];
        const requiredFields = currentFormSection.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            // For radio buttons, check if at least one in the group is selected
            if (field.type === 'radio') {
                const radioGroupName = field.name;
                const radiosInGroup = currentFormSection.querySelectorAll(`input[name="${radioGroupName}"]:checked`);
                if (radiosInGroup.length === 0) {
                    isValid = false;
                }
            } else if (field.value.trim() === '') {
                isValid = false;
            }
        });
        return isValid;
    }
});