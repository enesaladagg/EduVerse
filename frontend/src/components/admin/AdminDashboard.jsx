import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Yönetici Paneli (Admin Dashboard)</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Hoş Geldiniz, {user?.name}</h2>
        <p className="text-gray-600 mb-6">
          Buradan platformdaki tüm kullanıcıları yönetebilir, rolleri değiştirebilir ve sistem istatistiklerini görüntüleyebilirsiniz.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded border border-blue-200">
            <h3 className="font-bold text-blue-800">Toplam Kullanıcı</h3>
            <p className="text-2xl">0</p>
          </div>
          <div className="bg-green-100 p-4 rounded border border-green-200">
            <h3 className="font-bold text-green-800">Aktif Kurslar</h3>
            <p className="text-2xl">0</p>
          </div>
          <div className="bg-purple-100 p-4 rounded border border-purple-200">
            <h3 className="font-bold text-purple-800">Sistem Sağlığı</h3>
            <p className="text-2xl text-green-600">İyi</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Hızlı İşlemler</h3>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Kullanıcıları Yönet
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Sistem Ayarları
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
