"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Trash2, X, Lock, UserPlus, Eye, EyeOff, Check } from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [newUserError, setNewUserError] = useState("");
  const [newUserSaving, setNewUserSaving] = useState(false);

  // Change password form
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPassField, setShowNewPassField] = useState(false);
  const [showConfirmPassField, setShowConfirmPassField] = useState(false);
  const [changePassError, setChangePassError] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState(false);
  const [changePassSaving, setChangePassSaving] = useState(false);

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then(res => res.status === 401 ? (router.push("/admin/login"), null) : res.json())
      .then(res => { if (res?.users) setUsers(res.users); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, [router]);

  const handleCreateUser = async () => {
    setNewUserError("");
    if (!newUsername || !newPassword) { setNewUserError("تمام فیلدها الزامی است"); return; }
    if (newPassword.length < 6) { setNewUserError("رمز عبور باید حداقل ۶ کاراکتر باشد"); return; }

    setNewUserSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: "admin" })
    });
    const data = await res.json();
    setNewUserSaving(false);

    if (!res.ok) { setNewUserError(data.error); return; }
    setShowNewUser(false);
    setNewUsername("");
    setNewPassword("");
    fetchUsers();
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert(data.error); return; }
    fetchUsers();
  };

  const handleChangePassword = async () => {
    setChangePassError("");
    setChangePassSuccess(false);
    if (!currentPassword || !newPass || !confirmPass) {
      setChangePassError("تمام فیلدها الزامی است");
      return;
    }
    if (newPass.length < 6) {
      setChangePassError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد");
      return;
    }
    if (newPass !== confirmPass) {
      setChangePassError("رمز عبور جدید و تکرار آن یکسان نیستند");
      return;
    }

    setChangePassSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword: newPass,
        confirmPassword: confirmPass,
      }),
    });
    const data = await res.json();
    setChangePassSaving(false);

    if (!res.ok) {
      setChangePassError(data.error);
      return;
    }
    setChangePassSuccess(true);
    setCurrentPassword("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => {
      setChangePassSuccess(false);
      setShowChangePass(false);
    }, 2000);
  };

  if (loading) return <AdminShell title="کاربران"><div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></AdminShell>;

  return (
    <AdminShell title="مدیریت کاربران" description="تغییر رمز عبور و مدیریت دسترسی‌ها">
      <div className="max-w-2xl space-y-6">

        {/* Change Password */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Lock className="w-5 h-5" /> تغییر رمز عبور</h2>
            {!showChangePass && (
              <button onClick={() => setShowChangePass(true)} className="text-sm text-muted-foreground hover:text-foreground">تغییر</button>
            )}
          </div>

          {showChangePass && (
            <div className="space-y-3">
              {changePassError && (
                <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{changePassError}</div>
              )}
              {changePassSuccess && (
                <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" /> رمز عبور با موفقیت تغییر کرد
                </div>
              )}

              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  dir="ltr"
                  placeholder="رمز عبور فعلی"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-xl focus:outline-none focus:border-foreground/20 text-left"
                />
                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showCurrentPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNewPassField ? "text" : "password"}
                  dir="ltr"
                  placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-xl focus:outline-none focus:border-foreground/20 text-left"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowNewPassField(!showNewPassField)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showNewPassField ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassField ? "text" : "password"}
                  dir="ltr"
                  placeholder="تکرار رمز عبور جدید"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-xl focus:outline-none focus:border-foreground/20 text-left"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirmPassField(!showConfirmPassField)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirmPassField ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changePassSaving}
                  className="px-5 py-2.5 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50 text-sm"
                >
                  {changePassSaving ? "..." : "ذخیره"}
                </button>
                <button
                  onClick={() => {
                    setShowChangePass(false);
                    setChangePassError("");
                    setCurrentPassword("");
                    setNewPass("");
                    setConfirmPass("");
                  }}
                  className="px-5 py-2.5 border border-border rounded-xl hover:bg-secondary text-sm"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">کاربران</h2>
            <button onClick={() => setShowNewUser(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-xl hover:opacity-90 text-sm">
              <UserPlus className="w-4 h-4" /> کاربر جدید
            </button>
          </div>

          {/* New User Modal */}
          {showNewUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewUser(false)}>
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">کاربر جدید</h3>
                  <button onClick={() => setShowNewUser(false)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                {newUserError && (
                  <div className="mb-3 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{newUserError}</div>
                )}

                <div className="space-y-3">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="نام کاربری"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-foreground/20 text-left"
                  />
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      dir="ltr"
                      placeholder="رمز عبور (حداقل ۶ کاراکتر)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-xl focus:outline-none focus:border-foreground/20 text-left"
                    />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    onClick={handleCreateUser}
                    disabled={newUserSaving}
                    className="w-full py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50"
                  >
                    {newUserSaving ? "در حال ساخت..." : "ایجاد کاربر"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-3 rounded-xl border border-border p-3 sm:gap-4 sm:p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium" dir="ltr">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                  title="حذف"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
