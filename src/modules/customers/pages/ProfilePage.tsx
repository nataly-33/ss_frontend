import type { Address, CustomerProfile } from "../types";
import { useState, useEffect } from "react";
import { User, MapPin, Shield, Plus } from "lucide-react";
import { customersService } from "../services/customers.service";
import { ProfileForm, AddressList, AddressForm, SecuritySettings } from "../components";
import { Button } from "@shared/components/ui/Button";
import { LoadingSpinner } from "@shared/components/ui/LoadingSpinner";

type TabType = "profile" | "addresses" | "security";

export default function NewProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profileData, addressesData] = await Promise.all([
        customersService.getProfile(),
        customersService.getAddresses(),
      ]);
      setProfile(profileData);
      setAddresses(addressesData);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (data: Partial<CustomerProfile>) => {
    await customersService.updateProfile(data);
    await loadData();
  };

  const handleSaveAddress = async (data: Partial<Address>) => {
    if (selectedAddress) {
      await customersService.updateAddress(selectedAddress.id, data);
    } else {
      await customersService.createAddress(data as Omit<Address, "id">);
    }
    await loadData();
    setSelectedAddress(null);
  };

  const handleDeleteAddress = async (addressId: string) => {
    await customersService.deleteAddress(addressId);
    await loadData();
  };

  const handleSetPrincipal = async (addressId: string) => {
    await customersService.updateAddress(addressId, { es_principal: true });
    await loadData();
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setIsAddressFormOpen(true);
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    // TODO: Implement change password service
    console.log("Change password:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const tabs = [
    {
      id: "profile" as TabType,
      label: "Datos Personales",
      icon: User,
    },
    {
      id: "addresses" as TabType,
      label: "Mis Direcciones",
      icon: MapPin,
    },
    {
      id: "security" as TabType,
      label: "Seguridad",
      icon: Shield,
    },
  ];

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
            Mi Perfil
          </h1>
          <p className="text-text-secondary">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                  font-semibold transition-all
                  ${
                    activeTab === tab.id
                      ? "bg-primary-main text-white shadow-lg"
                      : "text-text-secondary hover:bg-neutral-50"
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === "profile" && (
            <ProfileForm profile={profile} onSave={handleSaveProfile} />
          )}

          {activeTab === "addresses" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-text-primary">
                    Mis Direcciones
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Gestiona tus direcciones de envío
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedAddress(null);
                    setIsAddressFormOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva dirección
                </Button>
              </div>

              <AddressList
                addresses={addresses}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetPrincipal={handleSetPrincipal}
              />
            </div>
          )}

          {activeTab === "security" && (
            <SecuritySettings onChangePassword={handleChangePassword} />
          )}
        </div>

        {/* Address Form Modal */}
        <AddressForm
          isOpen={isAddressFormOpen}
          onClose={() => {
            setIsAddressFormOpen(false);
            setSelectedAddress(null);
          }}
          onSave={handleSaveAddress}
          address={selectedAddress}
        />
      </div>
    </div>
  );
}
