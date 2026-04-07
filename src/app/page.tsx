import Link from 'next/link';

const features = [
  {
    icon: '🕐',
    title: '24/7 Availability',
    description: 'Your AI employee never sleeps, never takes holidays, and handles enquiries around the clock.',
  },
  {
    icon: '🧠',
    title: 'Learns Your Business',
    description: 'Feed it your business info, FAQs, and services. It becomes an expert on what you do.',
  },
  {
    icon: '⚡',
    title: 'Instant Answers',
    description: 'No more waiting. Customers get instant, accurate responses to their questions.',
  },
  {
    icon: '📋',
    title: 'Lead Capture',
    description: 'Automatically collect contact details from interested visitors. Never miss a lead.',
  },
  {
    icon: '💬',
    title: 'Conversation History',
    description: 'Review every conversation. Understand what your customers are asking about.',
  },
  {
    icon: '🔧',
    title: 'Easy Embed',
    description: 'Copy one line of code. Paste it into your website. Done. Works everywhere.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '99',
    description: 'Perfect for small businesses just getting started.',
    features: ['1 chatbot', '500 conversations/month', 'Business info setup', 'Email support', 'Conversation history'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '199',
    description: 'For growing businesses that need more power.',
    features: [
      '3 chatbots',
      '2,000 conversations/month',
      'Lead capture',
      'Priority email support',
      'Conversation history',
      'Custom branding',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '399',
    description: 'For businesses that demand the best.',
    features: [
      '10 chatbots',
      'Unlimited conversations',
      'Lead capture',
      'Priority support',
      'Conversation history',
      'Custom branding',
      'API access',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'How long does it take to set up?',
    answer:
      'About 5 minutes. Sign up, add your business information, and embed one line of code on your website. That\'s it.',
  },
  {
    question: 'Do I need any technical knowledge?',
    answer:
      'Not at all. Our dashboard is designed for non-technical users. If you can copy and paste, you can set up AIStaffer.',
  },
  {
    question: 'What happens if the AI can\'t answer a question?',
    answer:
      'The AI will politely let the customer know and suggest they contact your business directly using the contact information you\'ve provided.',
  },
  {
    question: 'Can I customise the chatbot\'s appearance?',
    answer:
      'Yes! You can change the widget colour, greeting message, and more to match your brand.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes, every plan comes with a 14-day free trial. No credit card required.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. No contracts, no commitments. Cancel anytime from your dashboard.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AIStaffer</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">
                FAQ
              </a>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
            <div className="md:hidden">
              <Link
                href="/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
            Now available for UK businesses
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Your AI Employee That{' '}
            <span className="text-primary-600">Never Sleeps</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            An AI chatbot for your website that handles customer enquiries 24/7.
            Trained on your business. Ready in minutes.
          </p>
          <p className="text-base text-gray-500 mb-10">
            Set up in 5 minutes. No coding required. From £99/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Up and Running in 3 Steps
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            No developers needed. No complex setup. Just a few minutes of your time.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your account in seconds. No credit card required for your free trial.',
              },
              {
                step: '2',
                title: 'Add Your Business Info',
                description:
                  'Tell us about your business, services, FAQs, and opening hours. The AI learns it all.',
              },
              {
                step: '3',
                title: 'Embed the Widget',
                description:
                  'Copy one line of code and paste it into your website. Your AI employee is live.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Powerful features to help your business serve customers better, faster, and around the clock.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl ${
                  plan.highlighted
                    ? 'bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-2 scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    plan.highlighted ? 'text-primary-100' : 'text-gray-500'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    £{plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-primary-200' : 'text-gray-500'}`}>
                    /month
                  </span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-primary-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-primary-200' : 'text-primary-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Put Your Business on Autopilot?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join hundreds of businesses using AIStaffer to handle customer enquiries 24/7.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
          </Link>
          <p className="text-primary-200 text-sm mt-4">14 days free. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="text-white font-semibold">AIStaffer</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AIStaffer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
