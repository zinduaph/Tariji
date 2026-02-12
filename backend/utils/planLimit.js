
import ProductModel from '../model/product.js'

export const PLAN_LIMITS = {
    starter: {
        maxProducts: 3,
        transactionFee: 0.10, // 10%
        features: ['Basic storefront', 'Email support']
    },
    growth: {
        maxProducts: 10,
        transactionFee: 0.07, // 7%
        features: ['Custom branding', 'Priority support', 'Analytics']
    },
    proPlan: {
        maxProducts: null, // unlimited
        transactionFee: 0.05, // 5%
        features: ['Unlimited products', 'Premium support', 'Advanced analytics', 'Custom domain']
    }
};

export const getPlanLimit = (plan) => {
    return PLAN_LIMITS[plan] || PLAN_LIMITS.starter;
};

export const canAddProduct = async (userId, plan, subscriptionEndDate) => {
    const normalizedPlan = plan || 'starter'; // Default to starter if plan is undefined/null
    const limits = getPlanLimit(normalizedPlan);

    // Check subscription expiry for paid plans
    if (normalizedPlan !== 'starter') {
        if (!subscriptionEndDate || subscriptionEndDate < new Date()) {
            return {
                allowed: false,
                reason: 'subscription_expired',
                message: `Your ${normalizedPlan} subscription has expired. Please renew to continue.`
            };
        }
    }

    // Check product count
    if (limits.maxProducts !== null) {
        const productCount = await ProductModel.countDocuments({ userId });
        
        if (productCount >= limits.maxProducts) {
            return {
                allowed: false,
                reason: 'limit_reached',
                message: `You've reached the maximum of ${limits.maxProducts} products for your ${normalizedPlan} plan.`,
                currentCount: productCount,
                limit: limits.maxProducts
            };
        }
    }
    
    return { allowed: true };
};
