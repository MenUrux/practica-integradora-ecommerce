import Stripe from 'stripe';
import config from '../config/config.js';

export default class PaymentsService {
    constructor() {
        this.stripe = new Stripe(config.stripe_secret_token)
    }
    createPaymentIntent(data) {
        return this.striple.paymentIntents.create(data)
    }
}
