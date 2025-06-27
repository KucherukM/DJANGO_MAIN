import { useState, useEffect } from "react";
import { useGetUserQuery, useUpdateUserMutation } from "../../services/apiAuth";
import { useNavigate } from "react-router";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: user, isLoading, error } = useGetUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
      return;
    }
    if (user) {
      setUsername(user.username || "");
      setPhone(user.phone || "");
    }
  }, [user, navigate]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return alert("Введіть ім'я користувача");
    if (!phone.trim()) return alert("Введіть номер телефону");
    try {
      await updateUser({ username, phone, photo: photo || undefined }).unwrap();
      setIsEditing(false);
      setPhoto(null);
      setPhotoPreview(null);
      alert("Профіль оновлено!");
    } catch {
      alert("Помилка оновлення профілю");
    }
  };

  const handleCancel = () => {
    if (user) {
      setUsername(user.username || "");
      setPhone(user.phone || "");
    }
    setPhoto(null);
    setPhotoPreview(null);
    setIsEditing(false);
  };

  if (isLoading) return <LoadingOverlay />;
  if (error) return <div>Помилка завантаження профілю</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Профіль користувача</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Редагувати
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Ім'я користувача
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Номер телефону
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фото профілю
                </label>
                <div className="flex items-center space-x-4">
                  {/* Поточне фото або попередній перегляд */}
                  <div className="relative">
                    {photoPreview || user?.photo ? (
                      <img
                        src={
                          photoPreview || 
                          (user?.photo ? 
                            (user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${user.photo}`) 
                            : ''
                          )
                        }
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    {/* Fallback аватар */}
                    <div 
                      className={`w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-200 ${
                        (photoPreview || user?.photo) ? 'hidden' : 'flex'
                      }`}
                    >
                      <span className="text-white text-lg font-medium">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Змінити</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Поле для завантаження файлу */}
                  {isEditing && (
                    <div className="flex-1">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Оберіть нове фото профілю (JPG, PNG, GIF)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isUpdating ? "Збереження..." : "Зберегти"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Скасувати
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 