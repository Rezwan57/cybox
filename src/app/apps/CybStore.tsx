import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';
import Image from 'next/image';
import { useAuth } from '@/Context/AuthContext';

// --- TypeScript Interfaces ---
interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  features: string | null; 
  icon_path: string | null;
  version: string | null;
  developer: string | null;
  release_date: string | null;
  is_important: boolean | null;
}


const ServiceCard = ({ service, onSelect }: { service: Service, onSelect: (service: Service) => void }) => (
  <motion.div
    layoutId={`card-${service.id}`}
    onClick={() => onSelect(service)}
    className="flex flex-col justify-between w-[200px] bg-white/10 backdrop-blur-md p-5 rounded-lg cursor-pointer border border-white/20 relative overflow-hidden transition-all duration-200 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-400/20"
  >
    <div className="text-4xl mb-4 text-center">
      {service.icon_path && <Image src={service.icon_path} alt={`${service.name} Icon`} width={64} height={64} />}
    </div>
    <h2 className="text-lg text-primary text-center font-bold">{service.name}</h2>
    <p className="text-xs text-gray-300 text-center mt-1">{service.description}</p>
    <div className="text-sm text-gray-400 text-center mt-2">
      Developer: {service.developer}
    </div>
  </motion.div>
);

const ServiceModal = ({ service, onClose, onBuy, isPurchased }: { service: Service, onClose: () => void, onBuy: (service: Service) => void, isPurchased: boolean }) => {
  const features = useMemo(() => {
    try {
      return service.features ? JSON.parse(service.features) : [];
    } catch (e) {
      return [];
    }
  }, [service.features]);

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
  >
    <motion.div
      layoutId={`card-${service.id}`}
      className="w-[450px] bg-neutral-800 p-8 rounded-xl border-2 border-primary"
    >
      <div className="flex items-center mb-4">
        {service.icon_path && <Image src={service.icon_path} alt={`${service.name} Icon`} width={80} height={80} className="mr-4" />}
        <div>
          <h2 className="text-3xl text-primary font-bold">{service.name}</h2>
          <p className="text-neutral-400 text-sm">by {service.developer}</p>
        </div>
      </div>
      <p className="text-neutral-400 my-2">{service.description}</p>
      <ul className="list-none p-0 my-5 text-white">
        {service.category && <li><strong>Category:</strong> {service.category}</li>}
        {service.version && <li><strong>Version:</strong> {service.version}</li>}
        {service.release_date && <li><strong>Release Date:</strong> {service.release_date}</li>}
        {service.is_important !== null && <li><strong>Important:</strong> {service.is_important ? 'Yes' : 'No'}</li>}
        {service.price !== null && <li><strong>Price:</strong> {service.price} Points</li>}
        {features.length > 0 && (
          <>
            <li><strong>Features:</strong></li>
            <ul className="list-disc list-inside ml-4">
              {features.map((feature: string, i: number) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </>
        )}
      </ul>
      <div className="flex justify-end gap-4">
        <button onClick={onClose} className="px-5 py-2 rounded-md font-bold bg-neutral-600 text-white">
          Close
        </button>
        {service.price !== null && (
          <button 
            onClick={() => onBuy(service)} 
            className={`px-5 py-2 rounded-md font-bold ${isPurchased ? 'bg-neutral-500 text-neutral-300' : 'bg-primary text-black'}`}
            disabled={isPurchased}
          >
            {isPurchased ? 'Already Purchased' : `Buy for ${service.price} Points`}
          </button>
        )}
      </div>
    </motion.div>
  </motion.div>
)};

// --- MAIN COMPONENT ---
const CybStore = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [purchasedServiceIds, setPurchasedServiceIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<{ message: string, isError: boolean } | null>(null);

  const handleBuy = async (service: Service) => {
    if (service.price === null || !user) return;

    try {
      await invoke('purchase_service', { 
        userId: user.id,
        serviceId: service.id,
        price: service.price 
      });
      setPurchaseStatus({ message: 'Purchase successful!', isError: false });
      setPurchasedServiceIds([...purchasedServiceIds, service.id]); // Update purchased list
      setSelectedService(null); // Close modal on success
    } catch (error) {
      setPurchaseStatus({ message: `Purchase failed: ${error}`, isError: true });
    }
  };

  useEffect(() => {
    // Fetch services
    invoke<Service[]>('get_all_services')
      .then(setServices)
      .catch(console.error);

    // Fetch purchased services
    if (user) {
      invoke<number[]>('get_user_services', { userId: user.id })
        .then(setPurchasedServiceIds)
        .catch(console.error);
    }
  }, [user]);

  const categories = ['All', ...new Set(services.map((service) => service.category))];

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        (selectedCategory === 'All' || service.category === selectedCategory) &&
        (service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         service.developer?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, selectedCategory, services]);

  return (
    <div className="text-white p-5 h-screen flex flex-col">
      <header className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-700">
        <h1 className="text-4xl text-primary font-bold">CybStore</h1>
        {purchaseStatus && (
          <div className={`p-2 rounded-md ${purchaseStatus.isError ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
            {purchaseStatus.message}
          </div>
        )}
      </header>

      <div className="flex mb-5">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 rounded-md border border-neutral-700 bg-neutral-800 text-white"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="ml-2 p-2 rounded-md border border-neutral-700 bg-neutral-800 text-white"
        >
          {categories.map((cat) => (
            <option key={cat ?? ''} value={cat ?? ''}>{cat ?? 'Uncategorized'}</option>
          ))}
        </select>
      </div>

      <main className="flex-grow ">
        <motion.div layout className="flex flex-wrap justify-center gap-5">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={setSelectedService}
            />
          ))}
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBuy={handleBuy}
            isPurchased={purchasedServiceIds.includes(selectedService.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CybStore;
