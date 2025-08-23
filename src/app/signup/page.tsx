"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  AtSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  ClipboardList,
  GraduationCap,
  Code,
  Lightbulb,
  Send,
} from "lucide-react";
import { sendEmail } from "@/utils/email";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [webDevSkill, setWebDevSkill] = useState("");
  const [gameDevSkill, setGameDevSkill] = useState("");
  const [aiSkill, setAiSkill] = useState("");

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [step, setStep] = useState(1);
  const [animationDirection, setAnimationDirection] = useState("forward");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [skillLevelError, setSkillLevelError] = useState("");
  const [webDevSkillError, setWebDevSkillError] = useState("");
  const [gameDevSkillError, setGameDevSkillError] = useState("");
  const [aiSkillError, setAiSkillError] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalMessages, setTerminalMessages] = useState<string[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [finalMessage, setFinalMessage] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const { signUp, user } = useAuth();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      console.log("User is logged in and verified, redirecting to dashboard.");
      router.push("/dashboard");
    }
  }, [user, router]);

  const formRef = useRef<HTMLDivElement>(null);

  // Scroll to top of form on step change
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // Regex for email validation
  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Field validation handler
  const handleValidation = (field: string) => {
    switch (field) {
      case "firstName":
        setFirstNameError(
          firstName.trim() === "" ? "First name is required." : "",
        );
        break;
      case "lastName":
        setLastNameError(
          lastName.trim() === "" ? "Last name is required." : "",
        );
        break;
      case "email":
        setEmailError(
          email.trim() === "" || !validateEmail(email)
            ? "Please enter a valid email address."
            : "",
        );
        break;
      case "username":
        setUsernameError(
          username.trim() === "" ? "A username is required." : "",
        );
        break;
      case "password":
        setPasswordError(
          password.length < 8
            ? "Password must be at least 8 characters long."
            : "",
        );
        break;
      case "confirmPassword":
        setConfirmPasswordError(
          confirmPassword !== password ? "Passwords do not match." : "",
        );
        break;
      case "grade":
        setGradeError(grade.trim() === "" ? "Your grade is required." : "");
        break;
      case "skillLevel":
        setSkillLevelError(
          skillLevel.trim() === "" ? "Your skill level is required." : "",
        );
        break;
      case "webDevSkill":
        setWebDevSkillError(
          webDevSkill.trim() === "" ? "This field is required." : "",
        );
        break;
      case "gameDevSkill":
        setGameDevSkillError(
          gameDevSkill.trim() === "" ? "This field is required." : "",
        );
        break;
      case "aiSkill":
        setAiSkillError(aiSkill.trim() === "" ? "This field is required." : "");
        break;
      default:
        break;
    }
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (step) {
      case 1:
        return firstName.trim() !== "" && lastName.trim() !== "";
      case 2:
        return email.trim() !== "" && validateEmail(email);
      case 3:
        return username.trim() !== "";
      case 4:
        return (
          password.trim() !== "" &&
          confirmPassword.trim() !== "" &&
          password === confirmPassword &&
          password.length >= 8
        );
      case 5:
        return grade.trim() !== "" && skillLevel.trim() !== "";
      case 6:
        // Updated validation for new skill fields
        return (
          webDevSkill.trim() !== "" &&
          gameDevSkill.trim() !== "" &&
          aiSkill.trim() !== ""
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    setError(null);
    if (isStepValid()) {
      setAnimationDirection("forward");
      setStep(step + 1);
    } else {
      switch (step) {
        case 1:
          handleValidation("firstName");
          handleValidation("lastName");
          break;
        case 2:
          handleValidation("email");
          break;
        case 3:
          handleValidation("username");
          break;
        case 4:
          handleValidation("password");
          handleValidation("confirmPassword");
          break;
        case 5:
          handleValidation("grade");
          handleValidation("skillLevel");
          break;
        case 6:
          // Updated validation calls for new skill fields
          handleValidation("webDevSkill");
          handleValidation("gameDevSkill");
          handleValidation("aiSkill");
          break;
        default:
          break;
      }
      setError("Please fill in all required fields correctly to continue.");
    }
  };

  const handlePrev = () => {
    setError(null);
    setAnimationDirection("backward");
    setStep(step - 1);
  };

  // Terminal compilation steps for animation
  const compilationSteps = useMemo(
    () => [
      "> Initializing Hack Club registration protocols...",
      "> Verifying credentials... [ OK ]",
      `> Compiling user profile '${username.toLowerCase()}.hcu'...`,
      "> Establishing secure connection to Hack Club central registry...",
      "> Creating new user document ... [ SUCCESS ]",
      "> Assigning Hack Club ID: HC-7392-L5B...",
      "> Sending verification email to your address...",
      "> Registration complete. Please check your inbox to verify your account.",
    ],
    [username],
  );

  // Cleanup for timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Typewriter effect for terminal animation
  useEffect(() => {
    if (showTerminal) {
      let messageIndex = 0;
      let charIndex = 0;

      const typeWriterEffect = () => {
        if (messageIndex < compilationSteps.length) {
          if (charIndex < compilationSteps[messageIndex].length) {
            setTypedMessage(
              (prev) => prev + compilationSteps[messageIndex].charAt(charIndex),
            );
            charIndex++;
            timeoutRef.current = setTimeout(typeWriterEffect, 10);
          } else {
            setTerminalMessages((prev) => [
              ...prev,
              compilationSteps[messageIndex],
            ]);
            setTypedMessage("");
            messageIndex++;
            charIndex = 0;
            timeoutRef.current = setTimeout(typeWriterEffect, 1000);
          }
        } else {
          setIsAnimationComplete(true);
          setFinalMessage(
            "Please check your email to verify your account and complete your registration. You can close this window.",
          );
          console.log("Terminal animation completed");
        }
      };
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setTerminalMessages([]);
      setTypedMessage("");
      setIsAnimationComplete(false);
      typeWriterEffect();
    }
  }, [showTerminal, compilationSteps]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup process started");
    setError(null);
    setSuccess(null);
    setFinalMessage(null);

    if (!agreeToTerms) {
      setError("You must agree to the Code of Conduct.");
      console.error("User did not agree to terms");
      return;
    }

    setIsProcessing(true);
    setShowTerminal(true);

    try {
      console.log("Calling signUp function");
      // Passing new skill states to the signUp function
      await signUp(
        email,
        password,
        username,
        firstName,
        lastName,
        grade,
        skillLevel,
        { webDevSkill, gameDevSkill, aiSkill },
      );
      console.log("signUp function completed successfully");

      // Call the sendEmail function to send a welcome email
      setIsSendingEmail(true);
      console.log("Attempting to send welcome email...");
      const emailSent = await sendEmail("welcome", {
        email: email,
        name: firstName,
      });

      if (emailSent) {
        console.log("Welcome email sent successfully.");
      } else {
        console.error("Failed to send welcome email.");
      }
      setIsSendingEmail(false);
    } catch (err: any) {
      console.error("Error during signup:", err.message);
      setError(err.message);
      setShowTerminal(false);
      setIsProcessing(false);
    }
  };

  if (user) {
    return null;
  }

  const steps = [
    {
      id: 1,
      name: "Your Name",
      description: "Just a simple introduction.",
      icon: User,
    },
    {
      id: 2,
      name: "Email Address",
      description: "So we can stay in touch.",
      icon: Mail,
    },
    {
      id: 3,
      name: "Choose a Username",
      description: "Your unique identifier.",
      icon: AtSign,
    },
    {
      id: 4,
      name: "Create a Password",
      description: "Keep your account secure.",
      icon: Lock,
    },
    {
      id: 5,
      name: "Academic Info",
      description: "Tell us a bit about your school.",
      icon: GraduationCap,
    },
    {
      id: 6,
      name: "Skills & Interests",
      description: "What you know and want to learn.",
      icon: ClipboardList,
    },
    {
      id: 7,
      name: "Final Step",
      description: "Agree and complete registration.",
      icon: Send,
    },
  ];

  const skillOptions = [
    { value: "", label: "Select your proficiency" },
    { value: "no idea", label: "No idea what that is" },
    { value: "beginner", label: "I'm a beginner" },
    { value: "intermediate", label: "I know some basics" },
    { value: "proficient", label: "I'm proficient" },
    { value: "expert", label: "I am an expert" },
    { value: "master", label: "I have mastered it" },
  ];

  const renderProgressColumn = () => (
    <div className="hidden lg:flex flex-col w-1/3 p-16 bg-gray-700 bg-opacity-70 border-r border-gray-600 rounded-bl-2xl">
      <ul className="space-y-8 flex-grow">
        {steps.map((s) => (
          <li
            key={s.id}
            className={`flex items-start transition-colors duration-300 ${step === s.id ? "text-white" : "text-gray-400"}`}
          >
            <div
              className={`mr-6 p-3 rounded-full border-2 transition-all duration-300 ${step > s.id ? "bg-indigo-500 border-indigo-500" : "bg-gray-800 border-gray-600"}`}
            >
              {step > s.id ? (
                <CheckCircle className="text-white" size={24} />
              ) : (
                <s.icon size={24} />
              )}
            </div>
            <div>
              <p
                className={`font-semibold text-xl transition-colors duration-300 ${step === s.id ? "text-white" : "text-gray-400"}`}
              >
                {s.name}
              </p>
              <p className="text-base text-gray-400">{s.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderTerminalContent = () => {
    return (
      <div className="flex-grow flex flex-col justify-end p-6 font-mono text-green-400 bg-gray-900 rounded-b-2xl border-b border-l border-r border-gray-700 shadow-inner overflow-y-auto">
        <div className="w-full">
          {terminalMessages.map((msg, index) => (
            <p
              key={index}
              className="mb-2 text-xl md:text-2xl animate-fade-in-up"
            >
              {msg}
            </p>
          ))}
          {typedMessage && (
            <p className="mb-2 text-xl md:text-2xl whitespace-pre-wrap">
              {typedMessage}
              <span className="animate-pulse-cursor">|</span>
            </p>
          )}
          {!isAnimationComplete && !typedMessage && (
            <p className="text-xl md:text-2xl">
              <span className="animate-pulse-cursor">|</span>
            </p>
          )}
          {finalMessage && (
            <p className="mt-4 text-xl md:text-2xl text-yellow-300 animate-fade-in-up">
              {finalMessage}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderFormContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-300">
              What do we call you?
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Let's start with your first and last name.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="relative">
                <label
                  className="block text-gray-300 text-lg font-semibold mb-3"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <div className="relative flex items-center">
                  <input
                    className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${firstNameError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                    id="firstName"
                    type="text"
                    placeholder="Ada"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => handleValidation("firstName")}
                    required
                  />
                  <User className="absolute left-5 text-gray-400" size={24} />
                </div>
                {firstNameError && (
                  <p className="text-red-400 text-sm italic mt-2">
                    {firstNameError}
                  </p>
                )}
              </div>
              <div className="relative">
                <label
                  className="block text-gray-300 text-lg font-semibold mb-3"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <div className="relative flex items-center">
                  <input
                    className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${lastNameError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                    id="lastName"
                    type="text"
                    placeholder="Lovelace"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={() => handleValidation("lastName")}
                    required
                  />
                  <User className="absolute left-5 text-gray-400" size={24} />
                </div>
                {lastNameError && (
                  <p className="text-red-400 text-sm italic mt-2">
                    {lastNameError}
                  </p>
                )}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-300">
              What's your email?
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              We'll use this to keep in touch with you.
            </p>
            <div className="relative mb-6">
              <label
                className="block text-gray-300 text-lg font-semibold mb-3"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${emailError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleValidation("email")}
                  required
                />
                <Mail className="absolute left-5 text-gray-400" size={24} />
              </div>
              {emailError && (
                <p className="text-red-400 text-sm italic mt-2">{emailError}</p>
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-300">
              Choose a username.
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              This is how you'll be known in the club.
            </p>
            <div className="relative mb-6">
              <label
                className="block text-gray-300 text-lg font-semibold mb-3"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${usernameError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                  id="username"
                  type="text"
                  placeholder="adalovelace"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleValidation("username")}
                  required
                />
                <AtSign className="absolute left-5 text-gray-400" size={24} />
              </div>
              {usernameError && (
                <p className="text-red-400 text-sm italic mt-2">
                  {usernameError}
                </p>
              )}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-300">
              Set up a secure password.
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Choose something strong and memorable.
            </p>
            <div className="mb-6 relative">
              <label
                className="block text-gray-300 text-lg font-semibold mb-3"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${passwordError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleValidation("password")}
                  required
                />
                <Lock className="absolute left-5 text-gray-400" size={24} />
                <div
                  className="absolute right-5 cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm italic mt-2">
                  {passwordError}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                className="block text-gray-300 text-lg font-semibold mb-3"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${confirmPasswordError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleValidation("confirmPassword")}
                  required
                />
                <Lock className="absolute left-5 text-gray-400" size={24} />
                <div
                  className="absolute right-5 cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={24} />
                  ) : (
                    <Eye size={24} />
                  )}
                </div>
              </div>
              {confirmPasswordError && (
                <p className="text-red-400 text-sm italic mt-2">
                  {confirmPasswordError}
                </p>
              )}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-300">
              A little more about you.
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Tell us about your grade and skill level.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="relative">
                <label
                  className="block text-gray-300 text-lg font-semibold mb-3"
                  htmlFor="grade"
                >
                  Grade
                </label>
                <div className="relative flex items-center">
                  <input
                    className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${gradeError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                    id="grade"
                    type="text"
                    placeholder="10"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    onBlur={() => handleValidation("grade")}
                    required
                  />
                  <GraduationCap
                    className="absolute left-5 text-gray-400"
                    size={24}
                  />
                </div>
                {gradeError && (
                  <p className="text-red-400 text-sm italic mt-2">
                    {gradeError}
                  </p>
                )}
              </div>
              <div className="relative">
                <label
                  className="block text-gray-300 text-lg font-semibold mb-3"
                  htmlFor="skillLevel"
                >
                  Skill Level
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 appearance-none ${skillLevelError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                    id="skillLevel"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    onBlur={() => handleValidation("skillLevel")}
                    required
                  >
                    <option value="" disabled hidden>
                      Select your skill level
                    </option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <Code className="absolute left-5 text-gray-400" size={24} />
                  <div className="absolute right-5 text-gray-400 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {skillLevelError && (
                  <p className="text-red-400 text-sm italic mt-2">
                    {skillLevelError}
                  </p>
                )}
              </div>
            </div>
          </>
        );
      case 6:
        return (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-300">
              Your areas of interest.
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Tell us about your proficiency in a few key areas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Web Dev Dropdown */}
              <div className="relative">
                <label
                  className="block text-gray-300 text-lg font-semibold mb-3"
                  htmlFor="webDevSkill"
                >
                  Web Dev (React, HTML, CSS, JS)
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 appearance-none ${webDevSkillError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                    id="webDevSkill"
                    value={webDevSkill}
                    onChange={(e) => setWebDevSkill(e.target.value)}
                    onBlur={() => handleValidation("webDevSkill")}
                    required
                  >
                    {skillOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                        hidden={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Code className="absolute left-5 text-gray-400" size={24} />
                  <div className="absolute right-5 text-gray-400 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {webDevSkillError && (
                  <p className="text-red-400 text-sm italic mt-2">
                    {webDevSkillError}
                  </p>
                )}
              </div>
              {/* Game Dev Dropdown */}
              <div className="relative">
                <label
                  className="block text-gray-300 text-lg font-semibold mb-3"
                  htmlFor="gameDevSkill"
                >
                  Game Dev (in general & w/ Godot)
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 appearance-none ${gameDevSkillError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                    id="gameDevSkill"
                    value={gameDevSkill}
                    onChange={(e) => setGameDevSkill(e.target.value)}
                    onBlur={() => handleValidation("gameDevSkill")}
                    required
                  >
                    {skillOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                        hidden={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Lightbulb
                    className="absolute left-5 text-gray-400"
                    size={24}
                  />
                  <div className="absolute right-5 text-gray-400 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {gameDevSkillError && (
                  <p className="text-red-400 text-sm italic mt-2">
                    {gameDevSkillError}
                  </p>
                )}
              </div>
              {/* AI Dropdown */}
              <div className="relative">
                <label
                  className="block text-gray-300 text-lg font-semibold mb-3"
                  htmlFor="aiSkill"
                >
                  AI (AI structures & PyTorch)
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 appearance-none ${aiSkillError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                    id="aiSkill"
                    value={aiSkill}
                    onChange={(e) => setAiSkill(e.target.value)}
                    onBlur={() => handleValidation("aiSkill")}
                    required
                  >
                    {skillOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                        hidden={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Lightbulb
                    className="absolute left-5 text-gray-400"
                    size={24}
                  />
                  <div className="absolute right-5 text-gray-400 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {aiSkillError && (
                  <p className="text-red-400 text-sm italic mt-2">
                    {aiSkillError}
                  </p>
                )}
              </div>
            </div>
          </>
        );
      case 7:
        return (
          <form onSubmit={handleSignUp} className="w-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-300">
              You're all set!
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Just one final step before you're officially in.
            </p>
            <div className="mb-10 flex items-start">
              <input
                id="agreeToTerms"
                type="checkbox"
                className="mt-1 h-6 w-6 text-indigo-500 bg-gray-600 rounded border-gray-500 focus:ring-indigo-500 focus:ring-2 accent-indigo-500"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-4 text-lg text-gray-300"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-indigo-400 hover:underline font-medium"
                >
                  Hack Club Code of Conduct
                </a>
              </label>
            </div>
            {error && (
              <p className="text-red-400 text-lg italic mb-6">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-lg italic mb-6">{success}</p>
            )}
            <button
              className={`w-full text-white text-xl font-bold py-5 px-12 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                  ${agreeToTerms ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 hover:scale-105" : "bg-gray-700 cursor-not-allowed"}`}
              type="submit"
              disabled={isProcessing || isSendingEmail || !agreeToTerms}
            >
              {isSendingEmail ? "Sending Email..." : "Register Account"}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-900 text-white p-6 overflow-hidden">
      <style jsx global>{`
        @keyframes bg-pan {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes slide-in-forward {
          from {
            opacity: 0;
            transform: translateX(20%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-backward {
          from {
            opacity: 0;
            transform: translateX(-20%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-forward {
          animation: slide-in-forward 0.5s ease-out forwards;
        }
        .animate-slide-in-backward {
          animation: slide-in-backward 0.5s ease-out forwards;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        @keyframes pulse-cursor {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-pulse-cursor {
          animation: pulse-cursor 0.7s infinite;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 z-0 opacity-80" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent opacity-10 animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-700 via-transparent to-transparent opacity-10 animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      <div
        className={`relative z-10 bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 transform border border-gray-700 flex flex-col
        ${showTerminal ? "w-[900px] h-[550px]" : "w-full max-w-7xl"}`}
      >
        <div className="flex items-center justify-between bg-gray-700 rounded-t-2xl border-b border-gray-600 p-3">
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            <div className="w-4 h-4 bg-green-500 rounded-full" />
          </div>
          <p className="font-semibold text-sm text-gray-400">
            Hack Club Sign-up
          </p>
          <div className="w-10"></div>
        </div>
        {showTerminal ? (
          <div className="flex w-full flex-grow rounded-b-2xl">
            {renderTerminalContent()}
          </div>
        ) : (
          <div className="flex w-full">
            {renderProgressColumn()}
            <div className="w-full lg:w-2/3 p-12 md:p-16 rounded-r-2xl">
              <h1 className="text-6xl md:text-7xl font-extrabold mb-8 text-center lg:text-left text-indigo-400 drop-shadow-md">
                Join Hack Club
              </h1>
              <p className="text-center lg:text-left text-xl text-gray-400 mb-12 font-light">
                Let's get you set up to start building awesome projects.
              </p>
              <div
                ref={formRef}
                className="overflow-y-auto overflow-x-hidden max-h-[75vh] pr-2"
              >
                <div
                  key={step}
                  className={
                    animationDirection === "forward"
                      ? "animate-slide-in-forward"
                      : "animate-slide-in-backward"
                  }
                >
                  {renderFormContent()}
                </div>
              </div>

              {step < 7 && !showTerminal && (
                <div className="flex justify-between items-center mt-10">
                  <Link
                    href="/login"
                    className="font-bold text-lg text-indigo-400 hover:text-indigo-300 transition duration-200"
                  >
                    Already have an account? Sign In
                  </Link>
                  <div className="flex items-center">
                    {step > 1 && (
                      <button
                        onClick={handlePrev}
                        type="button"
                        className="flex items-center text-gray-400 text-xl hover:text-gray-300 transition duration-200 mr-6"
                      >
                        <ArrowLeft size={28} className="mr-3" /> Back
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      type="button"
                      className={`flex items-center text-white text-xl font-bold py-5 px-12 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 transform shadow-lg bg-indigo-500 hover:bg-indigo-600 hover:scale-105`}
                    >
                      Next <ArrowRight size={28} className="ml-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
