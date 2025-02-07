import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import "./styles.css";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kanbas/Account/Signin");
  };

  const fetchProfile = async () => {
    try {
      const account = await client.profile();
      setProfile(account);
    } catch (err: any) {
      navigate("/Kanbas/Account/Signin");
    }
  };

  const saveProfile = async () => {
    try {
      const updatedUser = await client.updateProfile(profile); 
      dispatch(setCurrentUser(updatedUser)); 
      alert("Profile updated successfully!"); 
    } catch (err: any) {
      console.error("Failed to update profile:", err.message || "Unknown error");
      alert("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="wd-profile-screen container">
      <h1>Profile</h1>
      {profile && (
        <div>
          <input
            className="wd-username form-control mb-2 w-25"
            value={profile.username || ''}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="Username"
          />
          <input
            className="wd-password form-control mb-2 w-25"
            type="password"
            value={profile.password || ''}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            placeholder="Password"
          />
          <input
            className="wd-firstname form-control mb-2 w-25"
            value={profile.firstName || ''}
            placeholder="First Name"
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
          <input
            className="wd-lastname form-control mb-2 w-25"
            value={profile.lastName || ''}
            placeholder="Last Name"
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
          <input
            className="wd-dob form-control mb-2 w-25"
            type="date"
            value={profile.dob || ''}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <input
            className="wd-email form-control mb-2 w-25"
            value={profile.email || ''}
            placeholder="Email Address"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select
            className="wd-role form-select mb-2 w-25"
            value={profile.role || 'USER'}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          <button onClick={saveProfile} className="btn btn-primary w-25 mb-2" style={{ flexShrink: 0, width: '120px', padding: '5px 10px', fontSize: '14px' }}>Save Profile</button>
          <button onClick={signout} className="wd-signout-btn btn btn-danger w-25" style={{ flexShrink: 0, width: '120px', padding: '5px 10px', fontSize: '14px' }}>Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
}
