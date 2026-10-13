import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { UploadCloud, Check } from 'lucide-react';

interface UploadLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadLogoModal: React.FC<UploadLogoModalProps> = ({ isOpen, onClose }) => {
  const { updateBrandProfile, brandProfile, showToast } = useBrandGuard();
  const [logoInitials, setLogoInitials] = useState(brandProfile.logoText || 'AP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandProfile({ logoText: logoInitials.toUpperCase().slice(0, 3) });
    showToast('Brand logo asset updated for perceptual hash scanner', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload or Replace Brand Logo Asset"
      description="BrandGuard computes a cryptographic perceptual hash (pHash) of your logo to detect lookalike social avatars and cloned app icons."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-6 border-2 border-dashed border-slate-700 rounded-xl bg-navy-950/60 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center text-xl border border-cyan-500/40 mb-3 shadow-inner">
            {logoInitials.toUpperCase() || 'AP'}
          </div>
          <div className="text-slate-300 font-medium mb-1">
            Drop high-res vector logo (.SVG or .PNG)
          </div>
          <p className="text-[11px] text-slate-500 max-w-xs mb-3">
            Alpha transparency supported. Recommended resolution 512x512px.
          </p>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
            Browse Local File
          </span>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">
            Brand Logo Initials / Short Monogram
          </label>
          <input
            type="text"
            maxLength={3}
            value={logoInitials}
            onChange={(e) => setLogoInitials(e.target.value)}
            placeholder="AP"
            className="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 uppercase tracking-widest font-mono text-center font-bold focus:outline-none focus:border-cyan-500"
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
            Save & Recompute pHash
          </button>
        </div>
      </form>
    </Modal>
  );
};
