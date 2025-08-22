import { getAuth, User } from "firebase/auth";

/**
 * Sends a POST request to the backend email endpoint with authentication.
 * @param {string} emailType - The type of email to send (e.g., 'welcome', 'announcement').
 * @param {object} formData - The data for the email (e.g., name, email, message).
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const sendEmail = async (emailType: string, formData: object): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (!user) {
      console.error("No user is signed in. Cannot send email.");
      return false;
    }

    const idToken = await user.getIdToken();
    let endpoint = "";

    switch (emailType) {
      case "welcome":
        endpoint = "/api/emails/send-welcome";
        break;
      case "announcement":
        endpoint = "/api/emails/send-announcement";
        break;
      case "contact":
        endpoint = "/api/emails/send-contact";
        break;
      default:
        console.error("Invalid email type provided.");
        return false;
    }

    // You need to replace this with your actual Cloud Function URL
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`; 

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`, 
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log(`Email '${emailType}' sent successfully!`);
      return true;
    } else {
      const errorData = await response.json();
      console.error("Failed to send email:", errorData.error);
      return false;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
};

export { sendEmail };