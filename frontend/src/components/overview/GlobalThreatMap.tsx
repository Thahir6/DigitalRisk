import React, { useState, useMemo } from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { 
  Globe2, 
  ShieldAlert, 
  Radar, 
  AlertTriangle, 
  Crosshair, 
  Activity, 
  ExternalLink, 
  Layers, 
  Wifi, 
  Maximize2,
  CheckCircle2,
  Box,
  Compass
} from 'lucide-react';
import { Finding } from '../../types';
import { CyberGlobe3D } from '../common/CyberGlobe3D';

interface ThreatNode {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  x: number; // SVG coordinate 0 - 1000
  y: number; // SVG coordinate 0 - 500
  severity: 'critical' | 'high' | 'medium';
  type: 'social' | 'app' | 'domain';
  platform: string;
  details: string;
  riskScore: number;
  findingId?: string;
  isSimulated: boolean;
}

export const GlobalThreatMap: React.FC = () => {
  const { 
    company, 
    brandProfile, 
    findings, 
    setSelectedFinding, 
    runNewScan, 
    isScanning,
    isDemoMode 
  } = useBrandGuard();

  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [activeVectorType, setActiveVectorType] = useState<'all' | 'social' | 'app'>('all');
  const [selectedNode, setSelectedNode] = useState<ThreatNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ThreatNode | null>(null);

  // Central Target Node representing the protected company
  const targetNode = useMemo(() => {
    return {
      name: brandProfile.brandName || company?.name || 'Enterprise HQ',
      domain: brandProfile.website || 'brand.corp',
      x: 480,
      y: 210,
      city: 'Global Asset Shield'
    };
  }, [brandProfile, company]);

  // Map findings into geographic threat vectors
  const threatNodes: ThreatNode[] = useMemo(() => {
    const coordinates = [
      { city: 'Frankfurt, DE', lat: 50.11, lng: 8.68, x: 530, y: 175 },
      { city: 'São Paulo, BR', lat: -23.55, lng: -46.63, x: 340, y: 360 },
      { city: 'London, UK', lat: 51.50, lng: -0.12, x: 490, y: 160 },
      { city: 'Singapore, SG', lat: 1.35, lng: 103.81, x: 770, y: 285 },
      { city: 'Tokyo, JP', lat: 35.67, lng: 139.65, x: 860, y: 200 },
      { city: 'Toronto, CA', lat: 43.65, lng: -79.38, x: 260, y: 170 },
      { city: 'Sydney, AU', lat: -33.86, lng: 151.20, x: 890, y: 395 },
      { city: 'Mumbai, IN', lat: 19.07, lng: 72.87, x: 690, y: 245 },
    ];

    return findings.slice(0, 8).map((finding, idx) => {
      const coord = coordinates[idx % coordinates.length];
      return {
        id: finding.id,
        name: finding.title,
        location: coord.city,
        lat: coord.lat,
        lng: coord.lng,
        x: coord.x,
        y: coord.y,
        severity: finding.riskSeverity as 'critical' | 'high' | 'medium',
        type: finding.type as 'social' | 'app' | 'domain',
        platform: finding.platform,
        details: finding.mainReason,
        riskScore: finding.riskScore,
        findingId: finding.id,
        isSimulated: isDemoMode || finding.id.startsWith('finding-')
      };
    });
  }, [findings, isDemoMode]);

  const filteredNodes = useMemo(() => {
    if (activeVectorType === 'all') return threatNodes;
    return threatNodes.filter(n => n.type === activeVectorType);
  }, [threatNodes, activeVectorType]);

  const handleInspectFinding = (findingId?: string) => {
    if (!findingId) return;
    const match = findings.find(f => f.id === findingId);
    if (match) {
      setSelectedFinding(match);
    }
  };

  return (
    <div className="relative rounded-3xl cyber-panel border border-cyan-500/25 overflow-hidden shadow-2xl transition-all">
      {/* Background World Grid Overlay */}
      <div className="absolute inset-0 cyber-dots-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-transparent to-[#060911]/60 pointer-events-none" />

      {/* Top Command Bar & HUD Controls */}
      <div className="relative z-10 px-6 py-4 border-b border-cyan-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Globe2 className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Global Threat Operations Center
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                DEFCON 2
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Active perimeter for <span className="text-cyan-300 font-semibold">{targetNode.name}</span> &bull; {threatNodes.length} active inbound threat vectors
            </p>
          </div>
        </div>

        {/* Vector Filters, 2D/3D Mode Switcher, & Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* 3D vs 2D Tactical Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-[11px] font-mono font-bold">
            <button
              onClick={() => setIs3DMode(true)}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                is3DMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>
            <button
              onClick={() => setIs3DMode(false)}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                !is3DMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>2D Tactical</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-navy-900/90 border border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setActiveVectorType('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVectorType === 'all' 
                  ? 'bg-cyan-500 text-navy-950 font-bold shadow-md shadow-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Signals ({threatNodes.length})
            </button>
            <button
              onClick={() => setActiveVectorType('social')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVectorType === 'social' 
                  ? 'bg-cyan-500 text-navy-950 font-bold shadow-md shadow-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Social Clones
            </button>
            <button
              onClick={() => setActiveVectorType('app')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVectorType === 'app' 
                  ? 'bg-cyan-500 text-navy-950 font-bold shadow-md shadow-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rogue APKs
            </button>
          </div>

          <button
            onClick={() => runNewScan('all')}
            disabled={isScanning}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-smooth btn-smooth-cyan flex items-center gap-1.5 shadow-sm"
          >
            <Radar className={`w-3.5 h-3.5 text-navy-950 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Ping Radar'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map / 3D Canvas */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[16/6.8] min-h-[380px] bg-[#050812] overflow-hidden select-none">
        
        {is3DMode ? (
          /* 3D WebGL Three.js Threat Visualization Mode */
          <div className="relative w-full h-full flex items-center justify-center">
            <CyberGlobe3D threatCount={filteredNodes.length + 4} className="w-full h-full min-h-[380px]" />

            {/* Floating 3D Threat Counter HUD */}
            <div className="absolute top-4 left-6 z-10 pointer-events-none">
              <div className="px-3 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 font-mono text-[11px] text-slate-300 shadow-xl space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-cyan-400 font-bold">3D THREAT NETWORK:</span>
                  <span className="text-white font-bold">{filteredNodes.length} VECTORS DETECTED</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Drag with mouse to inspect 3D planetary attack trajectories.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 2D Tactical SVG Coordinate Map Mode */
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <linearGradient id="threat-arc-gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="threat-arc-gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>

              <radialGradient id="target-glow">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* World Continents Schematic Representation */}
            <g opacity="0.22" fill="#0E223D" stroke="#1E3A5F" strokeWidth="0.8">
              <path d="M 120 100 Q 180 80 260 90 Q 310 130 280 190 Q 230 220 180 260 Q 140 210 110 160 Z" />
              <path d="M 180 250 L 220 280 L 210 320 L 160 270 Z" />
              <path d="M 280 280 Q 360 290 380 340 Q 360 420 310 460 Q 270 380 280 280 Z" />
              <path d="M 460 120 Q 520 110 560 130 Q 580 180 520 200 Q 470 190 460 140 Z" />
              <path d="M 440 130 L 470 110 L 460 150 Z" />
              <path d="M 460 210 Q 550 200 580 260 Q 560 360 500 400 Q 450 330 460 210 Z" />
              <path d="M 580 100 Q 720 90 840 130 Q 880 220 800 270 Q 700 280 610 220 Q 580 160 580 100 Z" />
              <path d="M 820 340 Q 910 330 920 380 Q 880 430 810 410 Q 790 370 820 340 Z" />
            </g>

            {/* Coordinate Grid Lines */}
            <g stroke="rgba(6, 182, 212, 0.08)" strokeWidth="0.7" strokeDasharray="3,6">
              <line x1="0" y1="125" x2="1000" y2="125" />
              <line x1="0" y1="250" x2="1000" y2="250" />
              <line x1="0" y1="375" x2="1000" y2="375" />
              <line x1="250" y1="0" x2="250" y2="500" />
              <line x1="500" y1="0" x2="500" y2="500" />
              <line x1="750" y1="0" x2="750" y2="500" />
            </g>

            {/* Central Protected Asset Node */}
            <circle cx={targetNode.x} cy={targetNode.y} r="80" fill="url(#target-glow)" />
            <circle cx={targetNode.x} cy={targetNode.y} r="32" fill="none" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" className="animate-pulse" />
            <circle cx={targetNode.x} cy={targetNode.y} r="18" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5" />
            <circle cx={targetNode.x} cy={targetNode.y} r="6" fill="#00f0ff" filter="url(#glow-cyan)" />

            {/* Live Threat Vector Arcs */}
            {filteredNodes.map((node) => {
              const midX = (node.x + targetNode.x) / 2;
              const midY = Math.min(node.y, targetNode.y) - 45;
              const isHovered = hoveredNode?.id === node.id || selectedNode?.id === node.id;
              const strokeColor = node.severity === 'critical' ? 'url(#threat-arc-gradient-red)' : 'url(#threat-arc-gradient-amber)';

              return (
                <g key={`arc-${node.id}`}>
                  <path
                    d={`M ${node.x} ${node.y} Q ${midX} ${midY} ${targetNode.x} ${targetNode.y}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHovered ? 2.5 : 1.2}
                    strokeOpacity={isHovered ? 1 : 0.65}
                    strokeDasharray={isHovered ? "none" : "4,4"}
                    className="transition-all duration-300"
                  />

                  {/* Animated Pulse Packet */}
                  <circle r={isHovered ? "3.5" : "2.5"} fill={node.severity === 'critical' ? '#ef4444' : '#f59e0b'}>
                    <animateMotion
                      path={`M ${node.x} ${node.y} Q ${midX} ${midY} ${targetNode.x} ${targetNode.y}`}
                      dur={`${2.5 + (node.riskScore % 3)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Render Threat Nodes on Map */}
            {filteredNodes.map((node) => {
              const isCritical = node.severity === 'critical';
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const markerColor = isCritical ? '#ef4444' : '#f59e0b';

              return (
                <g
                  key={`node-${node.id}`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="14"
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="1.2"
                    className="animate-pulse-ring origin-center"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected || isHovered ? "10" : "7"}
                    fill="rgba(11, 18, 35, 0.85)"
                    stroke={markerColor}
                    strokeWidth={isSelected || isHovered ? "2.2" : "1.5"}
                    filter={isCritical ? "url(#glow-red)" : "url(#glow-cyan)"}
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected || isHovered ? "4" : "3"}
                    fill={markerColor}
                  />
                  <text
                    x={node.x}
                    y={node.y - 12}
                    textAnchor="middle"
                    fill="#E2E8F0"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {node.location.split(',')[0]} [{node.riskScore}%]
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Floating Target HQ Badge (Center Overlay in 2D Mode) */}
        {!is3DMode && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ left: `${(targetNode.x / 1000) * 100}%`, top: `${(targetNode.y / 500) * 100}%` }}
          >
            <div className="mt-8 px-2.5 py-1 rounded-lg bg-navy-950/90 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 shadow-lg shadow-cyan-950/50 flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md">
              <Crosshair className="w-3 h-3 text-cyan-400 animate-spin-slow" />
              <span>HQ SHIELD: {targetNode.name}</span>
            </div>
          </div>
        )}

        {/* Floating Tactical Coordinate Readout (Bottom Left HUD) */}
        <div className="absolute bottom-4 left-5 z-10 flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-navy-950/80 backdrop-blur-md border border-cyan-500/20 text-[11px] font-mono text-slate-300 shadow-lg">
            <span className="text-cyan-400 font-bold">GRID SENSORS:</span> ACTIVE &bull; 240ms LATENCY
          </div>
          <div className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-navy-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400">
            LAT 37.77° N &bull; LON -122.41° W
          </div>
        </div>

        {/* Live vs Simulated Telemetry Distinguisher Badge (Bottom Right HUD) */}
        <div className="absolute bottom-4 right-5 z-10 flex items-center gap-2">
          {isDemoMode ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>SIMULATED HEURISTIC TELEMETRY</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>VERIFIED SENSOR NETWORK</span>
            </div>
          )}
        </div>

        {/* Interactive Threat Node Drawer / Popover Overlay */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-80 p-4 rounded-2xl cyber-panel-glow border border-red-500/40 text-xs shadow-2xl animate-in fade-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span className="font-bold text-white text-[13px] tracking-tight">
                  Vector Telemetry
                </span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white px-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Origin Node:</span>
                <span className="font-semibold text-slate-200">{selectedNode.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Threat Target:</span>
                <span className="font-mono font-bold text-pink-400">{selectedNode.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Risk Score:</span>
                <span className="font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30">
                  {selectedNode.riskScore}/100 CRITICAL
                </span>
              </div>

              <div className="p-2 rounded-xl bg-navy-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                {selectedNode.details}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleInspectFinding(selectedNode.findingId)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold btn-smooth btn-smooth-cyan flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Investigate in SOC</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
