"use client";

import { Ban, KeyRound, UserCog, PowerOff, Trash2 } from "lucide-react";
import { banUser, kickUser, changeRole, setOverridePassword, deleteUser } from "./actions";
import toast from "react-hot-toast";

export function UserActionButtons({ userId, currentRole, overridePassword }: { userId: string, currentRole: string, overridePassword?: string | null }) {
  
  const handleBan = async () => {
    if (confirm("Bu kullanıcıyı kalıcı olarak sistemden yasaklamak istediğinize emin misiniz?")) {
      try {
        await banUser(userId);
        toast.success("Kullanıcı başarıyla yasaklandı.");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleKick = async () => {
    if (confirm("Bu kullanıcının aktif oturumlarını zorla kapatmak istiyor musunuz?")) {
      try {
        await kickUser(userId);
        toast.success("Oturum kapatıldı.");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleRole = async () => {
    const newRole = prompt("Yeni yetkiyi yazın (admin, technician, customer):", currentRole);
    if (newRole && ["admin", "technician", "customer"].includes(newRole)) {
      try {
        await changeRole(userId, newRole as any);
        toast.success("Yetki güncellendi.");
      } catch (err: any) {
        toast.error(err.message);
      }
    } else if (newRole) {
      toast.error("Geçersiz yetki tipi.");
    }
  };

  const handlePassword = async () => {
    const pwd = prompt("Açık metin olarak okunacak Yönetici Şifresini girin:\n(Kullanıcı bu şifreyle girebilir)", overridePassword || "");
    if (pwd !== null) {
      try {
        await setOverridePassword(userId, pwd);
        toast.success("Yönetici şifresi atandı.");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("⚠️ DİKKAT: Bu kullanıcıyı veritabanından kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
      try {
        await deleteUser(userId);
        toast.success("Kullanıcı kalıcı olarak silindi.");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={handleRole} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors tooltip" title="Yetki Düzenle">
        <UserCog className="w-4 h-4" />
      </button>
      <button onClick={handlePassword} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Yönetici Şifresi Ata">
        <KeyRound className="w-4 h-4" />
      </button>
      <button onClick={handleKick} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors tooltip" title="Sistemden At (Kick)">
        <PowerOff className="w-4 h-4" />
      </button>
      <button onClick={handleBan} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip" title="Kalıcı Ban (Yasakla)">
        <Ban className="w-4 h-4" />
      </button>
      <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors tooltip" title="Kullanıcıyı Sil (Kalıcı)">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
