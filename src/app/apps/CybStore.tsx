import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const services = [
  {
    id: 1,
    name: 'Quantum VPN',
    description: 'Ultra-secure VPN with quantum encryption.',
    price: 150,
    category: 'Security',
    features: ['Quantum-resistant encryption', 'Decentralized network', 'Zero-logging policy'],
    icon: '🛡️',
  },
  {
    id: 2,
    name: 'Aegis Firewall',
    description: 'AI-powered firewall that anticipates threats.',
    price: 300,
    category: 'Security',
    features: ['Predictive threat analysis', 'Automated rule generation', '24/7 active monitoring'],
    icon: '🧱',
  },
  {
    id: 3,
    name: 'Sentinel Antivirus',
    description: 'Next-gen antivirus with behavioral analysis.',
    price: 200,
    category: 'Security',
    features: ['Real-time behavior monitoring', 'Zero-day exploit protection', 'System performance optimization'],
    icon: '🔬',
  },
  {
    id: 4,
    name: 'Synapse Cloud',
    description: '1TB of decentralized, encrypted cloud storage.',
    price: 100,
    category: 'Productivity',
    features: ['End-to-end encryption', 'File sharding and distribution', 'Offline access'],
    icon: '☁️',
  },
  {
    id: 5,
    name: 'Nexus Code Editor',
    description: 'A collaborative code editor with AI assistance.',
    price: 250,
    category: 'Productivity',
    features: ['Real-time collaboration', 'AI-powered code completion', 'Integrated debugging tools'],
    icon: '📝',
  },
  {
    id: 6,
    name: 'Guardian Password Manager',
    description: 'Zero-knowledge password manager for ultimate security.',
    price: 120,
    category: 'Security',
    features: ['Zero-knowledge architecture', 'Biometric authentication', 'Secure password sharing'],
    icon: '🔑',
  },
];

// --- HELPER COMPONENTS ---
const Toast = ({ message, type, onClose }: { message: string, type: string, onClose: () => void }) => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    className={`fixed top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-black font-bold z-50 ${type === 'success' ? 'bg-primary' : 'bg-red-500'}`}>
    {message}
  </motion.div>
);

const ServiceCard = ({ service, onSelect, isOwned }: { service: any, onSelect: (service: any) => void, isOwned: boolean }) => (
  <motion.div
    layoutId={`card-${service.id}`}
    onClick={() => onSelect(service)}
    className="flex flex-col justify-between w-[200px] bg-white/10 backdrop-blur-md p-5 rounded-lg cursor-pointer border border-white/20 relative overflow-hidden transition-all duration-200 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-400/20"
  >
    {isOwned && (
      <div className="absolute top-2 right-2 bg-primary text-black px-2 py-1 rounded-md text-xs font-bold">
        Owned
      </div>
    )}
    <div className="text-4xl mb-4 text-center">{service.icon}</div>
    <h2 className="text-lg text-primary text-center font-bold">{service.name}</h2>
    <p className="text-xs text-gray-300 text-center mt-1">{service.description}</p>
    <div className="text-lg my-4 text-primary text-center font-bold">
      {service.price} Points
    </div>
  </motion.div>
);

const ServiceModal = ({ service, onClose, onBuy, isOwned }: { service: any, onClose: () => void, onBuy: (service: any) => void, isOwned: boolean }) => (
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
      <h2 className="text-3xl text-primary font-bold">{service.name}</h2>
      <p className="text-neutral-400 my-2">{service.description}</p>
      <ul className="list-none p-0 my-5">
        {service.features.map((feature: string, i: number) => (
          <li key={i} className="text-white mb-1">✅ {feature}</li>
        ))}
      </ul>
      <div className="text-2xl text-primary font-bold my-5">
        {service.price} Points
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => onBuy(service)}
          disabled={isOwned}
          className="px-5 py-2 rounded-md font-bold transition-colors disabled:cursor-not-allowed disabled:bg-neutral-600 bg-primary text-black"
        >
          {isOwned ? 'Owned' : 'Buy Now'}
        </button>
        <button onClick={onClose} className="px-5 py-2 rounded-md font-bold bg-neutral-600 text-white">
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// --- MAIN COMPONENT ---
const CybStore = () => {
  const [points, setPoints] = useState(1000);
  const [ownedItems, setOwnedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const categories = ['All', ...new Set(services.map((s) => s.category))];

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        (selectedCategory === 'All' || service.category === selectedCategory) &&
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, selectedCategory]);

  const showToast = (message: string, type: string) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 0);
  };

  const handleBuy = (service: any) => {
    if (ownedItems.includes(service.id)) {
      showToast('Item already owned', 'error');
      return;
    }
    if (points >= service.price) {
      setPoints(points - service.price);
      setOwnedItems([...ownedItems, service.id]);
      showToast('Purchase successful!', 'success');
      setSelectedService(null);
    } else {
      showToast('Not enough points!', 'error');
    }
  };

  return (
    <div className="text-white p-5 h-screen flex flex-col">
      <AnimatePresence>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-700">
        <h1 className="text-4xl text-primary font-bold">CybStore</h1>
        <div className="text-lg">
          Points: <span className="text-primary font-bold">{points}</span>
        </div>
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
            <option key={cat} value={cat}>{cat}</option>
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
              isOwned={ownedItems.includes(service.id)}
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
            isOwned={ownedItems.includes(selectedService.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CybStore;
