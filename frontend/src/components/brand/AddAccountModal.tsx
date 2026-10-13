import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useBrandGuard } from '../../context/BrandGuardContext';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const { addOfficialSocial } = useBrandGuard();
  const [platform, setPlatform] = useState('Instagram');
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [accountId, setAccountId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim() || !displayName.trim()) return;

    addOfficialSocial({
      platform,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      displayName,
      profileUrl: profileUrl || `https://${platform.toLowerCase()}.com/${handle.replace('@', '')}`,
      accountId: accountId || `acc_${Date.now()}`,
    });

    // Reset and close
    setHandle('');
    setDisplayName('');
    setProfileUrl('');
    setAccountId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Official Social Account"
      description="Register your official channel to exclude it from false positive impersonation flags."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X">X (Twitter)</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Official Handle / Username</label>
          <input
            type="text"
            required
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@acmepay or acmepay-official"
            className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          >
          </input>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Display Name</label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="AcmePay Official"
            className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Profile URL (Optional)</label>
          <input
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://instagram.com/acmepay"
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
            Verify & Save Account
          </button>
        </div>
      </form>
    </Modal>
  );
};
