import React, { useState, useMemo, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAuth, Service } from '@/Context/AuthContext';

const TextIcon = ({ text, className }: { text: string, className?: string }) => {
  const firstLetter = text ? text.charAt(0).toUpperCase() : '?';
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash;
  };

  const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
  const color = colors[Math.abs(hashCode(text)) % colors.length];

  return (
    <div className={`flex items-center justify-center rounded-xl text-white font-bold ${color} ${className}`}>
      {firstLetter}
    </div>
  );
};

const ServiceCard = ({ service, onSelect }: { service: Service, onSelect: (service: Service) => void }) => (
  <div
    onClick={() => onSelect(service)}
    className="flex flex-col justify-between w-[175px] bg-neutral-800 p-5 rounded-lg cursor-pointer border border-neutral-700 transition-colors duration-200 hover:border-primary"
  >
    <div className="mb-4 mx-auto">
        <TextIcon text={service.name} className="w-16 h-16 text-5xl" />
    </div>
    <div className="text-center">
      <h2 className="text-lg text-primary font-bold truncate">{service.name}</h2>
      <p className="text-xs text-gray-500 mt-1">{service.developer}</p>
    </div>
    <div className="mt-4 text-center">
        {service.price !== null ? (
            <p className="text-sm font-bold text-teal-400">{service.price} Points</p>
        ) : (
            <p className="text-sm font-bold text-gray-400">Free</p>
        )}
    </div>
  </div>
);

const ServiceModal = ({ service, onClose, onBuy, isPurchased }: { service: Service, onClose: () => void, onBuy: (service: Service) => void, isPurchased: boolean }) => {
  const features = useMemo(() => {
    try {
      return service.features ? JSON.parse(service.features) : [];
    } catch (e) {
      console.error("Failed to parse service features:", e);
      return [];
    }
  }, [service.features]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[450px] bg-neutral-900 p-8 rounded-xl border border-neutral-700">
        <div className="flex items-center mb-4">
            <TextIcon text={service.name} className="w-20 h-20 text-3xl mr-4" />
          <div>
            <h2 className="text-3xl text-primary font-bold">{service.name}</h2>
            <p className="text-neutral-400 text-sm">by {service.developer}</p>
          </div>
        </div>
        <p className="text-neutral-300 my-4">{service.description}</p>
        <div className="bg-neutral-800 p-4 rounded-md my-5 text-sm">
          <ul className="list-none p-0 text-white space-y-2">
            {service.category && <li><strong>Category:</strong> {service.category}</li>}
            {service.version && <li><strong>Version:</strong> {service.version}</li>}
            {service.release_date && <li><strong>Release Date:</strong> {service.release_date}</li>}
            {service.price !== null && <li><strong>Price:</strong> {service.price} Points</li>}
            {features.length > 0 && (
              <li>
                <strong>Features:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {features.map((feature: string, i: number) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-5 py-2 rounded-md font-bold bg-neutral-700 text-white hover:bg-neutral-600 transition-colors">
            Close
          </button>
          {service.price !== null && (
            <button
              onClick={() => onBuy(service)}
              className={`px-5 py-2 rounded-md font-bold transition-colors ${isPurchased ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed' : 'bg-primary text-black hover:bg-teal-300'}`}
              disabled={isPurchased}
            >
              {isPurchased ? 'Purchased' : `Buy for ${service.price} Points`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// MAIN COMPONENT 
const CybStore = () => {
  const { purchasedServices, purchaseService } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<{ message: string, isError: boolean } | null>(null);

  const handleBuy = async (service: Service) => {
    try {
      await purchaseService(service);
      setPurchaseStatus({ message: 'Purchase successful!', isError: false });
      setSelectedService(null); 
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setPurchaseStatus({ message: `Purchase failed: ${errorMessage}`, isError: true });
    }
  };

  useEffect(() => {
    invoke<Service[]>('get_all_services')
      .then(setServices)
      .catch(console.error);
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))], [services]);

  const filteredServices = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return services.filter(service =>
      (selectedCategory === 'All' || service.category === selectedCategory) &&
      (service.name?.toLowerCase().includes(lowercasedSearchTerm) ||
       service.description?.toLowerCase().includes(lowercasedSearchTerm) ||
       service.developer?.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [searchTerm, selectedCategory, services]);

  const purchasedServiceIds = useMemo(() => purchasedServices.map(s => s.id), [purchasedServices]);

  return (
    <div className="text-white p-5 h-full flex flex-col ">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
        <h1 className="text-3xl text-primary font-bold">CybStore</h1>
        {purchaseStatus && (
          <div className={`p-3 rounded-md text-sm ${purchaseStatus.isError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {purchaseStatus.message}
          </div>
        )}
      </header>

      <div className="flex mb-6 gap-4">
        <input
          type="text"
          placeholder="Search services, descriptions, developers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-3 rounded-md border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-primary"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 rounded-md border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:border-primary"
        >
          {categories.map((cat) => (
            <option key={cat ?? 'uncategorized'} value={cat ?? ''}>{cat ?? 'Uncategorized'}</option>
          ))}
        </select>
      </div>

      <main className=" flex-grow overflow-y-auto">
        <div className="flex flex-wrap  gap-2">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={setSelectedService}
            />
          ))}
        </div>
      </main>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBuy={handleBuy}
          isPurchased={purchasedServiceIds.includes(selectedService.id)}
        />
      )}
    </div>
  );
};

export default CybStore;
