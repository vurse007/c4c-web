export type LegalDocId = "terms" | "privacy" | "accessibility";

export type LegalSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  id: LegalDocId;
  label: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  terms: {
    id: "terms",
    label: "Terms & Conditions",
    title: "Terms & Conditions",
    lastUpdated: "12/19/2025",
    sections: [
      {
        heading: "A Legal Disclaimer",
        paragraphs: [
          "The information provided on this website is for general informational and educational purposes only. Caring for Caregivers makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information contained on this website, www.caringforcaregivers.org.",
          "Nothing on this website constitutes legal, medical, financial, or professional advice. Any reliance you place on the information provided is strictly at your own risk. Caring for Caregivers is not responsible for any losses, damages, or outcomes that may arise from the use of this website or its content.",
          "This website may include information related to healthcare careers, healthcare environments, or initiatives promoting healthcare appreciation. Such content is intended solely for awareness, inspiration, and educational purposes and should not be interpreted as clinical guidance or professional healthcare advice.",
          "Caring for Caregivers may include links to external websites or third-party resources for informational purposes. We do not control and are not responsible for the content, policies, or practices of any third-party websites.",
          "By using this website, you acknowledge and agree to this disclaimer and accept full responsibility for your use of the information and materials provided.",
        ],
      },
      {
        heading: "Introduction",
        paragraphs: [
          "Welcome to the Caring for Caregivers website. These Terms & Conditions govern your use of this Website and any related services, content, or activities offered by Caring for Caregivers.",
          "By accessing or using this Website, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use the Website.",
          "Caring for Caregivers is a student-led nonprofit organization dedicated to supporting healthcare providers through donated care packages while inspiring students to pursue healthcare careers and raising awareness about systemic challenges in healthcare.",
        ],
      },
      {
        heading: "Eligibility and Appropriate Use",
        paragraphs: [
          "This Website is intended for individuals of all ages. However, users under 18 should engage with volunteer sign-ups, submissions, or communications only with appropriate parental or guardian awareness.",
          "You agree to use this Website only for lawful purposes and in a manner consistent with our mission of respect, service, and community support.",
          "You may not use the Website in a way that violates any applicable laws or regulations, harms or misrepresents others, or interferes with the operation or security of the Website.",
        ],
      },
      {
        heading: "Donations and Payments",
        paragraphs: [
          "If the Website accepts donations or payments, all donations are voluntary and non-refundable unless otherwise required by law.",
          "Caring for Caregivers reserves the right to allocate donated funds or goods in a manner consistent with our charitable mission and operational needs.",
          "We do not guarantee that donations will be used for a specific hospital, healthcare provider, or initiative unless explicitly stated.",
          "Payment processing may be handled by third-party platforms, and Caring for Caregivers is not responsible for their terms, errors, or security practices.",
        ],
      },
      {
        heading: "Intellectual Property",
        paragraphs: [
          "All content on this Website, including text, logos, graphics, photos, videos, and original materials, is the property of Caring for Caregivers unless otherwise stated.",
          "You may view, download, and share content for personal, educational, or nonprofit purposes with proper attribution.",
          "You may not reproduce, sell, modify, or distribute Website content for commercial purposes without written permission.",
        ],
      },
      {
        heading: "Volunteer Submissions and User Content",
        paragraphs: [
          "If you submit forms, stories, photos, testimonials, or other materials, you confirm that the content is accurate and that you have the right to submit it.",
          "You grant Caring for Caregivers permission to use, display, and share submitted content for nonprofit, educational, or promotional purposes, including social media and reports, unless you request otherwise in writing.",
          "Caring for Caregivers reserves the right to remove any content that is inaccurate, inappropriate, or inconsistent with our mission.",
        ],
      },
      {
        heading: "Changes to the Website and Terms",
        paragraphs: [
          "Caring for Caregivers reserves the right to modify or discontinue any part of the Website at any time.",
          "We may update these Terms & Conditions as needed. Changes take effect upon posting, and continued use of the Website constitutes acceptance of the revised Terms.",
        ],
      },
      {
        heading: "Limitation of Liability",
        paragraphs: [
          "This Website is provided on an “as is” basis. While we strive for accuracy and reliability, we make no guarantees regarding the completeness, accuracy, or availability of Website content.",
          "Our tutoring services are provided by volunteers and are not a substitute for professional educational services.",
          "To the fullest extent permitted by law, Caring for Caregivers is not liable for any direct or indirect damages resulting from the use of this Website.",
        ],
      },
      {
        heading: "External Links",
        paragraphs: [
          "This Website may contain links to third-party websites for informational or partnership purposes. Caring for Caregivers does not control and is not responsible for the content, policies, or practices of external sites.",
        ],
      },
      {
        heading: "Governing Law",
        paragraphs: [
          "These Terms are governed by the laws of the applicable jurisdiction in which Caring for Caregivers operates, without regard to conflict-of-law principles.",
        ],
      },
      {
        heading: "Contact Information",
        paragraphs: [
          "If you have questions about these Terms & Conditions, please contact us at:",
          "Email: wearecaringforcaregivers@gmail.com",
          "Organization: Caring for Caregivers",
        ],
      },
    ],
  },
  privacy: {
    id: "privacy",
    label: "Privacy Policy",
    title: "Privacy Policy",
    lastUpdated: "12/19/2025",
    sections: [
      {
        heading: "A Legal Disclaimer",
        paragraphs: [
          "The explanations and information provided in this Privacy Policy are only general and high-level explanations of how a privacy policy may address the collection, use, and protection of personal information. This document is not intended to serve as legal advice or as recommendations regarding what you should actually do, because we cannot know in advance the specific privacy practices, legal obligations, or requirements that apply to your organization, activities, visitors, or jurisdiction.",
          "Caring for Caregivers makes no representations or warranties regarding compliance with any specific privacy, data protection, or security laws. You are responsible for ensuring that your privacy practices comply with applicable local, state, national, and international laws and regulations.",
          "We strongly recommend that you seek legal advice to help you understand and assist you in the creation, review, and implementation of your own Privacy Policy.",
        ],
      },
      {
        heading: "Introduction",
        paragraphs: [
          "Caring for Caregivers is committed to protecting the privacy of visitors, donors, volunteers, students, and partners who interact with our website. This Privacy Policy explains how we collect, use, store, disclose, and protect personal information through our Website, www.caringforcaregivers.org.",
          "By using this Website, you agree to the collection and use of information in accordance with this Privacy Policy.",
        ],
      },
      {
        heading: "Information We Collect",
        paragraphs: [
          "We may collect personal information in the following ways:",
          "Information you voluntarily provide, such as your name, email address, school affiliation, or other contact details, when you fill out forms, sign up to volunteer, make a donation, subscribe to updates, or contact us.",
          "Donation-related information, which may include payment details processed securely through third-party payment platforms. Caring for Caregivers does not store full payment or credit card information.",
          "Automatically collected information, such as IP address, browser type, device information, pages visited, and usage data, is collected through cookies or analytics tools to improve website functionality and outreach.",
        ],
      },
      {
        heading: "Why We Collect Information",
        paragraphs: [
          "We collect personal information for purposes that include:",
        ],
        bullets: [
          "Communicating with volunteers, donors, students, and supporters",
          "Coordinating volunteer efforts, gift basket initiatives, and nonprofit operations",
          "Processing donations and acknowledgments",
          "Improving our Website, programs, and outreach efforts",
          "Maintaining safety, security, and compliance with applicable laws",
          "Coordinating tutoring services and academic support for caregivers’ children",
        ],
      },
      {
        paragraphs: [
          "We collect only the information necessary to support our mission of supporting healthcare providers and engaging students in meaningful service.",
        ],
      },
      {
        heading: "How We Share Information",
        paragraphs: [
          "Caring for Caregivers does not sell or rent personal information.",
          "We may share information only in limited circumstances, including:",
        ],
        bullets: [
          "With trusted third-party service providers (such as donation processors, website hosting platforms, or email services) solely to operate our Website and nonprofit activities",
          "When required by law or legal process",
          "To protect the rights, safety, or integrity of Caring for Caregivers, our volunteers, or others",
        ],
      },
      {
        paragraphs: [
          "All third-party providers are expected to follow appropriate data protection practices.",
        ],
      },
      {
        heading: "Data Protection and Security",
        paragraphs: [
          "We take reasonable administrative, technical, and organizational measures to protect personal information from unauthorized access, disclosure, or misuse. However, no method of online transmission or electronic storage is completely secure, and we cannot guarantee absolute security.",
        ],
      },
      {
        heading: "Your Rights",
        paragraphs: [
          "Depending on your location, you may have rights under applicable privacy laws, including the right to request access to, correction of, or deletion of your personal information.",
          "If you would like to exercise any privacy-related rights, please contact us using the information provided below.",
        ],
      },
      {
        heading: "Minors' Privacy",
        paragraphs: [
          "Caring for Caregivers is a student-led organization and welcomes participation from minors. We do not knowingly collect personal information from children under the age of 13 without appropriate parental or guardian awareness.",
          "Parental or guardian consent is required for participation in tutoring programs involving children under 13.",
          "If a parent or guardian believes that a minor has provided personal information without consent, they may contact us to request removal of that information.",
        ],
      },
      {
        heading: "Cookies and Tracking Technologies",
        paragraphs: [
          "Our Website may use cookies or similar technologies to enhance user experience, analyze traffic, and improve performance. You may choose to disable cookies through your browser settings, though this may affect Website functionality.",
        ],
      },
      {
        heading: "External Links",
        paragraphs: [
          "Our Website may contain links to third-party websites for informational or partnership purposes. Caring for Caregivers is not responsible for the privacy practices or content of external websites.",
        ],
      },
      {
        heading: "Changes to This Privacy Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. Updates will be posted on this page, and continued use of the Website constitutes acceptance of the revised policy.",
        ],
      },
      {
        heading: "Contact Information",
        paragraphs: [
          "If you have questions about this Privacy Policy or our data practices, please contact us at:",
          "Email: wearecaringforcaregivers@gmail.com",
          "Organization: Caring for Caregivers",
        ],
      },
    ],
  },
  accessibility: {
    id: "accessibility",
    label: "Accessibility Statement",
    title: "Accessibility Statement",
    lastUpdated: "12/19/2025",
    sections: [
      {
        paragraphs: [
          "Caring for Caregivers is committed to ensuring that our website is accessible to people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.",
          "Caring for Caregivers is committed to ensuring digital accessibility for all individuals, including people with disabilities. We believe that everyone should be able to access our content, learn about our mission, and engage with our work in a meaningful and equitable way. As a student-led nonprofit dedicated to supporting healthcare providers and inspiring future healthcare professionals, accessibility is a core part of our values.",
        ],
      },
      {
        heading: "What Web Accessibility Is",
        paragraphs: [
          "An accessible website allows individuals with disabilities to navigate through the site with ease and enjoy a similar level of access and experience as other visitors. This is achieved through adherence to accessibility standards and the use of assistive technologies such as screen readers, keyboard navigation, and other adaptive tools.",
        ],
      },
      {
        heading: "Accessibility Adjustments on This Site",
        paragraphs: [
          "We have designed this website in accordance with WCAG 2.1 guidelines and have made the site accessible to the level of AA.",
          "The content on this website is designed to work with assistive technologies, including screen readers and keyboard-only navigation. As part of our ongoing accessibility efforts, we have:",
        ],
        bullets: [
          "Used accessibility tools and audits to identify and address potential accessibility issues",
          "Set the primary language of the site",
          "Structured content with clear and consistent heading hierarchies",
          "Ensured logical content order across pages",
          "Added alternative text to images where appropriate",
          "Used color combinations that meet required contrast standards",
          "Reduced the use of motion and animations where possible",
          "Ensured that videos, audio content, and downloadable files are accessible when feasible",
        ],
      },
      {
        paragraphs: [
          "We continuously review and improve the accessibility of our website as part of our commitment to inclusive design.",
        ],
      },
      {
        heading: "Declaration of Partial Compliance Due to Third-Party Content",
        paragraphs: [
          "Some pages on this website may include content provided by third-party platforms or services that are not fully under our control, such as embedded donation tools, forms, or external media. The accessibility of these elements depends on the accessibility practices of the third-party providers.",
          "As a result, we declare partial compliance with the accessibility standard for these specific elements. We actively strive to work with third-party services that prioritize accessibility.",
        ],
      },
      {
        heading: "Accessibility Arrangements in the Organization",
        paragraphs: [
          "Caring for Caregivers is primarily a student-led organization that operates through schools, partner institutions, and community locations. Accessibility arrangements for in-person events or activities may vary depending on the host location.",
          "When hosting or participating in events, we aim to work with partners to ensure reasonable accessibility accommodations whenever possible. Individuals with accessibility needs are encouraged to contact us in advance so we can make appropriate arrangements.",
        ],
      },
      {
        heading: "Requests, Issues, and Suggestions",
        paragraphs: [
          "We welcome feedback on the accessibility of our website. If you encounter an accessibility issue, require assistance, or have suggestions for improvement, please contact our accessibility coordinator:",
          "Accessibility Coordinator: Ayush Patel",
          "Phone: (949) 469-8195",
          "Email: wearecaringforcaregivers@gmail.com",
          "We will make every reasonable effort to respond promptly and address accessibility concerns in a timely manner.",
        ],
      },
    ],
  },
};

export const LEGAL_LINKS: { id: LegalDocId; label: string }[] = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "accessibility", label: "Accessibility Statement" },
];
