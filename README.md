Smart Canteen

Student Details
   Name:T.M.Sashini Gayathri
   Student ID:PE/2022/019

App Purpose
   The Smart Canteen is a mobile application built with React Native and Expo that allows university students and staff to browse daily canteen meals, drinks, and snacks, filter items by dietary preferences (Vegetarian / Non-Vegetarian), add items to a pre-order cart, view estimated preparation times, and receive instant pickup notifications.

Screen Breakdown
   1.Menu Screen ('app/index.js'):
    - Displays hard-coded realistic Sri Lankan campus canteen items categorized into **Meals**, **Drinks**, and **Snacks** with prices (in LKR) and estimated preparation times.
    - Features interactive Category Filters ('All', 'Meals', 'Drinks', 'Snacks') and Dietary Filters ('All', 'Veg Only', 'Non-Veg').
    - Monitors 'AppState' ('active' vs 'background') to display real-time canteen sync status.
    - Includes a floating bottom cart summary bar to navigate to the checkout screen.
   2.Order Summary Screen ('app/order-summary.js'):
    - Displays selected cart items with quantity increment ('+') and decrement ('-') controls.
    - Calculates the total bill and dynamic Estimated Preparation Time based on item prep durations.
    - Features a Confirm & Place Order button that triggers a local push notification.

Component & File Locations
    - 'app/_layout.js' – Root Stack Navigator configuration, notification handler setup, and 'CartProvider' wrapper.
    - 'app/index.js' – Main Menu screen UI, filtering logic, and 'AppState' listener.
    - 'app/order-summary.js' – Order summary breakdown, preparation time display, and notification trigger.
    - 'context/CartContext.js' – React Context API managing global cart state ('addToCart', 'removeFromCart', 'clearCart', 'getTotalPrice', 'getEstimatedPrepTime').
    - 'data/menuData.js' – Hard-coded realistic canteen menu dataset.

  SmartCanteen/
├── app/
│   ├── _layout.js
│   ├── index.js
│   └── order-summary.js
├── context/
│   └── CartContext.js
├── data/
│   └── menuData.js
├── app.json
├── package.json
└── README.md


Routing Structure
   The app uses Expo Router (file-based stack navigation):
    - '/' ('app/index.js') → Initial route loading the Menu Screen.
    - '/order-summary' ('app/order-summary.js') → Pushed onto the stack when the user taps the bottom cart banner from the Menu Screen.

Notification Explanation
   Local notifications are implemented using 'expo-notifications':
    1. On app launch ('app/_layout.js'), the app requests notification permissions and configures 'Notifications.setNotificationHandler' so alerts appear even when the app is in the foreground.
    2. When the user taps Confirm & Place Order** on the Order Summary screen, 'Notifications.scheduleNotificationAsync' schedules a notification with the message "Your Order is Ready for Pickup!" (configured with a 3-second trigger delay for demonstration purposes).

Local Setup Commands
      A cross-platform mobile application developed using React Native (Expo) for university canteen ordering, featuring real-time cart management, customer details validation, and local push notifications.

 Features
- Interactive Menu: Browse canteen food items with category filtering.
- Cart Management: Add, update, or remove items seamlessly using React Context.
- Customer Details Form: Enter Name, Phone Number, and Pickup Location with form validation.
- Push Notifications:Instant order confirmation notifications via `expo-notifications`.
- Estimated Prep Time: Dynamic preparation time calculation based on cart items.

 Tech Stack
- Framework:React Native (Expo)
- Routing:Expo Router
- State Management:React Context API
- Notifications:Expo Notifications

 Local Setup Commands

Follow these steps to run the project locally on your machine:

1.Clone the repository:
   ```bash
   git clone [https://github.com/sashini7894/SmartCanteen.git](https://github.com/sashini7894/SmartCanteen.git)

Demo Video-: 
