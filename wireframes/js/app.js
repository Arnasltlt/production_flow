// Production Flow Wireframe Application

// Simple router for the wireframe
const routes = {
    orders: 'screens/orders.html',
    newOrder: 'screens/new-order.html',
    orderDetails: 'screens/order-details.html',
    orderProduction: 'screens/order-production.html',
    suppliers: 'screens/supplier-hub.html'
};

// App state
let currentRoute = 'orders';
let selectedOrderId = null;

// Load component into a container
async function loadComponent(containerId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
        document.getElementById(containerId).innerHTML = `<div class="error">Failed to load component: ${error.message}</div>`;
    }
}

// Navigate to a route
async function navigateTo(route, params = {}) {
    currentRoute = route;
    selectedOrderId = params.orderId || null;
    
    // Update active navigation item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItem = document.querySelector(`.nav-item[data-route="${route}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Load the route content
    await loadComponent('main-content', routes[route]);
    
    // Update URL
    window.history.pushState({ route, params }, '', `#${route}`);
    
    // Initialize any functionality needed for the new screen
    initCurrentScreen(route, params);
}

// Initialize functionality for the current screen
function initCurrentScreen(route, params) {
    switch (route) {
        case 'dashboard':
            initDashboard();
            break;
        case 'orders':
            initOrdersScreen();
            break;
        case 'newOrder':
            initNewOrderScreen();
            break;
        case 'orderDetails':
            initOrderDetailsScreen(params.orderId);
            break;
        case 'orderProduction':
            initOrderProductionScreen(params.orderId);
            break;
    }
}

// Initialize dashboard screen
function initDashboard() {
    // Set up event listeners for dashboard elements
    const orderCards = document.querySelectorAll('.order-card');
    orderCards.forEach(card => {
        card.addEventListener('click', () => {
            const orderId = card.getAttribute('data-order-id');
            navigateTo('orderDetails', { orderId });
        });
    });
    
    // Set up tabs functionality
    initTabs();
}

// Initialize orders screen
function initOrdersScreen() {
    // Set up event listeners for order list
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        item.addEventListener('click', () => {
            const orderId = item.getAttribute('data-order-id');
            navigateTo('orderDetails', { orderId });
        });
    });
    
    // Set up filter functionality
    const filterDropdown = document.getElementById('status-filter');
    if (filterDropdown) {
        filterDropdown.addEventListener('change', filterOrders);
    }
    
    // Set up tabs functionality
    initTabs();
}

// Initialize new order screen
function initNewOrderScreen() {
    // Set up form submission
    const orderForm = document.getElementById('new-order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would normally process the form
            // For the wireframe, just redirect to the orders page
            navigateTo('orders');
        });
    }
    
    // Set up multi-step form navigation if present
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const nextStep = document.getElementById(button.getAttribute('data-next'));
            
            if (currentStep && nextStep) {
                currentStep.style.display = 'none';
                nextStep.style.display = 'block';
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const prevStep = document.getElementById(button.getAttribute('data-prev'));
            
            if (currentStep && prevStep) {
                currentStep.style.display = 'none';
                prevStep.style.display = 'block';
            }
        });
    });
}

// Initialize order details screen
function initOrderDetailsScreen(orderId) {
    // Load order details
    console.log(`Loading details for order ${orderId}`);
    
    // Set up tabs functionality
    initTabs();
    
    // Set up action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = button.getAttribute('data-action');
            handleOrderAction(orderId, action);
        });
    });
}

// Initialize order production screen
function initOrderProductionScreen(orderId) {
    // Load production details
    console.log(`Loading production details for order ${orderId}`);
    
    // Set up tabs functionality
    initTabs();
    
    // Set up progress tracking
    updateProgressBars();
}

// Handle order actions
function handleOrderAction(orderId, action) {
    switch (action) {
        case 'approve':
            console.log(`Approving order ${orderId}`);
            navigateTo('orderProduction', { orderId });
            break;
        case 'reject':
            console.log(`Rejecting order ${orderId}`);
            navigateTo('orders');
            break;
        case 'change':
            console.log(`Requesting change for order ${orderId}`);
            // Show change request modal
            const modal = document.getElementById('change-request-modal');
            if (modal) {
                modal.style.display = 'block';
            }
            break;
    }
}

// Initialize tabs functionality
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get the tab container and target content
            const tabContainer = tab.parentElement;
            const contentId = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to selected tab and content
            tab.classList.add('active');
            const content = document.getElementById(contentId);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// Filter orders based on status
function filterOrders() {
    const status = document.getElementById('status-filter').value;
    const orders = document.querySelectorAll('.order-item');
    
    orders.forEach(order => {
        if (status === 'all' || order.getAttribute('data-status') === status) {
            order.style.display = 'block';
        } else {
            order.style.display = 'none';
        }
    });
}

// Update progress bars
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const percentValue = bar.getAttribute('data-progress');
        const fillElement = bar.querySelector('.progress-bar-fill');
        
        if (fillElement && percentValue) {
            fillElement.style.width = `${percentValue}%`;
        }
    });
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize the application
async function initApp() {
    // Load the sidebar component
    await loadComponent('sidebar', 'components/sidebar.html');
    
    // Set up navigation event listeners
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const route = item.getAttribute('data-route');
            navigateTo(route);
        });
    });
    
    // Check for route in URL hash
    const hash = window.location.hash.substring(1);
    if (hash && routes[hash]) {
        navigateTo(hash);
    } else {
        // Default route
        navigateTo('orders');
    }
    
    // Set up browser back/forward navigation
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.route) {
            navigateTo(event.state.route, event.state.params);
        } else {
            navigateTo('orders');
        }
    });
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);