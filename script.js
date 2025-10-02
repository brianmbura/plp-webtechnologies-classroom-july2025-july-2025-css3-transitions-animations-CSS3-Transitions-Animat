/* ============================================
   PART 2: JAVASCRIPT FUNCTIONS
   Demonstrating Scope, Parameters & Returns
   ============================================ */

// GLOBAL SCOPE VARIABLES
// These variables are accessible throughout the entire script
let carInventory = [];
let reservations = [];
let customerDatabase = [];
let totalSystemRevenue = 0;

/**
 * FUNCTION WITH PARAMETERS AND RETURN VALUE
 * Calculates rental cost based on daily rate, days, and discount
 * @param {number} dailyRate - Cost per day
 * @param {number} days - Number of rental days
 * @param {number} discountPercent - Discount percentage
 * @returns {object} Object containing subtotal, discount, and final total
 */
function calculateRentalPrice(dailyRate, days, discountPercent) {
    // LOCAL SCOPE: These variables only exist within this function
    const subtotal = dailyRate * days;
    const discountAmount = subtotal * (discountPercent / 100);
    const finalTotal = subtotal - discountAmount;
    
    // Return an object with calculations
    return {
        subtotal: subtotal,
        discount: discountAmount,
        total: finalTotal
    };
}

/**
 * FUNCTION DEMONSTRATING SCOPE
 * Generates a unique reservation code
 * @returns {string} Unique reservation code
 */
function generateReservationCode() {
    // LOCAL SCOPE: prefix only exists here
    const prefix = "RES";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    // Accessing GLOBAL variable to ensure uniqueness
    const code = `${prefix}-${timestamp}-${random}`;
    return code;
}

/**
 * FUNCTION WITH PARAMETER
 * Calculates number of days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of days
 */
function calculateDaysBetween(startDate, endDate) {
    // LOCAL SCOPE calculation
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    return diffDays;
}

/**
 * FUNCTION WITH RETURN VALUE
 * Formats currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return `KES ${amount.toLocaleString('en-KE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

/**
 * FUNCTION ACCESSING GLOBAL SCOPE
 * Updates global statistics and UI
 */
function updateDashboardStats() {
    // Accessing and modifying GLOBAL variables
    const total = carInventory.length;
    const available = carInventory.filter(car => car.status === 'available').length;
    const rented = carInventory.filter(car => car.status === 'rented').length;
    
    // Update DOM elements
    document.getElementById('totalCars').textContent = total;
    document.getElementById('availableCars').textContent = available;
    document.getElementById('rentedCars').textContent = rented;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalSystemRevenue);
}

/**
 * FUNCTION DEMONSTRATING PARAMETER USAGE
 * Creates a car object and adds to inventory
 * @param {string} make - Car manufacturer
 * @param {string} model - Car model
 * @param {number} year - Manufacturing year
 * @param {string} category - Category type
 * @param {number} dailyRate - Daily rental rate
 * @returns {object} Created car object
 */
function addCarToInventory(make, model, year, category, dailyRate) {
    // LOCAL SCOPE: car object exists only in this function
    const car = {
        id: carInventory.length + 1,
        registration: `KAA-${Math.floor(Math.random() * 1000)}X`,
        make: make,
        model: model,
        year: year,
        category: category,
        dailyRate: dailyRate,
        status: 'available',
        mileage: Math.floor(Math.random() * 50000)
    };
    
    // Modify GLOBAL variable
    carInventory.push(car);
    return car;
}

/**
 * UI Function: Calculate rental cost from form inputs
 * Demonstrates calling functions with parameters and using return values
 */
function calculateRentalCost() {
    // Get values from form
    const rate = parseFloat(document.getElementById('dailyRate').value) || 0;
    const days = parseInt(document.getElementById('rentalDays').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    
    // Call function with PARAMETERS and receive RETURN VALUE
    const result = calculateRentalPrice(rate, days, discount);
    
    // Display results
    const resultDiv = document.getElementById('calculationResult');
    resultDiv.innerHTML = `
        <div style="padding: 20px; background: #f0f9ff; border-radius: 10px; border-left: 4px solid var(--primary-color);">
            <p style="margin: 5px 0;">Subtotal: ${formatCurrency(result.subtotal)}</p>
            <p style="margin: 5px 0;">Discount (${discount}%): -${formatCurrency(result.discount)}</p>
            <p style="margin: 10px 0 0 0; font-size: 1.3em; color: var(--success-color);"><strong>Total: ${formatCurrency(result.total)}</strong></p>
        </div>
    `;
    
    // Add animation to result
    resultDiv.style.transform = 'scale(1.05)';
    setTimeout(() => {
        resultDiv.style.transform = 'scale(1)';
    }, 300);
}

/* ============================================
   PART 3: COMBINING CSS & JAVASCRIPT
   JS Functions that Trigger CSS Animations
   ============================================ */

/**
 * Open reservation modal with CSS animation
 * JavaScript adds 'show' class to trigger CSS animations
 */
function openNewReservationModal() {
    const modal = document.getElementById('reservationModal');
    // Add CSS class to trigger animations (fadeIn + modalSlideUp)
    modal.classList.add('show');
    
    // Populate vehicle dropdown
    populateVehicleDropdown();
}

/**
 * Close modal by removing CSS class
 */
function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    modal.classList.remove('show');
}

