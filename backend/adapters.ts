/**
 * Clean Adapter Interfaces for Digital Risk Protection
 * These define modular boundaries for future live integrations with
 * Social Media APIs, App Store Crawlers, and Threat Intelligence Feeds.
 */

export interface CandidateAccount {
  platform: 'Instagram' | 'LinkedIn' | 'X' | 'Facebook' | 'Telegram';
  name: string;
  username: string;
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  followersCount?: number;
  isVerified: boolean;
  externalLinks?: string[];
}

export interface CandidateAppListing {
  store: 'Google Play' | 'Apple App Store' | 'Third-party APK';
  appName: string;
  packageId: string;
  developerName: string;
  storeUrl: string;
  iconUrl?: string;
  description?: string;
  requestedPermissions?: string[];
  version?: string;
}

export interface DomainThreatRecord {
  domain: string;
  registrar?: string;
  registrationDate?: string;
  ipAddresses?: string[];
  hasSsl: boolean;
  dnsRecords?: Record<string, string[]>;
  phishingReportCount?: number;
}

export interface SocialMediaAdapter {
  searchCandidates(brandKeywords: string[]): Promise<CandidateAccount[]>;
  getProfileDetails(platform: string, username: string): Promise<CandidateAccount | null>;
  submitTakedownRequest(profileUrl: string, justification: string): Promise<{ ticketId: string; status: string }>;
}

export interface AppStoreAdapter {
  searchApps(brandKeywords: string[]): Promise<CandidateAppListing[]>;
  getAppDetails(store: string, packageId: string): Promise<CandidateAppListing | null>;
  compareAppManifest(officialPackage: string, candidatePackage: string): Promise<{ permissionDiffs: string[]; riskFlags: string[] }>;
}

export interface ThreatIntelligenceAdapter {
  lookupDomain(urlOrDomain: string): Promise<DomainThreatRecord>;
  checkReputation(domain: string): Promise<{ isBlacklisted: boolean; threatCategories: string[]; confidence: number }>;
}

/**
 * Mock implementation of adapters that simulate realistic background telemetry
 */
export class MockSocialMediaAdapter implements SocialMediaAdapter {
  async searchCandidates(brandKeywords: string[]): Promise<CandidateAccount[]> {
    return [
      {
        platform: 'Telegram',
        name: 'AcmePay Community Bot',
        username: '@AcmePayBonusBot',
        profileUrl: 'https://t.me/AcmePayBonusBot',
        bio: 'Exclusive welcome bonuses for AcmePay users. Claim reward token now.',
        isVerified: false,
        externalLinks: ['https://acmepay-bonus-portal.online'],
      },
    ];
  }

  async getProfileDetails(_platform: string, _username: string): Promise<CandidateAccount | null> {
    return null;
  }

  async submitTakedownRequest(_profileUrl: string, _justification: string) {
    return { ticketId: 'TKT-' + Math.floor(100000 + Math.random() * 900000), status: 'submitted' };
  }
}

export class MockAppStoreAdapter implements AppStoreAdapter {
  async searchApps(brandKeywords: string[]): Promise<CandidateAppListing[]> {
    return [
      {
        store: 'Google Play',
        appName: 'AcmePay Lite Quick Transfer',
        packageId: 'com.acme.quickpay.lite',
        developerName: 'Swift Apex Apps LTD',
        storeUrl: 'https://play.google.com/store/apps/details?id=com.acme.quickpay.lite',
        description: 'Lightweight payments and balance check for AcmePay customers.',
        requestedPermissions: ['READ_CONTACTS', 'READ_SMS'],
      },
    ];
  }

  async getAppDetails(_store: string, _packageId: string): Promise<CandidateAppListing | null> {
    return null;
  }

  async compareAppManifest(_official: string, _candidate: string) {
    return {
      permissionDiffs: ['READ_SMS', 'RECEIVE_SMS'],
      riskFlags: ['High risk permission requested without declaration'],
    };
  }
}

export class MockThreatIntelligenceAdapter implements ThreatIntelligenceAdapter {
  async lookupDomain(urlOrDomain: string): Promise<DomainThreatRecord> {
    const domain = urlOrDomain.replace(/^https?:\/\//, '').split('/')[0];
    return {
      domain,
      registrar: 'NameCheap Privacy Services',
      registrationDate: '2026-10-09',
      hasSsl: true,
      phishingReportCount: 4,
    };
  }

  async checkReputation(domain: string) {
    const isSuspicious = !domain.includes('acmepay.com');
    return {
      isBlacklisted: isSuspicious,
      threatCategories: isSuspicious ? ['phishing', 'brand_impersonation'] : [],
      confidence: 0.88,
    };
  }
}
