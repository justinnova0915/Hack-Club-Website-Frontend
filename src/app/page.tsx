"use client";

//trigger redeployment
import { useEffect, useState } from "react";
import "./globals.css";
import Link from "next/link";
import Spline from "@splinetool/react-spline";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight,
  Folder,
  Code,
  Gamepad,
  Cpu,
  Users,
  Rocket,
  Lightbulb,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  body {
    font-family: 'Inter', sans-serif;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in-down {
    animation: fadeInDown 1s ease-out forwards;
  }

  .gradient-text {
    background: linear-gradient(90deg, #6366F1, #3B82F6, #1E3A8A); /* Updated to use only blue shades */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedLearnSection, setSelectedLearnSection] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const CUSTOM_BREAKPOINT = 870;
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= CUSTOM_BREAKPOINT);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const learnSections = [
    {
      title: "Web Development",
      icon: Code,
      content: `Ever wonder how websites like this are made? You'll learn how to structure content with HTML, make it beautiful with CSS, and add interactivity with JavaScript. No prior experience is needed! We'll start by building a simple interactive button and then progress to modern frameworks like React, Tailwind, and Next.js so you can build dynamic, powerful web applications.`,
      bullets: [
        "React fundamentals",
        "Interactive front-end development",
        "Modern frameworks like React & Next.js",
      ],
    },
    {
      title: "Game Development",
      icon: Gamepad,
      content: `Ready to build your own adventure? This unit is all about creating games from the ground up. We'll explore core concepts like game loops, player movement, and collision detection. We'll use the Godot engine to bring your game ideas to life, whether it's 2D platformers or 3D worlds.`,
      bullets: [
        "Game loops & collision detection",
        "Player movement and mechanics",
        "Game design with the Godot engine",
      ],
    },
    {
      title: "AI with PyTorch",
      icon: Cpu,
      content: `Dive into the world of artificial intelligence and machine learning. You'll learn to build and train neural networks using the powerful PyTorch library. We'll cover everything from data processing to deploying your own models for tasks like image recognition and natural language processing.`,
      bullets: [
        "Fundamentals of machine learning",
        "Building neural networks with PyTorch",
        "Data processing and model deployment",
      ],
    },
  ];

  const faqs = [
    {
      question: "Do I need to have prior coding experience?",
      answer:
        "Absolutely not! Our club is open to all skill levels. We provide resources and support to help everyone learn and grow, regardless of your background.",
    },
    {
      question: "What kind of projects do you work on?",
      answer:
        "We work on a wide variety of projects, including websites, games, AI, and more. You're encouraged to bring your own ideas and build something you're passionate about!",
    },
    {
      question: "How often do you meet?",
      answer:
        "We meet twice a week after school, with one day dedicated to hardware tracks and another to software. Contact us for the exact days and times.",
    },
    {
      question: "Do I need to bring my own computer?",
      answer:
        "Bringing your own laptop is highly encouraged as it gives you the most control over your tools and projects. However, it is not required—we have computers and equipment available at the club for anyone who needs to use them.",
    },
  ];

  const mentors = [
    {
      name: "Jad Menkara",
      title: "Club President",
      grade: "12th Grade",
      bio: "[placeholder bio for Jad Menkara]",
      image: "https://placehold.co/150x150/2d3748/ffffff?text=Mentor+1",
    },
    {
      name: "NeelDave",
      title: "Club Co-President",
      grade: "11th Grade",
      bio: "[placeholder bio for Neel Dave]",
      image: "https://placehold.co/150x150/2d3748/ffffff?text=Mentor+2",
    },
    {
      name: "Justin Li",
      title: "Software Mentor",
      grade: "10th Grade",
      bio: "An expert in PyTorch, web dev, and game development. Justin loves to make websites using react and next.js like this one!",
      image: "https://placehold.co/150x150/2d3748/ffffff?text=Mentor+3",
    },
    {
      name: "Ricky Liu",
      title: "[placeholder title for Ricky Liu]",
      grade: "12th Grade",
      bio: "[placeholder bio for Ricky Liu]",
      image: "https://placehold.co/150x150/2d3748/ffffff?text=Mentor+4",
    },
    {
      name: "James Feng",
      title: "[placeholder title for James Feng]",
      grade: "12th Grade",
      bio: "[placeholder bio for James Feng]",
      image: "https://placehold.co/150x150/2d3748/ffffff?text=Mentor+5",
    },
  ];

  const president = mentors[0];
  const firstMentorRow = mentors.slice(1, 3);
  const secondMentorRow = mentors.slice(3, 5);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[var(--color-accent-blue)] border-t-transparent"></div>
      </div>
    );
  }

  const SplineAnimation = () => {

    useEffect(() => {
      const userAgent = navigator.userAgent;

      // Use a single, comprehensive regex for mobile detection.
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

      if (mobileRegex.test(userAgent)) {
        setIsMobile(true);
      }
    }, []);

    if (isMobile) {
      return (
        <img
          src="/images/spline-static.png"
          alt="A static image for the hack club landing page"
          style={{ height: '100%', width: 'auto', objectFit: "cover", filter: 'brightness(0.6)' }}
        />
      );
    }

    return 1
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)] flex flex-col relative">
      <main className="flex-grow">
        <section className="relative min-h-screen flex overflow-hidden pt-32 pb-16">
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <SplineAnimation />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full text-left px-8 md:px-16"
          >
            <div className="p-4 md:p-16">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-black text-white leading-tight mb-4"
              >
                Welcome to <span className={isMobile ? "text-white" : "gradient-text"}>Hack Club VMSS</span>
                !
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-white mb-10 max-w-4xl"
              >
                Our Hack Club VMSS is a community of hackers and builders. We
                meet weekly to learn new skills, build projects, and have fun.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col md:flex-row justify-start items-start space-y-4 md:space-y-0 md:space-x-4"
              >
                <Link
                  href="/signup"
                  className="bg-[var(--color-accent-blue)] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Get Started - Sign Up!
                </Link>
                <Link
                  href="#learn"
                  className="bg-[var(--color-secondary-dark)] hover:bg-gray-700 text-gray-300 font-bold py-3 px-6 rounded-full text-lg transition duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center"
                >
                  Learn More
                  <ChevronRight size={24} className="ml-2" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
        <section
          id="about"
          className="py-20 md:py-32 bg-[var(--color-secondary-dark)] text-[var(--color-primary-light)]"
        >
          <div className="max-w-8xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-16 items-center">
              <div className="text-center 2xl:text-left 2xl:order-2">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-extrabold mb-8 text-[var(--color-primary-light)]"
                >
                  Who We Are
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg md:text-xl text-gray-400 mb-8 max-w-4xl mx-auto 2xl:mx-0"
                >
                  We are the local Hack Club VMSS chapter at Vincent Massey
                  Secondary School. We're a part of the global Hack Club
                  community, a worldwide nonprofit that supports high schoolers
                  learning to code by connecting them with a global network of
                  peers and resources. We provide a space for you to explore
                  technology, build amazing things, and make new friends along
                  the way.
                </motion.p>

                <div className="2xl:hidden flex justify-center items-center my-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="rounded-2xl shadow-2xl border-4 border-gray-700"
                  >
                    <Image
                      src="/images/group.jpg"
                      alt="A group photo of Hack Club VMSS members from last year."
                      width={1000}
                      height={600}
                      className="rounded-xl w-full h-auto"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-[var(--color-primary-dark)] rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 flex flex-col items-center"
                  >
                    <Users
                      size={64}
                      className="text-[var(--color-accent-blue)] mb-6"
                    />
                    <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary-light)]">
                      Community
                    </h3>
                    <p className="text-gray-400 text-base">
                      Join a community of like-minded students who love to build
                      and create.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-[var(--color-primary-dark)] rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 flex flex-col items-center"
                  >
                    <Rocket size={64} className="text-blue-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary-light)]">
                      Projects
                    </h3>
                    <p className="text-gray-400 text-base">
                      Work on fun and impactful projects, from websites to games
                      and mobile apps.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-[var(--color-primary-dark)] rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 flex flex-col items-center"
                  >
                    <Lightbulb size={64} className="text-blue-400 mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary-light)]">
                      Learn
                    </h3>
                    <p className="text-gray-400 text-base">
                      Gain hands-on experience and learn from experienced
                      mentors and peers.
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="hidden 2xl:flex 2xl:order-1 justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="rounded-2xl shadow-2xl border-4 border-gray-700"
                >
                  <Image
                    src="/images/group.jpg"
                    alt="A group photo of Hack Club VMSS members from last year."
                    width={1000}
                    height={600}
                    className="rounded-xl w-full h-auto"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="learn"
          className="py-20 md:py-32 bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]"
        >
          <div className="container mx-auto px-8 md:px-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-12"
            >
              What You'll Learn
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-gray-400 mb-16 max-w-4xl mx-auto"
            >
              We'll dive into a variety of topics, all designed to give you the
              skills you need to build anything you can imagine.
            </motion.p>

            <div className="max-w-6xl mx-auto bg-[var(--color-secondary-dark)] rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
              <div className="flex flex-col md:flex-row p-4 border-b border-gray-700">
                <div className="flex space-x-2 mb-4 md:mb-0">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 ml-0 md:ml-8">
                  {learnSections.map((section, index) => {
                    const Icon = section.icon;
                    const isSelected = selectedLearnSection === index;
                    return (
                      <button
                        key={index}
                        className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${isSelected ? "bg-[var(--color-accent-blue)] text-white transform scale-105 shadow-md" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setSelectedLearnSection(index)}
                      >
                        <Icon size={20} className="mr-2" />
                        <span className="text-lg font-medium">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedLearnSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 text-left"
                >
                  <h3 className="text-3xl font-bold mb-4 text-[var(--color-accent-blue)]">
                    {learnSections[selectedLearnSection].title}
                  </h3>
                  <p className="text-gray-300 text-lg mb-6">
                    {learnSections[selectedLearnSection].content}
                  </p>
                  <ul className="space-y-4">
                    {learnSections[selectedLearnSection].bullets.map(
                      (bullet, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-400 text-base"
                        >
                          <ChevronRight
                            size={24}
                            className="text-blue-500 mr-3 mt-1"
                          />
                          <span>{bullet}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
        <section
          id="faq"
          className="py-20 md:py-32 bg-[var(--color-secondary-dark)] text-[var(--color-primary-light)]"
        >
          <div className="container mx-auto px-8 md:px-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-12 text-[var(--color-primary-light)]"
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="max-w-6xl mx-auto space-y-6 text-left">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[var(--color-primary-dark)] rounded-2xl shadow-xl border border-gray-700 overflow-hidden"
                >
                  <button
                    className="w-full text-left p-6 font-semibold text-lg md:text-xl text-[var(--color-primary-light)] flex justify-between items-center"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`text-[var(--color-accent-blue)] transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <p className="p-6 pt-0 text-gray-400 text-base">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="mentors"
          className="py-20 md:py-32 bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]"
        >
          <div className="container mx-auto px-8 md:px-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-12 text-[var(--color-primary-light)]"
            >
              Meet Our Mentors
            </motion.h2>
            <div className="max-w-xs mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-[var(--color-secondary-dark)] rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700"
              >
                <img
                  src={president.image}
                  alt={president.name}
                  className="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-4 border-[var(--color-accent-blue)]"
                />
                <h3 className="text-xl font-bold mb-1 text-[var(--color-primary-light)]">
                  {president.name}
                </h3>
                <p className="text-gray-400 text-base">{president.title}</p>
                <p className="text-gray-400 text-base mb-2">
                  {president.grade}
                </p>
                <p className="text-gray-500 text-sm">{president.bio}</p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-12">
              {firstMentorRow.map((mentor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-[var(--color-secondary-dark)] rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700"
                >
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-4 border-[var(--color-accent-blue)]"
                  />
                  <h3 className="text-xl font-bold mb-1 text-[var(--color-primary-light)]">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-400 text-base">{mentor.title}</p>
                  <p className="text-gray-400 text-base mb-2">{mentor.grade}</p>
                  <p className="text-gray-500 text-sm">{mentor.bio}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {secondMentorRow.map((mentor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-[var(--color-secondary-dark)] rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700"
                >
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-4 border-[var(--color-accent-blue)]"
                  />
                  <h3 className="text-xl font-bold mb-1 text-[var(--color-primary-light)]">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-400 text-base">{mentor.title}</p>
                  <p className="text-gray-400 text-base mb-2">{mentor.grade}</p>
                  <p className="text-gray-500 text-sm">{mentor.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[var(--color-secondary-dark)] text-center p-8 text-gray-400">
        <div className="container mx-auto">
          <p className="text-lg mb-2">
            &copy; 2025 Hack Club VMSS. All rights reserved.
          </p>
          <p className="text-base mb-4">Made with ❤️ by Justin Li</p>
          <Link
            href="/contact"
            className="text-lg text-[var(--color-accent-blue)] hover:underline transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
