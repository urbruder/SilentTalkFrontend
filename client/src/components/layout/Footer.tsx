import { Link } from "wouter";
import { MessageSquare, Twitter, Facebook, Instagram, Github } from "lucide-react";

const footerLinks = {
  features: [
    { label: "Sign Language", href: "/sign-language" },
    { label: "Speech-to-Text", href: "/speech-to-text" },
    { label: "Text-to-Speech", href: "/text-to-speech" },
    { label: "Live Chat", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, label: "Twitter" },
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Github, label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <MessageSquare className="h-6 w-6" />
              SilentTalk
            </div>
            <p className="text-gray-300 text-sm">
              Breaking communication barriers through innovative technology.
            </p>
            <div className="mt-4 flex space-x-6">
              {socialLinks.map((link) => (
                <a 
                  key={link.label}
                  href="#" 
                  className="text-gray-400 hover:text-white"
                  aria-label={link.label}
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Features</h3>
            <ul role="list" className="mt-4 space-y-4">
              {footerLinks.features.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h3>
            <ul role="list" className="mt-4 space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-base text-gray-300 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
            <ul role="list" className="mt-4 space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-base text-gray-300 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} SilentTalk, Inc. All rights reserved.</p>
          <p className="text-base text-gray-400 mt-4 md:mt-0">Designed with ❤️ for accessibility</p>
        </div>
      </div>
    </footer>
  );
}
