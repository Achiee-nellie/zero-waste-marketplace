import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import * as orderService from '../../services/orderService';
import { toast } from 'react-toastify';
import api from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const subtotal = getCartTotal();
  const shipping = 10;
  const platformFee = subtotal * 0.15;
  const total = subtotal + shipping + platformFee;

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create order
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.discountedPrice,
          image: item.images[0]?.url,
          wasteReduced: item.estimatedWasteReduced * item.quantity,
          co2Saved: item.estimatedCO2Saved * item.quantity,
        })),
        shippingAddress,
        paymentMethod: 'card',
        itemsPrice: subtotal,
        shippingPrice: shipping,
      };

      const order = await orderService.createOrder(orderData);

      // Create payment intent
      const { data } = await api.post('/payments/create-intent', {
        orderId: order._id,
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user.name,
              email: user.email,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Update order to paid
        await orderService.updateOrderToPaid(order._id, {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email: user.email,
        });

        clearCart();
        toast.success('Order placed successfully!');
        navigate('/payment-success');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  required
                  className="input"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                    className="input"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    required
                    className="input"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="p-4 border border-gray-300 rounded-lg">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Processing...' : `Pay ${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex space-x-3">
                  <img
                    src={item.images[0]?.url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity} × ${item.discountedPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (15%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-green-50 p-3 rounded-lg mt-4">
              <p className="text-sm text-green-800 font-semibold">
                🌍 Your Impact
              </p>
              <p className="text-xs text-green-700 mt-1">
                This order saves{' '}
                {cartItems.reduce(
                  (sum, item) =>
                    sum + item.estimatedWasteReduced * item.quantity,
                  0
                ).toFixed(2)}
                kg of waste!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
