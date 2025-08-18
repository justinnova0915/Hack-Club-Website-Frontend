'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
interface CustomUser extends User {
  username?: string | null;
  firstName?: string;
  lastName?: string;
  grade?: string;
  skillLevel?: string;
  bestAt?: string;
  mostInterested?: string;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
}
interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, username: string, firstName: string, lastName: string, grade: string, skillLevel: string, bestAt: string, mostInterested: string) => Promise<void>;
  logOut: () => Promise<void>;
  userRole: 'student' | 'mentor' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'student' | 'mentor' | 'admin' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        let role: 'student' | 'mentor' | 'admin' = 'student';
        let fetchedUserData: { [key: string]: any } = {};

        if (userDocSnap.exists()) {
          fetchedUserData = userDocSnap.data();
          role = fetchedUserData.role || 'student';
        } else {
          const defaultUsername = currentUser.displayName || currentUser.email?.split('@')[0] || '';
          await setDoc(userDocRef, {
            email: currentUser.email,
            role: 'student',
            createdAt: new Date(),
            username: defaultUsername,
            firstName: '',
            lastName: '',
            grade: '',
            skillLevel: '',
            bestAt: '',
            mostInterested: '',
          }, { merge: true });
          fetchedUserData = { email: currentUser.email, role: 'student', username: defaultUsername, firstName: '', lastName: '', grade: '', skillLevel: '', bestAt: '', mostInterested: '' };
          console.log("Created missing user document in 'users' collection.");
        }
        setUserRole(role);
        const publicProfileRef = doc(db, 'public_profiles', currentUser.uid);
        const publicProfileSnap = await getDoc(publicProfileRef);

        const currentUsername = publicProfileSnap.exists() ? publicProfileSnap.data().username : (fetchedUserData.username || currentUser.displayName || currentUser.email?.split('@')[0] || '');
        const currentFirstName = publicProfileSnap.exists() ? publicProfileSnap.data().firstName : (fetchedUserData.firstName || '');
        const currentLastName = publicProfileSnap.exists() ? publicProfileSnap.data().lastName : (fetchedUserData.lastName || '');
        const currentGrade = publicProfileSnap.exists() ? publicProfileSnap.data().grade : (fetchedUserData.grade || '');
        const currentSkillLevel = publicProfileSnap.exists() ? publicProfileSnap.data().skillLevel : (fetchedUserData.skillLevel || '');
        const currentBestAt = publicProfileSnap.exists() ? publicProfileSnap.data().bestAt : (fetchedUserData.bestAt || '');
        const currentMostInterested = publicProfileSnap.exists() ? publicProfileSnap.data().mostInterested : (fetchedUserData.mostInterested || '');
        const currentEmail = publicProfileSnap.exists() ? publicProfileSnap.data().email : (fetchedUserData.email || currentUser.email || '');

        if (!publicProfileSnap.exists() ||
            publicProfileSnap.data().role !== role ||
            publicProfileSnap.data().username !== currentUsername ||
            publicProfileSnap.data().email !== currentEmail ||
            publicProfileSnap.data().firstName !== currentFirstName ||
            publicProfileSnap.data().lastName !== currentLastName ||
            publicProfileSnap.data().grade !== currentGrade ||
            publicProfileSnap.data().skillLevel !== currentSkillLevel ||
            publicProfileSnap.data().bestAt !== currentBestAt ||
            publicProfileSnap.data().mostInterested !== currentMostInterested
            ) {
          await setDoc(publicProfileRef, {
            username: currentUsername,
            email: currentEmail,
            role: role,
            uid: currentUser.uid,
            firstName: currentFirstName,
            lastName: currentLastName,
            grade: currentGrade,
            skillLevel: currentSkillLevel,
            bestAt: currentBestAt,
            mostInterested: currentMostInterested,
          }, { merge: true });
          console.log("Created/Updated public_profile document.");
        }
        const augmentedUser: CustomUser = {
          ...currentUser,
          username: currentUsername,
          firstName: currentFirstName,
          lastName: currentLastName,
          grade: currentGrade,
          skillLevel: currentSkillLevel,
          bestAt: currentBestAt,
          mostInterested: currentMostInterested,
          getIdToken: currentUser.getIdToken.bind(currentUser),
        };

        setUser(augmentedUser);

      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (!user.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email before signing in.");
    }
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return {
        ...userCredential,
        role: userData.role,
        firstName: userData.firstName,

        lastName: userData.lastName,
        grade: userData.grade,
        skillLevel: userData.skillLevel,
        bestAt: userData.bestAt,
        mostInterested: userData.mostInterested,
      };
    }

    return userCredential;
  };
  const signUp = async (email: string, password: string, username: string, firstName: string, lastName: string, grade: string, skillLevel: string, bestAt: string, mostInterested: string) => {
      console.log("signUp function started");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created in Firebase Auth:", userCredential.user.uid);
      const currentUser = userCredential.user;
      await updateProfile(currentUser, { displayName: username });
      console.log("Firebase Auth profile updated with username:", username);
      await setDoc(doc(db, 'users', currentUser.uid), {
          email: currentUser.email,
          role: 'student',
          createdAt: new Date(),
          username: username,
      });
      console.log("User document created in Firestore 'users' collection");
      await setDoc(doc(db, 'public_profiles', currentUser.uid), {
          username: username,
          email: currentUser.email,
          role: 'student',
          uid: currentUser.uid,
          firstName: firstName,
          lastName: lastName,
          grade: grade,
      });
      console.log("Public profile document created in Firestore 'public_profiles' collection");
      await setDoc(doc(db, 'applications', currentUser.uid), {
          email: currentUser.email,
          username: username,
          firstName: firstName,
          lastName: lastName,
          grade: grade,
          skillLevel: skillLevel,
          bestAt: bestAt,
          mostInterested: mostInterested,
      });
      console.log("Application document created in Firestore 'applications' collection");
      await sendEmailVerification(currentUser);
      console.log("Verification email sent.");
      await signOut(auth);
      console.log("User signed out pending email verification.");
  };
  const logOut = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logOut,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