/**
 * Populate vehicle dropdown with available cars
 * Demonstrates DOM manipulation
 */
function populateVehicleDropdown() {
    const select = document.getElementById('vehicleSelect');
    select.innerHTML = '<option value="">Choose a vehicle...</option>';
    
    // Filter available cars using GLOBAL variable
    const availableCars = carInventory.filter(car => car.status === 'available');
    
    availableCars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.make} ${car.model} (${car.year}) - ${formatCurrency(car.dailyRate)}/day`;
        select.appendChild(option);
    });
}

/**
 * Refresh fleet display with CSS animations
 * JavaScript dynamically creates elements with CSS classes
 */
function refreshFleet() {
    const carGrid = document.getElementById('carGrid');
    
    // Show loading spinner (CSS animation)
    showLoadingSpinner();
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        carGrid.innerHTML = '';
        
        // Create car cards with CSS transitions
        carInventory.forEach(car => {
            const card = createCarCard(car);
            carGrid.appendChild(card);
        });
        
        hideLoadingSpinner();
        showAlert('Fleet refreshed successfully!', 'success');
    }, 1000);
}

/**
 * Create a car card element with CSS classes
 * @param {object} car - Car object
 * @returns {HTMLElement} Card element
 */
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card'; // CSS class with transition effects
    
    // Determine status class for CSS styling
    let statusClass = 'status-available';
    if (car.status === 'rented') statusClass = 'status-rented';
    if (car.status === 'maintenance') statusClass = 'status-maintenance';
    
    card.innerHTML = `
        <div class="car-image">🚗</div>
        <div class="car-details">
            <div class="car-name">${car.make} ${car.model}</div>
            <div class="car-info">📅 Year: ${car.year}</div>
            <div class="car-info">🔢 Reg: ${car.registration}</div>
            <div class="car-info">📊 Mileage: ${car.mileage.toLocaleString()} km</div>
            <div class="car-info">💰 ${formatCurrency(car.dailyRate)}/day</div>
            <span class="car-status ${statusClass}">${car.status.toUpperCase()}</span>
        </div>
    `;
    
    // Add click event to trigger animation
    card.addEventListener('click', () => animateCarCard(card));
    
    return card;
}

/**
 * Animate car card on click
 * Demonstrates adding/removing CSS classes for animation
 * @param {HTMLElement} card - Card element to animate
 */
function animateCarCard(card) {
    // Add temporary CSS transform
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Animate stat card with CSS transform
 * @param {HTMLElement} element - Element to animate
 */
function animateCard(element) {
    // CSS transition handles smooth animation
    element.style.transform = 'rotate(5deg) scale(1.1)';
    
    setTimeout(() => {
        element.style.transform = 'rotate(0deg) scale(1)';
    }, 300);
}

/**
 * Toggle loading spinner visibility
 * JavaScript adds/removes CSS class that triggers animation
 */
function toggleLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.toggle('active'); // CSS class with spin animation
}

/**
 * Show loading spinner
 */
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.add('active');
}

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.remove('active');
}

/**
 * Show alert message with CSS animation
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success/error)
 */
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`; // CSS animation triggers
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}

/**
 * Demonstrate CSS animation on button click
 */
function demonstrateCSSAnimation() {
    const statsCards = document.querySelectorAll('.stat-card');
    
    // Animate each card with delay
    statsCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(-20px) rotate(5deg)';
            setTimeout(() => {
                card.style.transform = 'translateY(0) rotate(0deg)';
            }, 400);
        }, index * 100);
    });
    
    showAlert('CSS animations demonstrated on stat cards!', 'success');
}

/**
 * Load reservations table
 * Demonstrates DOM manipulation and data display
 */
