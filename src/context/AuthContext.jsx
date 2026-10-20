import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, googleProvider } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Initial default demo user if offline or sandbox fallback
const DEMO_USERS = {
  Resident: {
    uid: 'demo-resident-123',
    email: 'tunde.adebayo@ecowaste.ng',
    displayName: 'Tunde Adebayo',
    role: 'Resident',
    city: 'Lagos',
    state: 'Lagos State',
    phone: '+234 803 123 4567',
    ecoPoints: 450,
    totalKgRecycled: 128,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: '14 Admiralty Way, Lekki Phase 1, Lagos'
  },
  Business: {
    uid: 'demo-business-456',
    email: 'contact@radissonlekki.ng',
    displayName: 'Radisson Blu Lekki',
    role: 'Business',
    city: 'Lagos',
    state: 'Lagos State',
    phone: '+234 809 111 2233',
    ecoPoints: 1250,
    totalKgRecycled: 640,
    photoURL: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
    address: 'Plot 10, Ozumba Mbadiwe Ave, Victoria Island, Lagos'
  },
  Collector: {
    uid: 'demo-collector-789',
    email: 'chidi.collector@ecowaste.ng',
    displayName: 'Chidi Okonkwo (Eco-Agent)',
    role: 'Collector',
    city: 'Abuja',
    state: 'FCT',
    phone: '+234 809 987 6543',
    ecoPoints: 1890,
    totalKgRecycled: 940,
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    address: 'Central Business District, Abuja'
  },
  Recycler: {
    uid: 'demo-recycler-999',
    email: 'factory@westafricanplastics.ng',
    displayName: 'West African Plastics Hub',
    role: 'Recycler',
    city: 'Ibadan',
    state: 'Oyo State',
    phone: '+234 802 333 4455',
    ecoPoints: 3400,
    totalKgRecycled: 2150,
    photoURL: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80',
    address: 'Industrial Estate, Challenge, Ibadan'
  },
  Admin: {
    uid: 'demo-admin-001',
    email: 'admin@ecowaste.ng',
    displayName: 'Aisha Bello (National Admin)',
    role: 'Admin',
    city: 'Abuja',
    state: 'FCT Abuja',
    phone: '+234 800 000 9999',
    ecoPoints: 10000,
    totalKgRecycled: 5000,
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    address: 'Ministry of Environment, Federal Secretariat, Abuja'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Initialize Auth listener
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth) {
      try {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setCurrentUser(user);
            setIsDemoMode(false);
            
            // Fetch profile document from Firestore
            if (db) {
              try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  setUserProfile(docSnap.data());
                } else {
                  // Create default profile if user doc is missing
                  const newProfile = {
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || user.email?.split('@')[0] || 'Eco Recycler',
                    role: 'Resident',
                    phone: user.phoneNumber || '',
                    city: 'Lagos',
                    state: 'Lagos State',
                    address: '',
                    photoURL: user.photoURL || '',
                    ecoPoints: 100,
                    totalKgRecycled: 0,
                    createdAt: new Date().toISOString()
                  };
                  await setDoc(docRef, newProfile);
                  setUserProfile(newProfile);
                }
              } catch (err) {
                console.warn("Firestore fetch error, fallback to memory state:", err);
                setUserProfile({
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName || 'Eco User',
                  role: 'Resident',
                  photoURL: user.photoURL || '',
                  ecoPoints: 100,
                  totalKgRecycled: 0
                });
              }
            }
          } else if (!isDemoMode) {
            setCurrentUser(null);
            setUserProfile(null);
          }
          setLoading(false);
        });
      } catch (e) {
        console.warn("Auth state setup warning:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, [isDemoMode]);

  // Login with Email & Password
  const login = async (email, password) => {
    if (auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
      } catch (error) {
        console.warn("Firebase Auth login error:", error.message);
        throw error;
      }
    } else {
      return demoLogin('Resident');
    }
  };

  // Register with Email, Password & Role choice
  const register = async (email, password, details) => {
    const { displayName, role, phone, address, city, state } = details;
    if (auth) {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Update Auth Profile display name
        if (displayName) {
          try {
            await updateProfile(user, { displayName });
          } catch (e) {
            console.warn("Update profile name warning:", e);
          }
        }

        const newProfile = {
          uid: user.uid,
          email,
          displayName: displayName || email.split('@')[0],
          role: role || 'Resident',
          phone: phone || '',
          address: address || '',
          city: city || 'Lagos',
          state: state || 'Lagos State',
          photoURL: user.photoURL || '',
          ecoPoints: 100, // Welcome signup bonus
          totalKgRecycled: 0,
          bankName: '',
          accountNumber: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (db) {
          await setDoc(doc(db, 'users', user.uid), newProfile);
        }

        setUserProfile(newProfile);
        return user;
      } catch (error) {
        console.warn("Firebase Registration error:", error.message);
        throw error;
      }
    } else {
      return demoLogin(role || 'Resident', displayName, email);
    }
  };

  // Google Sign In
  const signInWithGoogle = async (selectedRole = 'Resident') => {
    if (auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        if (db) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            const newProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Eco User',
              role: selectedRole || 'Resident',
              phone: user.phoneNumber || '',
              address: '',
              city: 'Lagos',
              state: 'Lagos State',
              photoURL: user.photoURL || '',
              ecoPoints: 100,
              totalKgRecycled: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newProfile);
            setUserProfile(newProfile);
          } else {
            setUserProfile(docSnap.data());
          }
        }
        return user;
      } catch (error) {
        console.warn("Google Auth error:", error.message);
        throw error;
      }
    } else {
      return demoLogin(selectedRole);
    }
  };

  // Password Reset Email
  const resetPassword = async (email) => {
    if (auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (error) {
        console.warn("Password reset error:", error);
        throw error;
      }
    } else {
      return true;
    }
  };

  // Demo Login Helper
  const demoLogin = (role = 'Resident', customName = null, customEmail = null) => {
    const base = DEMO_USERS[role] || DEMO_USERS.Resident;
    const demoUser = {
      ...base,
      displayName: customName || base.displayName,
      email: customEmail || base.email,
      role: role || base.role
    };
    setIsDemoMode(true);
    setCurrentUser(demoUser);
    setUserProfile(demoUser);
    setLoading(false);
    return demoUser;
  };

  // Logout
  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("SignOut warning:", e);
      }
    }
    setIsDemoMode(false);
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Update Profile Data in Firestore
  const updateProfileData = async (updatedFields) => {
    const updated = {
      ...userProfile,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    
    setUserProfile(updated);

    if (currentUser && !isDemoMode && db) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, updated, { merge: true });
      } catch (err) {
        console.warn("Firestore profile update error:", err);
      }
    }

    return updated;
  };

  // Upload Profile Photo to Firebase Storage
  const uploadProfilePhoto = async (file) => {
    if (!file) return null;

    if (currentUser && !isDemoMode && storage) {
      try {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update auth profile
        try {
          await updateProfile(currentUser, { photoURL: downloadURL });
        } catch (e) {
          console.warn("Auth photoURL update warning:", e);
        }

        // Update firestore profile
        await updateProfileData({ photoURL: downloadURL });

        return downloadURL;
      } catch (err) {
        console.warn("Firebase Storage upload error, using local data URL fallback:", err);
      }
    }

    // Fallback: local FileReader data URL for instant feedback or offline/demo
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        await updateProfileData({ photoURL: dataUrl });
        resolve(dataUrl);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isDemoMode,
    login,
    register,
    signInWithGoogle,
    resetPassword,
    demoLogin,
    logout,
    updateProfileData,
    uploadProfilePhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
