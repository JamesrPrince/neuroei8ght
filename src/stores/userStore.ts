import { create } from 'zustand'

// Define the shape of the user state and actions
interface UserState {
  user: { id: string; email: string /* other user props */ } | null
  isLoading: boolean
  error: string | null
  setUser: (user: { id: string; email: string } | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  // Potentially add async actions like login, logout, fetchUser
}

// Create the store
export const useUserStore = create<UserState>((set) => ({
  // Initial state
  user: null,
  isLoading: false, // Could be true initially if fetching user on load
  error: null,

  // Actions to update state
  setUser: (user) => set({ user, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),

  // Example async action (conceptual)
  // login: async (credentials) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     // Replace with your actual Supabase/auth logic
  //     const { data, error } = await supabase.auth.signInWithPassword(credentials);
  //     if (error) throw error;
  //     set({ user: data.user, isLoading: false });
  //   } catch (err: any) {
  //     set({ error: err.message, isLoading: false, user: null });
  //   }
  // },
}))

// You can also export parts of the store directly if needed
// export const { setUser, setLoading, setError } = useUserStore.getState();