function loadReservationsTable() {
    const tbody = document.getElementById('reservationsTable');
    tbody.innerHTML = '';
    
    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-light);">No reservations yet</td></tr>';
        return;
    }
    
    reservations.forEach(reservation => {
        const row = document.createElement('tr');
        
        // Determine status badge
        let statusBadge = `<span class="badge badge-new">${reservation.status}</span>`;
        
        row.innerHTML = `
            <td><strong>${reservation.code}</strong></td>
            <td>${reservation.customerName}</td>
            <td>${reservation.vehicle}</td>
            <td>${reservation.pickupDate}</td>
            <td>${statusBadge}</td>
            <td><strong>${formatCurrency(reservation.total)}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-success btn-small" onclick="confirmReservation('${reservation.code}')">Confirm</button>
                    <button class="btn btn-danger btn-small" onclick="cancelReservation('${reservation.code}')">Cancel</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

/**
 * Handle reservation form submission
 * Demonstrates event handling and data validation
 */
document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const vehicleId = parseInt(document.getElementById('vehicleSelect').value);
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    // Validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    
    if (returnD <= pickup) {
        showAlert('Return date must be after pickup date!', 'error');
        return;
    }
    
    // Find selected car from GLOBAL inventory
    const selectedCar = carInventory.find(car => car.id === vehicleId);
    
    if (!selectedCar) {
        showAlert('Please select a vehicle!', 'error');
        return;
    }
    
    // Calculate rental days and cost
    const days = calculateDaysBetween(pickup, returnD);
    const cost = calculateRentalPrice(selectedCar.dailyRate, days, 0);
    
    // Create reservation object
    const reservation = {
        code: generateReservationCode(),
        customerName: customerName,
        customerEmail: customerEmail,
        vehicle: `${selectedCar.make} ${selectedCar.model}`,
        vehicleId: vehicleId,
        pickupDate: pickupDate,
        returnDate: returnDate,
        days: days,
        total: cost.total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Add to GLOBAL reservations array
    reservations.push(reservation);
    
    // Update car status in GLOBAL inventory
    selectedCar.status = 'reserved';
    
    // Update GLOBAL revenue
    totalSystemRevenue += cost.total;
    
    // Update UI
    updateDashboardStats();
    loadReservationsTable();
    refreshFleet();
    
    // Close modal and show success
    closeReservationModal();
    showAlert(`Reservation ${reservation.code} created successfully!`, 'success');
    
    // Reset form
    document.getElementById('reservationForm').reset();
});

/**
 * Confirm a reservation
 * @param {string} code - Reservation code
 */
function confirmReservation(code) {
    // Find reservation in GLOBAL array
    const reservation = reservations.find(r => r.code === code);
    
    if (reservation) {
        reservation.status = 'confirmed';
        
        // Update car status
        const car = carInventory.find(c => c.id === reservation.vehicleId);
        if (car) car.status = 'rented';
        
        updateDashboardStats();
        loadReservationsTable();
        refreshFleet();
        showAlert(`Reservation ${code} confirmed!`, 'success');
    }
}

/**
 * Cancel a reservation
 * @param {string} code - Reservation code
 */
function cancelReservation(code) {
    // Find index in GLOBAL array
    const index = reservations.findIndex(r => r.code === code);
    
    if (index !== -1) {
        const reservation = reservations[index];
        
        // Update car status back to available
        const car = carInventory.find(c => c.id === reservation.vehicleId);
        if (car) car.status = 'available';
        
        // Remove from GLOBAL array
        reservations.splice(index, 1);
        
        // Update GLOBAL revenue
        totalSystemRevenue -= reservation.total;
        
        updateDashboardStats();
        loadReservationsTable();
        refreshFleet();
        showAlert(`Reservation ${code} cancelled!`, 'success');
    }
}

/**
 * Navigation functions
 */
function showDashboard() {
    showAlert('Dashboard view active', 'success');
}

function showCars() {
    refreshFleet();
}

function showReservations() {
    loadReservationsTable();
    showAlert('Showing all reservations', 'success');
}

function showCustomers() {
    showAlert('Customer management coming soon!', 'success');
}

/* ============================================
   INITIALIZATION
   Initialize system with sample data
   ============================================ */

/**
 * Initialize the application with sample data
 * Demonstrates function composition and data initialization
 */
function initializeSystem() {
    console.log('🚀 Initializing Car Rental Management System...');
    
    // Add sample cars to inventory using function with PARAMETERS
    addCarToInventory('Toyota', 'Corolla', 2022, 'Sedan', 2500);
    addCarToInventory('Honda', 'CR-V', 2023, 'SUV', 4000);
    addCarToInventory('Mazda', 'Demio', 2021, 'Hatchback', 1800);
    addCarToInventory('Nissan', 'X-Trail', 2023, 'SUV', 4500);
    addCarToInventory('Toyota', 'Prado', 2024, 'Luxury SUV', 8000);
    addCarToInventory('Mercedes', 'C-Class', 2023, 'Luxury', 9000);
    addCarToInventory('BMW', 'X5', 2023, 'Luxury SUV', 10000);
    addCarToInventory('Subaru', 'Forester', 2022, 'SUV', 3800);
    
    // Set some cars as rented for demo
    carInventory[1].status = 'rented';
    carInventory[3].status = 'rented';
    carInventory[5].status = 'maintenance';
    
    // Initialize sample revenue
    totalSystemRevenue = 145000;
    
    // Update UI
    updateDashboardStats();
    refreshFleet();
    loadReservationsTable();
    
    console.log('✅ System initialized with', carInventory.length, 'vehicles');
    console.log('📊 Global Variables:');
    console.log('   - carInventory:', carInventory.length, 'cars');
    console.log('   - reservations:', reservations.length, 'bookings');
    console.log('   - totalSystemRevenue:', formatCurrency(totalSystemRevenue));
}

// Close modal when clicking outside
document.getElementById('reservationModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeReservationModal();
    }
});

// Set minimum date for date inputs (today)
const today = new Date().toISOString().split('T')[0];
document.getElementById('pickupDate').setAttribute('min', today);
document.getElementById('returnDate').setAttribute('min', today);

// Initialize system on page load
window.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
    console.log('🎨 CSS & JavaScript Assignment Demonstration Ready!');
});