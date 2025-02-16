// Home/Footer.jsx
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: <FaLinkedin className="w-5 h-5" />
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: <FaTwitter className="w-5 h-5" />
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: <FaGithub className="w-5 h-5" />
    },
    {
      name: 'Discord',
      url: 'https://discord.com',
      icon: <FaDiscord className="w-5 h-5" />
    }
  ];

  const quickLinks = [
    {
      name: 'About Us',
      url: '/about'
    },
    {
      name: 'Solutions',
      url: '/solutions'
    },
    {
      name: 'Careers',
      url: '/careers'
    },
    {
      name: 'Contact',
      url: '/contact'
    }
  ];

  return (
    <footer className="bg-gray-50 dark:bg-black py-16 border-t border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-light text-gray-900 dark:text-white">Nexus AI</h3>
            <p className="text-gray-600 dark:text-gray-300">Shaping the future of automation</p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.url}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact</h4>
            <address className="not-italic space-y-2 text-gray-600 dark:text-gray-300">
              <p>123 Innovation Drive</p>
              <p>Silicon Valley, CA 94025</p>
              <a 
                href="mailto:contact@nexusai.com"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                contact@nexusai.com
              </a>
              <p>+1 (555) 123-4567</p>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Stay Updated</h4>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 
                         border border-gray-300 dark:border-gray-700 
                         text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 dark:hover:bg-blue-500 
                         transition-colors focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 
                         dark:focus:ring-offset-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Nexus AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
