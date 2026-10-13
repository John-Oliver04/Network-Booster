import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  Download,
  Upload,
  X,
  FileCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { BoostSessionRecord } from '../types/network';
import { securityCrypto } from '../services/securityCrypto';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: BoostSessionRecord[];
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({
  isOpen,
  onClose,
  sessions
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [encryptedOutput, setEncryptedOutput] = useState<string | null>(null);
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptedCount, setDecryptedCount] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const deviceFingerprint = securityCrypto.getDeviceTokenFingerprint();
  const validSignaturesCount = sessions.filter(s => s.signatureValid).length;
  const isAllValid = sessions.length > 0 && validSignaturesCount === sessions.length;

  const handleEncryptVault = async () => {
    const rawJson = JSON.stringify(sessions);
    const result = await securityCrypto.encryptData(rawJson, passphrase.trim() || undefined);
    const bundle = JSON.stringify({
      version: 'netpulse_v1',
      device: deviceFingerprint,
      timestamp: Date.now(),
      cipher: result.cipherHex,
      salt: result.saltHex,
      iv: result.ivHex
    }, null, 2);

    setEncryptedOutput(bundle);
  };

  const handleDownloadEncryptedFile = () => {
    if (!encryptedOutput) return;
    const blob = new Blob([encryptedOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netpulse_encrypted_vault_${Date.now()}.npz`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyEncrypted = () => {
    if (!encryptedOutput) return;
    navigator.clipboard.writeText(encryptedOutput).catch(() => {});
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Cryptographic Security &amp; Audit Vault</h3>
              <p className="text-xs text-slate-400">Tamper-evident HMAC-SHA256 &amp; AES-GCM session protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Entropy Key Card */}
        <div className="my-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              Device HMAC Root Fingerprint
            </span>
            <span className="font-mono text-xs text-cyan-300 font-bold tabular-nums">
              {deviceFingerprint}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Audit Trail Verification</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {validSignaturesCount} / {sessions.length} SIGNATURES VALID
            </span>
          </div>
        </div>

        {/* AES-GCM Export Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Export Encrypted Session Backup
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Encrypts your complete connection telemetry history with 256-bit AES-GCM and PBKDF2 (100,000 iterations).
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Optional vault passphrase (default: device key)"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleEncryptVault}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shrink-0"
            >
              Generate Vault
            </button>
          </div>

          {encryptedOutput && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  AES-GCM 256-bit Ciphertext Ready
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyEncrypted}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadEncryptedFile}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save .npz</span>
                  </button>
                </div>
              </div>
              <pre className="font-mono text-[10px] text-slate-400 bg-slate-900 p-2.5 rounded-lg overflow-x-auto max-h-24">
                {encryptedOutput}
              </pre>
            </div>
          )}
        </div>

        {/* Security Constitution Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <FileCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Complies with zero-knowledge mobile client storage guidelines. All keys and hashes are generated entirely inside your browser sandbox via Web Crypto API.
          </span>
        </div>

      </div>
    </div>
  );
};
