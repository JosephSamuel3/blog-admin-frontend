import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useChangePassword, useProfile, useUpdateProfile } from "../hooks/auth.hooks";

export default function Profile() {
  const { refreshUser } = useAuth();
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setEmail(profile.email);
      setUsername(profile.username);
    }
  }, [profile]);

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    try {
      await updateProfile.mutateAsync({ email, username });
      await refreshUser();
      setProfileMessage("Profile updated.");
    } catch {
      setProfileError("Couldn't update profile.");
    }
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setPasswordMessage("Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPasswordError("Couldn't change password. Check your current password.");
    }
  };

  if (isLoading) return <p>Loading…</p>;
  if (isError || !profile) return <p className="form-error">Couldn't load your profile.</p>;

  return (
    <div>
      <h1>Profile</h1>

      <form className="card" onSubmit={handleProfileSubmit}>
        <h2>Account details</h2>
        <p className="muted">
          Role: {profile.role} · Joined {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        {profileMessage && <p className="form-success">{profileMessage}</p>}
        {profileError && <p className="form-error">{profileError}</p>}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form className="card" onSubmit={handlePasswordSubmit}>
        <h2>Change password</h2>
        {passwordMessage && <p className="form-success">{passwordMessage}</p>}
        {passwordError && <p className="form-error">{passwordError}</p>}
        <label>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        <button type="submit" disabled={changePassword.isPending}>
          {changePassword.isPending ? "Saving…" : "Change password"}
        </button>
      </form>
    </div>
  );
}
