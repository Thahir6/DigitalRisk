import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useBrandGuard } from '../../context/BrandGuardContext';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAppModal: React.FC<AddAppModalProps> = ({ isOpen, onClose }) => {
  const { addOfficialApp } = useBrandGuard();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<'Android' | 'iOS'>('Android');
  const [packageId, setPackageId] = useState('');
  const [publisher, setPublisher] = useState('AcmePay Technologies');
  const [version, setVersion] = useState('1.0.0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !packageId.trim()) return;

    addOfficialApp({
      name,
      platform,
      packageId,
      publisher,
      version,
      storeUrl: platform === 'Android' 
        ? `https://play.google.com/store/apps/details?id=${packageId}`
        : `https://apps.apple.com/app/id${Math.floor(100000000 + Math.random() * 900000000)}`,
    });

    setName('');
    setPackageId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Official Mobile Application"
      description="Register your official store app package to automatically flag copycat and modded APKs."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Application Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="AcmePay Mobile"
            className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as 'Android' | 'iOS')}
              className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="Android">Android (Google Play)</option>
              <option value="iOS">iOS (Apple App Store)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Version Release</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="4.8.2"
              className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Package ID / Bundle Identifier</label>
          <input
            type="text"
            required
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            placeholder="com.acmepay.mobile"
            className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Registered Store Publisher</label>
          <input
            type="text"
            required
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="AcmePay Technologies"
            className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold transition-colors"
          >
            Register Official App
          </button>
        </div>
      </form>
    </Modal>
  );
};
