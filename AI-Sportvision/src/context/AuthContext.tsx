import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { upsertUserProfileToSupabase } from '../lib/supabaseService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (user: User) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

export const DEMO_USERS: Record<UserRole, User> = {
  athlete: {
    id: 'sai-ath-101',
    name: 'Arjun Rathore',
    email: 'arjun.rathore@athlete.sai.gov.in',
    role: 'athlete',
    age: 19,
    gender: 'Male',
    height: 178,
    weight: 68,
    district: 'Bhiwani',
    state: 'Haryana',
    preferredSport: 'Athletics (400m & Long Jump)',
    talentScore: 94,
    saiId: 'SAI-IND-2026-8942'
  },
  coach: {
    id: 'sai-coach-201',
    name: 'Coach Rajesh Sharma',
    email: 'rajesh.sharma@sai.gov.in',
    role: 'coach',
    academyName: 'SAI National Centre of Excellence (Rohtak)',
    specialization: 'Strength & Conditioning / Athletics',
    licenseId: 'SAI-LIC-4091A'
  },
  admin: {
    id: 'sai-admin-001',
    name: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@sai.gov.in',
    role: 'admin',
    officialId: 'SAI-DIR-HQ-104'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sportvision_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'sai-ath-101') {
          localStorage.removeItem('sportvision_current_user');
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState<UserRole>(() => {
    return user?.role || 'athlete';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sportvision_current_user', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('sportvision_current_user');
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
    setRole(userData.role);

    // Save Login & Registration user profile directly to Supabase database table `profiles`
    upsertUserProfileToSupabase(userData).then((res) => {
      if (res.success) {
        console.log(`[Supabase] User profile ${userData.email} synced to database.`);
      } else {
        console.warn(`[Supabase] Profile sync notice: ${res.error}`);
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sportvision_current_user');
  };

  const switchDemoRole = (newRole: UserRole) => {
    setUser(DEMO_USERS[newRole]);
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        switchDemoRole,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
