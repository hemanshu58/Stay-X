import React from "react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50">
      <Helmet>
        <title>StayX | Privacy Policy</title> {/* Custom title */}
        <meta
          name="description"
          content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy."
        />
      </Helmet>
      <div className="bg-white p-8 shadow-2xl rounded-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900 border-b pb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500 mb-8">Last updated: 13/10/2024</p>

        <section className="mb-10">
          <p className="text-lg leading-relaxed text-gray-700">
            Welcome to StayX. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our
            platform. By accessing the website, you agree to this Privacy
            Policy.
          </p>
        </section>

        <div className="space-y-8">
          <Accordion title="Information We Collect">
            <p className="text-gray-700">
              We may collect information about you in a variety of ways,
              including:
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
              <li>
                <strong>Personal Data:</strong> Name, email address, phone
                number, etc.
              </li>
              <li>
                <strong>Property Details:</strong> Information related to
                properties uploaded.
              </li>
              <li>
                <strong>Usage Data:</strong> Information on how you access and
                use the platform.
              </li>
            </ul>
          </Accordion>
          <Accordion title="How We Use Your Information">
            <p className="text-gray-700">We may use your information to:</p>
            <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
              <li>Facilitate account creation and management.</li>
              <li>Process payments for subscriptions.</li>
              <li>Display personalized advertisements and content.</li>
              <li>Respond to inquiries and offer support.</li>
            </ul>
          </Accordion>
          <Accordion title="Sharing Your Information">
            <p className="text-gray-700">
              We may share information with third parties for various reasons,
              such as:
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
              <li>To comply with legal obligations.</li>
              <li>To facilitate property transactions.</li>
              <li>For advertising and analytics.</li>
            </ul>
          </Accordion>
          <Accordion title="Security">
            <p className="text-gray-700">
              We use administrative, technical, and physical security measures
              to protect your information. While we have taken reasonable steps
              to secure your data, no method of transmission is 100% secure.
            </p>
          </Accordion>
          <Accordion title="Contact Us">
            <p className="text-gray-700">
              If you have any questions or concerns about this Privacy Policy,
              please contact us via the contact page.
            </p>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

// Accordion component
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-lg font-medium text-gray-800 focus:outline-none flex justify-between items-center"
      >
        {title}
        <span className="text-xl">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && <div className="mt-4 text-gray-600">{children}</div>}
    </div>
  );
};

export default PrivacyPolicy;
