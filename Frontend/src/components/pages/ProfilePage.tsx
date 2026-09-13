"use client";



import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import { useAuth } from "@/context/AuthContext";



export default function ProfilePage() {

  const { user, refreshProfile } = useAuth();

  const [address, setAddress] = useState("");

  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);



  useEffect(() => {

    if (user) {

      setAddress(user.address ?? "");

      setPhone(String(user.phone_no ?? ""));

    }

  }, [user]);



  const handleSave = async (event: React.FormEvent) => {

    event.preventDefault();

    setSaving(true);

    setMessage("");

    setError("");



    try {

      if (address !== user?.address) {

        await api.updateAddress(address);

      }

      if (phone !== String(user?.phone_no ?? "")) {

        await api.updatePhoneNumber(phone);

      }

      await refreshProfile();

      setMessage("Profile updated successfully.");

    } catch (err) {

      setError(err instanceof Error ? err.message : "Failed to update profile");

    } finally {

      setSaving(false);

    }

  };



  return (

    <div className="container page">

      <section className="hero">

        <h1>My Profile</h1>

        <p className="muted">Manage your account details.</p>

      </section>



      <div className="card profile-card">

        <div className="profile-info">

          <p><strong>Name:</strong> {user?.name}</p>

          <p><strong>Email:</strong> {user?.email}</p>

          <p><strong>Role:</strong> {user?.role}</p>

        </div>



        <form onSubmit={handleSave} className="profile-form">

          <label>

            Address

            <input

              type="text"

              value={address}

              onChange={(event) => setAddress(event.target.value)}

              placeholder="Enter your delivery address"

            />

          </label>



          <label>

            Phone Number

            <input

              type="text"

              value={phone}

              onChange={(event) => setPhone(event.target.value)}

              placeholder="10-digit phone number"

              maxLength={10}
              
            />

          </label>



          {message && <div className="alert alert-success">{message}</div>}

          {error && <div className="alert alert-error">{error}</div>}



          <button className="btn btn-primary" type="submit" disabled={saving}>

            {saving ? "Saving..." : "Save Changes"}

          </button>

        </form>

      </div>

    </div>

  );

}


