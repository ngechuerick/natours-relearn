import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

export const bookTour = async tourId => {
  try {
    const stripe = await loadStripe(
      'pk_test_51PAqSDIheyxvcUhIZQVhYnrfmP8dUsIwtpbaVXxwynLuXRAveAQ6aWL9XnedfsXzSsMwMxGEnU20IUCAFcP844Bc00fG1aevY6',
    );

    /**Get the session from the server I.E API */
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
      withCredentials: true,
    });

    /**Create checkout form + charge credit card */
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};
