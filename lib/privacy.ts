import { CONTACT_EMAIL } from "@/lib/constants";

export type PrivacyTableRow = {
  category: string;
  examples: string;
  collected: string;
};

export type PrivacyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | {
      type: "table";
      headers: [string, string, string];
      rows: PrivacyTableRow[];
    };

export type PrivacySection = {
  id: string;
  title: string;
  inShort: string | null;
  blocks: PrivacyBlock[];
};

export type PrivacyKeyPoint = {
  question: string;
  answer: string;
  href: string;
};

export const PRIVACY = {
  title: "Privacy Policy",
  lastUpdated: "April 16, 2026",
  introLead: `This Privacy Notice for Writidian LLC (doing business as Writidian) ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:`,
  introServices: [
  "Visit our website at https://writidian.com or any website of ours that links to this Privacy Notice",
  "Download and use our mobile application (Writidian), or any other application of ours that links to this Privacy Notice",
  "Use Writidian. A writing tool that helps users build an effective writing habit by creating the right distraction-free digital environment for them to write",
  "Engage with us in other related ways, including any marketing or events"
],
  introClose: `Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at ${CONTACT_EMAIL}.`,
  keyPointsIntro:
    "This summary provides key points from our Privacy Notice. Use the table of contents to find the section you are looking for.",
  keyPoints: [
  {
    "question": "What personal information do we process?",
    "answer": "When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.",
    "href": "#information-we-collect"
  },
  {
    "question": "Do we process any sensitive personal information?",
    "answer": "Some of the information may be considered \"special\" or \"sensitive\" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.",
    "href": "#information-we-collect"
  },
  {
    "question": "Do we collect any information from third parties?",
    "answer": "We do not collect any information from third parties.",
    "href": "#information-we-collect"
  },
  {
    "question": "How do we process your information?",
    "answer": "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.",
    "href": "#how-we-process"
  },
  {
    "question": "In what situations and with which parties do we share personal information?",
    "answer": "We may share information in specific situations and with specific third parties.",
    "href": "#sharing"
  },
  {
    "question": "How do we keep your information safe?",
    "answer": "We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.",
    "href": "#security"
  },
  {
    "question": "What are your rights?",
    "answer": "Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.",
    "href": "#privacy-rights"
  },
  {
    "question": "How do you exercise your rights?",
    "answer": "The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.",
    "href": "#privacy-rights"
  }
] as PrivacyKeyPoint[],
  toc: [
  {
    "id": "information-we-collect",
    "title": "1. What information do we collect?"
  },
  {
    "id": "how-we-process",
    "title": "2. How do we process your information?"
  },
  {
    "id": "legal-bases",
    "title": "3. What legal bases do we rely on to process your information?"
  },
  {
    "id": "sharing",
    "title": "4. When and with whom do we share your personal information?"
  },
  {
    "id": "cookies",
    "title": "5. Do we use cookies and other tracking technologies?"
  },
  {
    "id": "ai-products",
    "title": "6. Do we offer artificial intelligence-based products?"
  },
  {
    "id": "social-logins",
    "title": "7. How do we handle your social logins?"
  },
  {
    "id": "retention",
    "title": "8. How long do we keep your information?"
  },
  {
    "id": "security",
    "title": "9. How do we keep your information safe?"
  },
  {
    "id": "privacy-rights",
    "title": "10. What are your privacy rights?"
  },
  {
    "id": "do-not-track",
    "title": "11. Controls for do-not-track features"
  },
  {
    "id": "us-residents",
    "title": "12. Do United States residents have specific privacy rights?"
  },
  {
    "id": "other-regions",
    "title": "13. Do other regions have specific privacy rights?"
  },
  {
    "id": "updates",
    "title": "14. Do we make updates to this notice?"
  },
  {
    "id": "contact",
    "title": "15. How can you contact us about this notice?"
  },
  {
    "id": "review-update-delete",
    "title": "16. How can you review, update, or delete the data we collect from you?"
  }
],
  sections: [
  {
    "id": "information-we-collect",
    "title": "1. What information do we collect?",
    "inShort": null,
    "blocks": [
      {
        "type": "h3",
        "text": "Personal information you disclose to us"
      },
      {
        "type": "callout",
        "text": "We collect personal information that you provide to us."
      },
      {
        "type": "p",
        "text": "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us."
      },
      {
        "type": "p",
        "text": "Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:"
      },
      {
        "type": "list",
        "items": [
          "names",
          "email addresses",
          "usernames",
          "passwords"
        ]
      },
      {
        "type": "p",
        "text": "Sensitive Information. We do not process sensitive information."
      },
      {
        "type": "p",
        "text": "Payment Data. We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by Stripe and PayStack. You may find their privacy notice link(s) here: https://stripe.com/privacy and https://paystack.com/gh/privacy/merchant."
      },
      {
        "type": "p",
        "text": "Social Media Login Data. We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called \"HOW DO WE HANDLE YOUR SOCIAL LOGINS?\" below."
      },
      {
        "type": "p",
        "text": "Application Data. If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:"
      },
      {
        "type": "list",
        "items": [
          "Mobile Device Access. We may request access or permission to certain features from your mobile device, including your mobile device's and other features. If you wish to change our access or permissions, you may do so in your device's settings.",
          "Push Notifications. We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings."
        ]
      },
      {
        "type": "p",
        "text": "This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes."
      },
      {
        "type": "p",
        "text": "All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information."
      },
      {
        "type": "h3",
        "text": "Google API"
      },
      {
        "type": "p",
        "text": "Our use of information received from Google APIs will adhere to Google API Services User Data Policy, including the Limited Use requirements."
      }
    ]
  },
  {
    "id": "how-we-process",
    "title": "2. How do we process your information?",
    "inShort": "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We process the personal information for the following purposes listed below. We may also process your information for other purposes only with your prior explicit consent.",
    "blocks": [
      {
        "type": "p",
        "text": "We process your personal information for a variety of reasons, depending on how you interact with our Services, including:"
      },
      {
        "type": "list",
        "items": [
          "To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order.",
          "To deliver and facilitate delivery of services to the user. We may process your information to provide you with the requested service.",
          "To respond to user inquiries/offer support to users. We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.",
          "To send administrative information to you. We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.",
          "To request feedback. We may process your information when necessary to request feedback and to contact you about your use of our Services.",
          "To send you marketing and promotional communications. We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see \"WHAT ARE YOUR PRIVACY RIGHTS?\" below.",
          "To protect our Services. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.",
          "To identify usage trends. We may process information about how you use our Services to better understand how they are being used so we can improve them.",
          "To determine the effectiveness of our marketing and promotional campaigns. We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.",
          "To save or protect an individual's vital interest. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm."
        ]
      }
    ]
  },
  {
    "id": "legal-bases",
    "title": "3. What legal bases do we rely on to process your information?",
    "inShort": "We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.",
    "blocks": [
      {
        "type": "p",
        "text": "If you are located in the EU or UK, this section applies to you."
      },
      {
        "type": "p",
        "text": "The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:"
      },
      {
        "type": "list",
        "items": [
          "Consent. We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about withdrawing your consent.",
          "Performance of a Contract. We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you.",
          "Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:",
          "Send users information about special offers and discounts on our products and services",
          "Analyze how our Services are used so we can improve them to engage and retain users",
          "Support our marketing activities",
          "Diagnose problems and/or prevent fraudulent activities",
          "Understand how our users use our products and services so we can improve user experience",
          "Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.",
          "Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person."
        ]
      },
      {
        "type": "p",
        "text": "If you are located in Canada, this section applies to you."
      },
      {
        "type": "p",
        "text": "We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time."
      },
      {
        "type": "p",
        "text": "In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:"
      },
      {
        "type": "list",
        "items": [
          "If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way",
          "For investigations and fraud detection and prevention",
          "For business transactions provided certain conditions are met",
          "If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim",
          "For identifying injured, ill, or deceased persons and communicating with next of kin",
          "If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse",
          "If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province",
          "If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records",
          "If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced",
          "If the collection is solely for journalistic, artistic, or literary purposes",
          "If the information is publicly available and is specified by the regulations",
          "We may disclose de-identified information for approved research or statistics projects, subject to ethics oversight and confidentiality commitments"
        ]
      }
    ]
  },
  {
    "id": "sharing",
    "title": "4. When and with whom do we share your personal information?",
    "inShort": "We may share information in specific situations described in this section and/or with the following third parties.",
    "blocks": [
      {
        "type": "p",
        "text": "We may need to share your personal information in the following situations:"
      },
      {
        "type": "list",
        "items": [
          "Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.",
          "Business Partners. We may share your information with our business partners to offer you certain products, services, or promotions."
        ]
      }
    ]
  },
  {
    "id": "cookies",
    "title": "5. Do we use cookies and other tracking technologies?",
    "inShort": "We may use cookies and other tracking technologies to collect and store your information.",
    "blocks": [
      {
        "type": "p",
        "text": "We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions."
      },
      {
        "type": "p",
        "text": "We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites."
      },
      {
        "type": "p",
        "text": "To the extent these online tracking technologies are deemed to be a \"sale\"/\"sharing\" (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section \"DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?\""
      },
      {
        "type": "p",
        "text": "Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice."
      }
    ]
  },
  {
    "id": "ai-products",
    "title": "6. Do we offer artificial intelligence-based products?",
    "inShort": "We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.",
    "blocks": [
      {
        "type": "p",
        "text": "As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, \"AI Products\"). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the AI Products within our Services."
      },
      {
        "type": "p",
        "text": "Use of AI Technologies"
      },
      {
        "type": "p",
        "text": "We provide the AI Products through third-party service providers (\"AI Service Providers\"), including Anthropic. As outlined in this Privacy Notice, your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products for purposes outlined in \"WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?\" You must not use the AI Products in any way that violates the terms or policies of any AI Service Provider."
      },
      {
        "type": "p",
        "text": "Our AI Products"
      },
      {
        "type": "p",
        "text": "Our AI Products are designed for the following functions:"
      },
      {
        "type": "list",
        "items": [
          "AI bots"
        ]
      },
      {
        "type": "p",
        "text": "How We Process Your Data Using AI"
      },
      {
        "type": "p",
        "text": "All personal information processed using our AI Products is handled in line with our Privacy Notice and our agreement with third parties. This ensures high security and safeguards your personal information throughout the process, giving you peace of mind about your data's safety."
      },
      {
        "type": "p",
        "text": "How to Opt Out"
      },
      {
        "type": "p",
        "text": "We believe in giving you the power to decide how your data is used. To opt out, you can:"
      },
      {
        "type": "list",
        "items": [
          "Contact us using the contact information provided"
        ]
      }
    ]
  },
  {
    "id": "social-logins",
    "title": "7. How do we handle your social logins?",
    "inShort": "If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.",
    "blocks": [
      {
        "type": "p",
        "text": "Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform."
      },
      {
        "type": "p",
        "text": "We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps."
      }
    ]
  },
  {
    "id": "retention",
    "title": "8. How long do we keep your information?",
    "inShort": "We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.",
    "blocks": [
      {
        "type": "p",
        "text": "We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than three (3) months past the termination of the user's account."
      },
      {
        "type": "p",
        "text": "When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible."
      }
    ]
  },
  {
    "id": "security",
    "title": "9. How do we keep your information safe?",
    "inShort": "We aim to protect your personal information through a system of organizational and technical security measures.",
    "blocks": [
      {
        "type": "p",
        "text": "We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment."
      }
    ]
  },
  {
    "id": "privacy-rights",
    "title": "10. What are your privacy rights?",
    "inShort": "Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.",
    "blocks": [
      {
        "type": "p",
        "text": "In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. If a decision that produces legal or similarly significant effects is made solely by automated means, we will inform you, explain the main factors, and offer a simple way to request human review. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section \"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?\" below."
      },
      {
        "type": "p",
        "text": "We will consider and act upon any request in accordance with applicable data protection laws."
      },
      {
        "type": "p",
        "text": "If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority."
      },
      {
        "type": "p",
        "text": "If you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner."
      },
      {
        "type": "p",
        "text": "Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section \"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?\" below or updating your preferences."
      },
      {
        "type": "p",
        "text": "However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent."
      },
      {
        "type": "p",
        "text": "Opting out of marketing and promotional communications: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section \"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?\" below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes."
      },
      {
        "type": "h3",
        "text": "Account Information"
      },
      {
        "type": "p",
        "text": "If you would at any time like to review or change the information in your account or terminate your account, you can:"
      },
      {
        "type": "list",
        "items": [
          "Log in to your account settings and update your user account."
        ]
      },
      {
        "type": "p",
        "text": "Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements."
      },
      {
        "type": "p",
        "text": "Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services."
      },
      {
        "type": "p",
        "text": "If you have questions or comments about your privacy rights, you may email us at info@writidian.com."
      }
    ]
  },
  {
    "id": "do-not-track",
    "title": "11. Controls for do-not-track features",
    "inShort": null,
    "blocks": [
      {
        "type": "p",
        "text": "Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (\"DNT\") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice."
      },
      {
        "type": "p",
        "text": "California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time."
      },
      {
        "type": "p",
        "text": "Global Privacy Control: We recognize and honor Global Privacy Control (GPC) signals. If you use a browser or extension that supports GPC, we will treat this as a valid request to opt out of the sale or sharing of your personal information for targeted advertising purposes under applicable state privacy laws, including the California Consumer Privacy Act (CCPA). When we detect a GPC signal from your browser, we will automatically apply your opt-out preference without requiring you to take any additional action. For more information about GPC and how to enable it, visit globalprivacycontrol.org."
      }
    ]
  },
  {
    "id": "us-residents",
    "title": "12. Do United States residents have specific privacy rights?",
    "inShort": "If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.",
    "blocks": [
      {
        "type": "h3",
        "text": "Categories of Personal Information We Collect"
      },
      {
        "type": "p",
        "text": "The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section \"WHAT INFORMATION DO WE COLLECT?\""
      },
      {
        "type": "table",
        "headers": [
          "Category",
          "Examples",
          "Collected"
        ],
        "rows": [
          {
            "category": "A. Identifiers",
            "examples": "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name",
            "collected": "NO"
          },
          {
            "category": "B. Personal information as defined in the California Customer Records statute",
            "examples": "Name, contact information, education, employment, employment history, and financial information",
            "collected": "NO"
          },
          {
            "category": "C. Protected classification characteristics under state or federal law",
            "examples": "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data",
            "collected": "NO"
          },
          {
            "category": "D. Commercial information",
            "examples": "Transaction information, purchase history, financial details, and payment information",
            "collected": "NO"
          },
          {
            "category": "E. Biometric information",
            "examples": "Fingerprints and voiceprints",
            "collected": "NO"
          },
          {
            "category": "F. Internet or other similar network activity",
            "examples": "Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements",
            "collected": "NO"
          },
          {
            "category": "G. Geolocation data",
            "examples": "Device location",
            "collected": "NO"
          },
          {
            "category": "H. Audio, electronic, sensory, or similar information",
            "examples": "Images and audio, video or call recordings created in connection with our business activities",
            "collected": "NO"
          },
          {
            "category": "I. Professional or employment-related information",
            "examples": "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us",
            "collected": "NO"
          },
          {
            "category": "J. Education Information",
            "examples": "Student records and directory information",
            "collected": "NO"
          },
          {
            "category": "K. Inferences drawn from collected personal information",
            "examples": "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics",
            "collected": "NO"
          },
          {
            "category": "L. Sensitive personal Information",
            "examples": "",
            "collected": "NO"
          }
        ]
      },
      {
        "type": "p",
        "text": "We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:"
      },
      {
        "type": "list",
        "items": [
          "Receiving help through our customer support channels;",
          "Participation in customer surveys or contests; and",
          "Facilitation in the delivery of our Services and to respond to your inquiries."
        ]
      },
      {
        "type": "h3",
        "text": "Sources of Personal Information"
      },
      {
        "type": "p",
        "text": "Learn more about the sources of personal information we collect in \"WHAT INFORMATION DO WE COLLECT?\""
      },
      {
        "type": "h3",
        "text": "How We Use and Share Personal Information"
      },
      {
        "type": "p",
        "text": "Learn more about how we use your personal information in the section, \"HOW DO WE PROCESS YOUR INFORMATION?\""
      },
      {
        "type": "p",
        "text": "Will your information be shared with anyone else?"
      },
      {
        "type": "p",
        "text": "We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, \"WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?\""
      },
      {
        "type": "p",
        "text": "We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be \"selling\" of your personal information."
      },
      {
        "type": "p",
        "text": "We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers."
      },
      {
        "type": "h3",
        "text": "Your Rights"
      },
      {
        "type": "p",
        "text": "You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:"
      },
      {
        "type": "list",
        "items": [
          "Right to know whether or not we are processing your personal data",
          "Right to access your personal data",
          "Right to correct inaccuracies in your personal data",
          "Right to request the deletion of your personal data",
          "Right to obtain a copy of the personal data you previously shared with us",
          "Right to non-discrimination for exercising your rights",
          "Right to opt out of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California’s privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (\"profiling\")"
        ]
      },
      {
        "type": "p",
        "text": "Depending upon the state where you live, you may also have the following rights:"
      },
      {
        "type": "list",
        "items": [
          "Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)",
          "Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)",
          "Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)",
          "Right to obtain a list of third parties to which we have sold personal data (as permitted by applicable law, including the privacy law in Connecticut)",
          "Right to review, understand, question, and depending on where you live, correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Connecticut and Minnesota)",
          "Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)",
          "Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)"
        ]
      },
      {
        "type": "h3",
        "text": "How to Exercise Your Rights"
      },
      {
        "type": "p",
        "text": "To exercise these rights, you can contact us by submitting a data subject access request, by emailing us at info@writidian.com, or by referring to the contact details at the bottom of this document."
      },
      {
        "type": "p",
        "text": "We will honor your opt-out preferences if you enact the Global Privacy Control (GPC) opt-out signal on your browser."
      },
      {
        "type": "p",
        "text": "Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws."
      },
      {
        "type": "h3",
        "text": "Request Verification"
      },
      {
        "type": "p",
        "text": "Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes."
      },
      {
        "type": "p",
        "text": "If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf."
      },
      {
        "type": "h3",
        "text": "Appeals"
      },
      {
        "type": "p",
        "text": "Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at info@writidian.com. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general."
      },
      {
        "type": "h3",
        "text": "California \"Shine The Light\" Law"
      },
      {
        "type": "p",
        "text": "California Civil Code Section 1798.83, also known as the \"Shine The Light\" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section \"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?\""
      }
    ]
  },
  {
    "id": "other-regions",
    "title": "13. Do other regions have specific privacy rights?",
    "inShort": "You may have additional rights based on the country you reside in.",
    "blocks": [
      {
        "type": "h3",
        "text": "Australia and New Zealand"
      },
      {
        "type": "p",
        "text": "We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act)."
      },
      {
        "type": "p",
        "text": "This Privacy Notice satisfies the notice requirements defined in both Privacy Acts, in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information."
      },
      {
        "type": "p",
        "text": "If you do not wish to provide the personal information necessary to fulfill their applicable purpose, it may affect our ability to provide our services, in particular:"
      },
      {
        "type": "list",
        "items": [
          "offer you the products or services that you want",
          "respond to or help with your requests",
          "manage your account with us",
          "confirm your identity and protect your account"
        ]
      },
      {
        "type": "p",
        "text": "At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section \"HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?\""
      },
      {
        "type": "p",
        "text": "If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the Office of the Australian Information Commissioner and a breach of New Zealand's Privacy Principles to the Office of New Zealand Privacy Commissioner."
      },
      {
        "type": "h3",
        "text": "Republic of South Africa"
      },
      {
        "type": "p",
        "text": "At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section \"HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?\""
      },
      {
        "type": "p",
        "text": "If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:"
      },
      {
        "type": "p",
        "text": "The Information Regulator (South Africa) General enquiries: enquiries@inforegulator.org.za Complaints (complete POPIA/PAIA form 5): PAIAComplaints@inforegulator.org.za & POPIAComplaints@inforegulator.org.za"
      }
    ]
  },
  {
    "id": "updates",
    "title": "14. Do we make updates to this notice?",
    "inShort": "Yes, we will update this notice as necessary to stay compliant with relevant laws.",
    "blocks": [
      {
        "type": "p",
        "text": "We may update this Privacy Notice from time to time. The updated version will be indicated by an updated \"Revised\" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information."
      }
    ]
  },
  {
    "id": "contact",
    "title": "15. How can you contact us about this notice?",
    "inShort": null,
    "blocks": [
      {
        "type": "p",
        "text": "If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO) by email at info@writidian.com."
      },
      {
        "type": "p",
        "text": "Writidian LLC Data Protection Officer"
      }
    ]
  },
  {
    "id": "review-update-delete",
    "title": "16. How can you review, update, or delete the data we collect from you?",
    "inShort": null,
    "blocks": [
      {
        "type": "p",
        "text": "Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a data subject access request."
      }
    ]
  }
] as PrivacySection[],
} as const;
