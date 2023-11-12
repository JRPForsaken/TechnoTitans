document.addEventListener('DOMContentLoaded', function () {
    const teamNameTextarea = document.getElementById('teamName');
    const teamMembersTextarea = document.getElementById('teamMembers');
    const codMembersTextarea = document.getElementById('codMembers');
    const fileInput = document.getElementById('file');
    const submitBtn = document.getElementById('submitBtn');
    const loadingScreen = document.querySelector('.loading-screen');
    const gamesSelect = document.getElementById('games');
    const mlCodFields = document.querySelector('.ml-cod-fields');
    const tekkenFields = document.querySelector('.tekken-fields');
    const emailInput = document.getElementById('email');
    const errorMessagesContainer = document.getElementById('errorMessages');
    const fileDisplay = document.getElementById('fileDisplay');

    // Add input event listener to teamName textarea
    teamNameTextarea.addEventListener('input', function () {
        adjustTextareaHeight(teamNameTextarea);
        validateForm();
    });

    // Add input event listener to teamMembers textarea
    teamMembersTextarea.addEventListener('input', function () {
        adjustTextareaHeight(teamMembersTextarea);
        validateForm();
    });

    // Add input event listener to codMembers textarea
    codMembersTextarea.addEventListener('input', function () {
        adjustTextareaHeight(codMembersTextarea);
        validateForm();
    });

    // Add input event listener to email input
    emailInput.addEventListener('input', function () {
        validateEmail(emailInput);
        validateForm();
    });

    // Add change event listener to file input
    fileInput.addEventListener('change', function () {
        displaySelectedFiles(Array.from(fileInput.files));
        validateForm();
    });

    // Add change event listener to games select
    gamesSelect.addEventListener('change', function () {
        const selectedGame = gamesSelect.value;

        if (selectedGame === 'a' || selectedGame === 'b') {
            mlCodFields.style.display = 'block';
            tekkenFields.style.display = 'none';
        } else if (selectedGame === 'c') {
            mlCodFields.style.display = 'none';
            tekkenFields.style.display = 'block';
        } else {
            mlCodFields.style.display = 'none';
            tekkenFields.style.display = 'none';
        }

        validateForm();
    });

    // Add click event listener to submit button
    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();

        // Validate the form before submission
        if (validateForm()) {
            loadingScreen.style.display = 'flex';
            submitBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                window.location.href = 'submitted.html';
            }, 1500);
        }
    });

    let selectedFiles = [];

// Add input event listener to file input
    fileInput.addEventListener('change', function () {
        selectedFiles = Array.from(fileInput.files);
        displaySelectedFiles(selectedFiles);
        validateForm();
    });

// Add click event listener to remove file buttons
    fileDisplay.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-file')) {
            const fileItem = event.target.closest('.file-item');
            const fileName = fileItem.querySelector('.file-name').textContent;

            // Remove the file from the array based on the file name
            selectedFiles = selectedFiles.filter(file => file.name !== fileName);

            // Update the display
            displaySelectedFiles(selectedFiles);
            validateForm();
        }
    });

    function validateForm() {
        const requiredFields = document.querySelectorAll('input[required], textarea[required], select[required], [required] input[type="file"]');
        let isValid = true;
        let genericErrorMessage = 'Please fill up the required fields.<br>';

        // Check if game is not selected
        if (gamesSelect.value === 'none') {
            isValid = false;
            errorMessagesContainer.innerHTML = 'Please pick a game.<br>';
            return false;
        }

        const activeFields = gamesSelect.value === 'c' ? tekkenFields : mlCodFields;

        for (const field of requiredFields) {
            if (activeFields.contains(field)) {
                const errorMessage = getErrorMessage(field);

                if (!field.value || (field.type === 'file' && field.files.length === 0) || (field.type === 'email' && field.checkValidity() === false)) {
                    isValid = false;
                    errorMessagesContainer.innerHTML = errorMessage + '<br>';
                    return false; // Stop processing further fields if one is not valid
                }
            }
        }

        // Check if at least one file is uploaded
        if (fileInput.files.length === 0) {
            isValid = false;
            errorMessagesContainer.innerHTML = 'Please upload your Registration Application Form (RAF).<br>';
        }

        // Display a generic error message if any required field is empty
        if (!isValid) {
            errorMessagesContainer.innerHTML += genericErrorMessage;
        } else {
            errorMessagesContainer.innerHTML = ''; // Clear the error message if all fields are valid
        }

        submitBtn.disabled = !isValid;

        return isValid;
    }

    function getErrorMessage(field) {
        if (field.type === 'file') {
            return 'Please upload your Registration Application Form (RAF).';
        } else if (field.type === 'email') {
            return 'Please enter a valid email address.';
        } else {
            return 'Please fill up the required field.';
        }
    }

    function validateEmail(emailInput) {
        const email = emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailInput.setCustomValidity('Invalid email address');
        } else {
            emailInput.setCustomValidity('');
        }
    }

    function adjustTextareaHeight(textarea) {
        const rows = textarea.value.split('\n').length;
        textarea.rows = rows;
    }

    function displaySelectedFiles(files) {
        // Clear existing display
        fileDisplay.innerHTML = '';

        // Display each selected file
        for (const file of files) {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            const fileName = document.createElement('div');
            fileName.classList.add('file-name');
            fileName.textContent = file.name;

            const removeButton = document.createElement('div');
            removeButton.classList.add('remove-file');
            removeButton.textContent = 'x';

            fileItem.appendChild(fileName);
            fileItem.appendChild(removeButton);
            fileDisplay.appendChild(fileItem);
        }
    }

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
    }, 1500);

    loadingScreen.addEventListener('transitionend', function () {
        loadingScreen.style.display = 'none';
    });
});