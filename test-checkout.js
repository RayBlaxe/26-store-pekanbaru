#!/usr/bin/env node

// Test script to verify the checkout flow
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8000/api';
const FRONTEND_BASE = 'http://localhost:3000';

async function testCheckoutFlow() {
  console.log('🧪 Testing Checkout Flow...\n');

  try {
    // Step 1: Register/Login a test user
    console.log('1. Creating test user...');
    const registerResponse = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: `test+${Date.now()}@example.com`,
        password: 'password123',
        password_confirmation: 'password123',
        phone: '081234567890'
      })
    });

    if (!registerResponse.ok) {
      throw new Error(`Registration failed: ${registerResponse.status}`);
    }

    const authData = await registerResponse.json();
    const token = authData.token;
    console.log('✅ User created successfully');

    // Step 2: Add items to cart
    console.log('2. Adding items to cart...');
    const addToCartResponse = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: 1, // Nike Premier League Football
        quantity: 2
      })
    });

    if (!addToCartResponse.ok) {
      throw new Error(`Add to cart failed: ${addToCartResponse.status}`);
    }
    console.log('✅ Items added to cart');

    // Step 3: Create order
    console.log('3. Creating order...');
    const createOrderResponse = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        shipping_address: {
          name: 'Test User',
          phone: '081234567890',
          address: 'Jl. Test No. 123',
          city: 'Pekanbaru',
          state: 'Riau',
          postal_code: '28000'
        },
        payment_method: 'midtrans',
        notes: 'Test order'
      })
    });

    if (!createOrderResponse.ok) {
      const errorText = await createOrderResponse.text();
      throw new Error(`Order creation failed: ${createOrderResponse.status} - ${errorText}`);
    }

    const orderData = await createOrderResponse.json();
    const orderId = orderData.data.id;
    console.log(`✅ Order created with ID: ${orderId}`);

    // Step 4: Test payment token generation
    console.log('4. Testing payment token generation...');
    const paymentTokenResponse = await fetch(`${FRONTEND_BASE}/api/orders/${orderId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!paymentTokenResponse.ok) {
      const errorText = await paymentTokenResponse.text();
      throw new Error(`Payment token failed: ${paymentTokenResponse.status} - ${errorText}`);
    }

    const paymentData = await paymentTokenResponse.json();
    console.log('✅ Payment token generated successfully');
    console.log(`   Token: ${paymentData.token}`);

    console.log('\n🎉 All tests passed! The checkout flow is working correctly.');
    
    return {
      success: true,
      orderId,
      token: paymentData.token
    };

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testCheckoutFlow().then(result => {
  if (result.success) {
    console.log('\n✨ The cart checkout issue has been resolved!');
    console.log('Users should now be able to:');
    console.log('- Add items to cart');
    console.log('- Go to checkout');
    console.log('- Create orders');
    console.log('- Get Midtrans payment popup');
  } else {
    console.log('\n💥 There are still issues to resolve.');
  }
  process.exit(result.success ? 0 : 1);
});