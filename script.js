const principalInput = document.getElementById('principal');
const interestInput = document.getElementById('interest');
const yearsInput = document.getElementById('years');
const calculateBtn = document.getElementById('calculate-btn');
const resultsSection = document.getElementById('results-section');
const monthlyPaymentEl = document.getElementById('monthly-payment');
const totalInterestEl = document.getElementById('total-interest');
const totalAmountEl = document.getElementById('total-amount');
const numPaymentsEl = document.getElementById('num-payments');

const VALIDATION_RULES = {
    principal: { min: 1000, max: 1000000 },
    interest: { min: 0.1, max: 30 },
    years: { min: 1, max: 30 }
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

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

function calculateMortgage(principal, annualInterest, years) {
    const monthlyInterest = annualInterest / 100 / 12;
    const numberOfPayments = years * 12;
    
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

function showResults(results) {
    monthlyPaymentEl.textContent = formatCurrency(results.monthlyPayment);
    totalInterestEl.textContent = formatCurrency(results.totalInterest);
    totalAmountEl.textContent = formatCurrency(results.totalAmount);
    numPaymentsEl.textContent = results.totalPayments.toLocaleString();
    
    resultsSection.classList.add('show');
}


function hideResults() {
    resultsSection.classList.remove('show');
}

function handleCalculate() {
    const principalValue = principalInput.value.trim();
    const interestValue = interestInput.value.trim();
    const yearsValue = yearsInput.value.trim();
    
    const principalValidation = validateInput(principalValue, 'principal');
    const interestValidation = validateInput(interestValue, 'interest');
    const yearsValidation = validateInput(yearsValue, 'years');
    
    updateInputValidation(principalInput, principalValidation.isValid);
    updateInputValidation(interestInput, interestValidation.isValid);
    updateInputValidation(yearsInput, yearsValidation.isValid);
    
    if (!principalValidation.isValid || !interestValidation.isValid || !yearsValidation.isValid) {
        hideResults();
        return;
    }
    
    calculateBtn.classList.add('loading');
    
    setTimeout(() => {
        const results = calculateMortgage(
            principalValidation.value,
            interestValidation.value,
            yearsValidation.value
        );
        
        showResults(results);
        
        calculateBtn.classList.remove('loading');
    }, 500);
}

function handleInputValidation(input, field) {
    const value = input.value.trim();
    
    if (value === '') {
        input.closest('.input-wrapper').classList.remove('error', 'success');
        return;
    }
    
    const validation = validateInput(value, field);
    updateInputValidation(input, validation.isValid);
}

calculateBtn.addEventListener('click', handleCalculate);

principalInput.addEventListener('input', () => handleInputValidation(principalInput, 'principal'));
interestInput.addEventListener('input', () => handleInputValidation(interestInput, 'interest'));
yearsInput.addEventListener('input', () => handleInputValidation(yearsInput, 'years'));

[principalInput, interestInput, yearsInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    });
});

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

[principalInput, interestInput, yearsInput].forEach(input => {
    input.addEventListener('blur', checkAutoCalculate);
});

window.addEventListener('load', () => {
    principalInput.value = '300000';
    interestInput.value = '5.5';
    yearsInput.value = '30';
    
    handleInputValidation(principalInput, 'principal');
    handleInputValidation(interestInput, 'interest');
    handleInputValidation(yearsInput, 'years');
    
    setTimeout(checkAutoCalculate, 100);
});

document.addEventListener('DOMContentLoaded', () => {
    principalInput.setAttribute('aria-label', 'Principal amount in dollars');
    interestInput.setAttribute('aria-label', 'Annual interest rate in percentage');
    yearsInput.setAttribute('aria-label', 'Loan term in years');
    
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