"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Profile() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          bio: res.data.bio || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://127.0.0.1:8000/me",
        {
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Profile updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="space-y-6">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border/50 p-8">
          <div className="flex items-end gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <Button variant="outline" className="border-border/50">
              Change Avatar
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  className="bg-input/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  className="bg-input/50 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-input/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                rows={4}
                placeholder="Tell us about yourself..."
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-blue-600"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" className="border-border/50">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
