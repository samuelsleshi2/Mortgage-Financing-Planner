// DOM Elements
const principalInput = document.getElementById('principal');
const interestInput = document.getElementById('interest');
const yearsInput = document.getElementById('years');
const calculateBtn = document.getElementById('calculate-btn');
const resultsSection = document.getElementById('results-section');
const monthlyPaymentEl = document.getElementById('monthly-payment');
const totalInterestEl = document.getElementById('total-interest');
const totalAmountEl = document.getElementById('total-amount');
const numPaymentsEl = document.getElementById('num-payments');

// Input validation ranges (matching your Java code)
const VALIDATION_RULES = {
    principal: { min: 1000, max: 1000000 },
    interest: { min: 0.1, max: 30 },
    years: { min: 1, max: 30 }
};

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Validate input value
function validateInput(value, field) {
    const rules = VALIDATION_RULES[field];
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        return { isValid: false, message: 'Please enter a valid number' };
    }
    
    if (numValue < rules.min || numValue > rules.max) {
        return { 
            isValid: false, 
            message: `Please enter a value between ${rules.min} and ${rules.max}` 
        };
    }
    
    return { isValid: true, value: numValue };
}

// Update input validation styling
function updateInputValidation(input, isValid) {
    const wrapper = input.closest('.input-wrapper');
    wrapper.classList.remove('error', 'success');
    
    if (input.value.trim() === '') {
        return;
    }
    
    if (isValid) {
        wrapper.classList.add('success');
    } else {
        wrapper.classList.add('error');
    }
}

// Calculate mortgage payment using the same formula as your Java code
function calculateMortgage(principal, annualInterest, years) {
    const monthlyInterest = annualInterest / 100 / 12;
    const numberOfPayments = years * 12;
    
    // Same formula as your Java code
    const mortgage = principal * 
        (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments) /
         (Math.pow(1 + monthlyInterest, numberOfPayments) - 1));
    
    return {
        monthlyPayment: mortgage,
        totalPayments: numberOfPayments,
        totalAmount: mortgage * numberOfPayments,
        totalInterest: (mortgage * numberOfPayments) - principal
    };
}

// Show results with animation
function showResults(results) {
    monthlyPaymentEl.textContent = formatCurrency(results.monthlyPayment);
    totalInterestEl.textContent = formatCurrency(results.totalInterest);
    totalAmountEl.textContent = formatCurrency(results.totalAmount);
    numPaymentsEl.textContent = results.totalPayments.toLocaleString();
    
    resultsSection.classList.add('show');
}

// Hide results
function hideResults() {
    resultsSection.classList.remove('show');
}

// Handle calculate button click
function handleCalculate() {
    // Get input values
    const principalValue = principalInput.value.trim();
    const interestValue = interestInput.value.trim();
    const yearsValue = yearsInput.value.trim();
    
    // Validate all inputs
    const principalValidation = validateInput(principalValue, 'principal');
    const interestValidation = validateInput(interestValue, 'interest');
    const yearsValidation = validateInput(yearsValue, 'years');
    
    // Update validation styling
    updateInputValidation(principalInput, principalValidation.isValid);
    updateInputValidation(interestInput, interestValidation.isValid);
    updateInputValidation(yearsInput, yearsValidation.isValid);
    
    // Check if all inputs are valid
    if (!principalValidation.isValid || !interestValidation.isValid || !yearsValidation.isValid) {
        hideResults();
        return;
    }
    
    // Show loading state
    calculateBtn.classList.add('loading');
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
        // Calculate mortgage
        const results = calculateMortgage(
            principalValidation.value,
            interestValidation.value,
            yearsValidation.value
        );
        
        // Show results
        showResults(results);
        
        // Remove loading state
        calculateBtn.classList.remove('loading');
    }, 500);
}

// Real-time validation on input
function handleInputValidation(input, field) {
    const value = input.value.trim();
    
    if (value === '') {
        input.closest('.input-wrapper').classList.remove('error', 'success');
        return;
    }
    
    const validation = validateInput(value, field);
    updateInputValidation(input, validation.isValid);
}

// Event listeners
calculateBtn.addEventListener('click', handleCalculate);

// Real-time validation
principalInput.addEventListener('input', () => handleInputValidation(principalInput, 'principal'));
interestInput.addEventListener('input', () => handleInputValidation(interestInput, 'interest'));
yearsInput.addEventListener('input', () => handleInputValidation(yearsInput, 'years'));

// Enter key support
[principalInput, interestInput, yearsInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    });
});

// Auto-calculate when all fields are filled
function checkAutoCalculate() {
    const allInputs = [principalInput, interestInput, yearsInput];
    const allFilled = allInputs.every(input => {
        const value = input.value.trim();
        if (value === '') return false;
        const field = input.id;
        return validateInput(value, field).isValid;
    });
    
    if (allFilled) {
        handleCalculate();
    }
}

// Auto-calculate on input change
[principalInput, interestInput, yearsInput].forEach(input => {
    input.addEventListener('blur', checkAutoCalculate);
});

// Initialize with some default values for demo
window.addEventListener('load', () => {
    // Set some reasonable default values
    principalInput.value = '300000';
    interestInput.value = '5.5';
    yearsInput.value = '30';
    
    // Trigger validation styling
    handleInputValidation(principalInput, 'principal');
    handleInputValidation(interestInput, 'interest');
    handleInputValidation(yearsInput, 'years');
    
    // Auto-calculate with defaults
    setTimeout(checkAutoCalculate, 100);
});

// Add some helpful tooltips and accessibility
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels for accessibility
    principalInput.setAttribute('aria-label', 'Principal amount in dollars');
    interestInput.setAttribute('aria-label', 'Annual interest rate in percentage');
    yearsInput.setAttribute('aria-label', 'Loan term in years');
    
    // Add helpful hints
    const inputs = [principalInput, interestInput, yearsInput];
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.input-group').querySelector('small').style.opacity = '1';
        });
        
        input.addEventListener('blur', () => {
            input.closest('.input-group').querySelector('small').style.opacity = '0.7';
        });
    });
}); 