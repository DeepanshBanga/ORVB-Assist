// MultipleFiles/auth.js
import { supabase } from './supabase-config.js';

export async function signUp(email, password, fullName, phoneNumber, registerAs) {
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) throw authError;

        const userId = authData.user.id;

        // Insert user profile into 'profiles' table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: userId,
                    full_name: fullName,
                    phone_number: phoneNumber,
                    role: registerAs,
                    email: email // Store email in profile for easier access
                }
            ]);

        if (profileError) throw profileError;

        console.log('User signed up and profile created:', authData.user);
        return { success: true, user: authData.user };

    } catch (error) {
        console.error('Sign up error:', error.message);
        return { success: false, error: error.message };
    }
}

export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        console.log('User signed in:', data.user);
        return { success: true, user: data.user };

    } catch (error) {
        console.error('Sign in error:', error.message);
        return { success: false, error: error.message };
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        console.log('User signed out.');
        return { success: true };

    } catch (error) {
        console.error('Sign out error:', error.message);
        return { success: false, error: error.message };
    }
}

export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting current user:', error.message);
        return null;
    }
}

export async function updatePassword(newPassword) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        console.log('Password updated successfully:', data);
        return { success: true };
    } catch (error) {
        console.error('Error updating password:', error.message);
        return { success: false, error: error.message };
    }
}

export async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
    }
}

export async function updateProfile(userId, updates) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        console.log('Profile updated successfully.');
        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error.message);
        return { success: false, error: error.message };
    }
}