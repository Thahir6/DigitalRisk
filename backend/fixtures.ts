import { Database } from 'sql.js';
import bcrypt from 'bcryptjs';

export function insertFinding(db: Database, companyId: string, f: any, now: string) {
  db.run(
    `INSERT INTO findings (
      id, company_id, type, reference_id, title, platform, username_or_package, candidate_url,
      risk_severity, risk_score, confidence, status, main_reason, detailed_reason,
      detected_time, first_seen, last_seen, publisher_or_owner, candidate_website, description,
      avatar_color, avatar_initials, lookalike_data, connected_campaign, is_demo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    [
      f.id,
      companyId,
      f.type,
      f.id,
      f.title,
      f.platform,
      f.usernameOrPackage,
      f.candidateUrl,
      f.riskSeverity,
      f.riskScore,
      f.confidence,
      f.status || 'New',
      f.mainReason,
      f.detailedReason,
      f.detectedTime || '10 mins ago',
      f.firstSeen || '2 days ago',
      f.lastSeen || '10 mins ago',
      f.publisherOrOwner || '',
      f.candidateWebsite || '',
      f.description || '',
      f.avatarColor || 'bg-cyan-500/20 text-cyan-400',
      f.avatarInitials || 'FL',
      f.lookalike ? JSON.stringify(f.lookalike) : null,
      f.connectedCampaign ? JSON.stringify(f.connectedCampaign) : null,
      now,
      now,
    ]
  );

  // Signals
  if (f.signals) {
    for (const sig of f.signals) {
      db.run(
        `INSERT INTO finding_signals (id, finding_id, signal_type, title, explanation, strength, icon_name)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sig.id, f.id, sig.iconName || 'name', sig.title, sig.explanation, sig.strength, sig.iconName || 'name']
      );
    }
  }

  // Evidence
  if (f.evidence) {
    db.run(
      `INSERT INTO evidence (id, finding_id, type, url_or_path, timestamp, description, source, sha256_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `${f.id}-ev`,
        f.id,
        'screenshot',
        f.evidence.rawUrl || f.candidateUrl,
        f.evidence.detectedAt || now,
        f.evidence.screenshotLabel || 'Telemetry capture',
        f.evidence.source || 'Threat Intelligence Engine',
        f.evidence.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      ]
    );
  }

  // Timeline Notes
  if (f.timeline) {
    for (const t of f.timeline) {
      db.run(
        `INSERT INTO notes (id, finding_id, user_id, user_name, role, action, text, created_at)
         VALUES (?, ?, 'system-crawler', ?, ?, ?, ?, ?)`,
        [t.id, f.id, t.author || 'SecOps Bot', t.role || 'System', t.action || 'Detection', t.note || '', t.timestamp || now]
      );
    }
  }
}

export function seedNikeFixtures(db: Database, now: string) {
  const companyId = 'comp-nike';
  const userId = 'user-nike-sarah';
  const passwordHash = bcrypt.hashSync('password123', 10);

  // 1. Company
  db.run(
    `INSERT INTO companies (id, name, website, industry, email_domain, setup_status, created_at)
     VALUES (?, ?, ?, ?, ?, 'active', ?)`,
    [companyId, 'Nike Global', 'https://nike.com', 'Athletic Apparel & Footwear', 'nike.com', now]
  );

  // 2. User
  db.run(
    `INSERT INTO users (id, name, email, password_hash, company_id, role, created_at, last_login, status)
     VALUES (?, ?, ?, ?, ?, 'Brand Protection Lead', ?, ?, 'active')`,
    [userId, 'Sarah Jenkins', 'sarah.jenkins@nike.com', passwordHash, companyId, now, now]
  );

  // 3. Official Assets
  const assets = [
    { id: 'nike-ast-1', type: 'domain', name: 'Official Corporate Domain', url: 'https://nike.com', platform: 'Web Domain', account_id: 'nike.com', pub: 'Nike Inc.' },
    { id: 'nike-ast-2', type: 'social', name: 'Nike Official Instagram', url: 'https://instagram.com/nike', platform: 'Instagram', account_id: '@nike', pub: 'Nike Inc.' },
    { id: 'nike-ast-3', type: 'social', name: 'Nike Sportswear Instagram', url: 'https://instagram.com/nikesportswear', platform: 'Instagram', account_id: '@nikesportswear', pub: 'Nike Inc.' },
    { id: 'nike-ast-4', type: 'social', name: 'Nike Verified X Channel', url: 'https://x.com/nike', platform: 'X', account_id: '@nike', pub: 'Nike Inc.' },
    { id: 'nike-ast-5', type: 'app', name: 'Nike: Shoes, Apparel & Stories', url: 'https://play.google.com/store/apps/details?id=com.nike.omega', platform: 'Google Play', account_id: 'com.nike.omega', package_id: 'com.nike.omega', pub: 'Nike Inc.' },
    { id: 'nike-ast-6', type: 'app', name: 'Nike SNKRS App', url: 'https://play.google.com/store/apps/details?id=com.nike.snkrs', platform: 'Google Play', account_id: 'com.nike.snkrs', package_id: 'com.nike.snkrs', pub: 'Nike Inc.' },
  ];

  for (const a of assets) {
    db.run(
      `INSERT INTO brand_assets (id, company_id, type, name, url, platform, account_id, package_id, publisher, verification_status, verification_method, archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified_official', 'brand_trademark_registry', 0, ?, ?)`,
      [a.id, companyId, a.type, a.name, a.url, a.platform, a.account_id, a.package_id || null, a.pub, now, now]
    );
  }

  // 4. Link Checks
  const linkChecks = [
    {
      id: 'chk-nk-1',
      url: 'https://nike-airjordan-clearance.store/drop',
      checked_domain: 'nike-airjordan-clearance.store',
      official_domain: 'nike.com',
      verdict: 'Likely phishing',
      risk_severity: 'critical',
      risk_score: 94,
      confidence: 'High',
      redirect_info: 'HTTP 302 -> /checkout/stolen-card',
      page_title: 'Nike & Jordan Factory Clearance Sale - Up to 85% Off',
      screenshot_label: 'Counterfeit sneaker store soliciting full payment card details',
      why_flagged: 'Domain registered 48 hours ago in Russia. Uses trademarked Swoosh & Jumpman logos without authorization.',
      recommended_action: 'Issue UDRP domain dispute and brand takedown request to host.',
      checked_at: '15 mins ago',
    },
    {
      id: 'chk-nk-2',
      url: 'https://nike.com/launch',
      checked_domain: 'nike.com',
      official_domain: 'nike.com',
      verdict: 'Approved',
      risk_severity: 'low',
      risk_score: 2,
      confidence: 'High',
      redirect_info: 'None (Direct SSL 200 OK)',
      page_title: 'SNKRS Launch Calendar - Upcoming Drops',
      screenshot_label: 'Official Nike SNKRS Release Schedule',
      why_flagged: 'Exact match with verified corporate domain nike.com. Valid TLS certification.',
      recommended_action: 'Verified official corporate destination. No action needed.',
      checked_at: '2 hours ago',
    },
    {
      id: 'chk-nk-3',
      url: 'https://nike-exclusive-raffle.cc',
      checked_domain: 'nike-exclusive-raffle.cc',
      official_domain: 'nike.com',
      verdict: 'Suspicious',
      risk_severity: 'high',
      risk_score: 82,
      confidence: 'High',
      redirect_info: 'HTTP 301 -> /auth/phone-login',
      page_title: 'Travis Scott x Air Jordan 1 Low Guaranteed Entry',
      screenshot_label: 'Fake raffle portal harvesting cell phone numbers and OTPs',
      why_flagged: 'Impersonates official SNKRS draw mechanism. Unauthorized promotional campaign.',
      recommended_action: 'Block in corporate firewall and submit domain abuse report.',
      checked_at: '5 hours ago',
    },
  ];

  for (const lc of linkChecks) {
    db.run(
      `INSERT INTO link_checks (id, company_id, url, checked_domain, official_domain, verdict, risk_severity, risk_score, confidence, redirect_info, page_title, screenshot_label, why_flagged, recommended_action, checked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lc.id, companyId, lc.url, lc.checked_domain, lc.official_domain, lc.verdict, lc.risk_severity, lc.risk_score, lc.confidence, lc.redirect_info, lc.page_title, lc.screenshot_label, lc.why_flagged, lc.recommended_action, lc.checked_at]
    );
  }

  // 5. Findings (14 tailored Nike findings)
  const nikeFindings = [
    {
      id: 'find-nk-1',
      title: 'Nike SNKRS VIP Early Access Bot',
      type: 'social',
      platform: 'Telegram',
      usernameOrPackage: '@nike_snkrs_vip_raffle',
      candidateUrl: 'https://t.me/nike_snkrs_vip_raffle',
      riskSeverity: 'critical',
      riskScore: 96,
      confidence: 'High',
      status: 'New',
      mainReason: 'Deceptive Telegram channel collecting credit cards under promise of guaranteed Travis Scott sneaker raffle wins',
      detailedReason: 'Automated Telegram bot requesting advance deposit payments for counterfeit Jordan 1 Retro Low sneakers. Uses official SNKRS graphics.',
      publisherOrOwner: 'SneakerHeads Direct Syndicate',
      candidateWebsite: 'https://snkrs-direct-bypass.cc',
      description: 'Exclusive SNKRS Bot & Auto-Checkout tool for high-heat Nike releases.',
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: 'NK',
      lookalike: {
        official: 'Nike SNKRS',
        candidate: 'Nike SNKRS VIP Early Access Bot',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'Nike SNKRS', isDifferent: false },
          { text: ' VIP Early Access Bot', isDifferent: true, differenceLabel: 'Malicious automation keyword' },
        ],
        explanation: 'Adds "VIP Early Access Bot" to lure sneaker collectors into giving debit card details.',
      },
      signals: [
        { id: 'sig-nk-1a', title: 'Card theft trap', explanation: 'Directs users to phishing payment portal.', strength: 'Critical', iconName: 'domain' },
        { id: 'sig-nk-1b', title: 'Unauthorized trademark', explanation: 'Utilizes proprietary SNKRS launch imagery.', strength: 'High', iconName: 'logo' },
      ],
      timeline: [
        { id: 'tm-nk-1', author: 'Crawler Bot', role: 'Telemetry', action: 'Detected', note: 'Flagged via Telegram threat scanner.', timestamp: '10 mins ago' },
      ],
    },
    {
      id: 'find-nk-2',
      title: 'Nike Clearance Outlet Official Direct',
      type: 'social',
      platform: 'Instagram',
      usernameOrPackage: '@nike_clearance_outlet_official',
      candidateUrl: 'https://instagram.com/nike_clearance_outlet_official',
      riskSeverity: 'high',
      riskScore: 88,
      confidence: 'High',
      status: 'Investigating',
      mainReason: 'Unverified Instagram storefront using stolen swoosh branding and advertising 80% off factory outlet shoes',
      detailedReason: 'Running sponsored reels linking to a cloned Shopify storefront selling replica Dunk Low sneakers.',
      publisherOrOwner: 'Apex Apparel Dist.',
      candidateWebsite: 'https://nike-factory-clearance.biz',
      description: 'Official Nike Outlet Overstock & Clearance Warehouse Sale.',
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: 'NO',
      lookalike: {
        official: '@nike',
        candidate: '@nike_clearance_outlet_official',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@nike', isDifferent: false },
          { text: '_clearance_outlet_official', isDifferent: true, differenceLabel: 'Scam outlet affix' },
        ],
        explanation: 'Pairs Nike trademark with clearance words to fabricate liquidation authenticity.',
      },
      signals: [
        { id: 'sig-nk-2a', title: 'Counterfeit distribution', explanation: 'Links lead to unverified counterfeit merchant.', strength: 'High', iconName: 'desc' },
        { id: 'sig-nk-2b', title: 'Logo misappropriation', explanation: 'Copies verified profile avatar.', strength: 'High', iconName: 'logo' },
      ],
    },
    {
      id: 'find-nk-3',
      title: 'com.nike.airmax.free.shoes',
      type: 'app',
      platform: 'Third-party APK',
      usernameOrPackage: 'com.nike.airmax.free.shoes',
      candidateUrl: 'https://apkpure-mirror.live/app/com.nike.airmax.free.shoes',
      riskSeverity: 'critical',
      riskScore: 95,
      confidence: 'High',
      status: 'New',
      mainReason: 'Trojanized Android APK soliciting device SMS and contact permissions while promising free shoes',
      detailedReason: 'Malware application posing as a Nike loyalty rewards app. Exfiltrates phone address books and SMS verification codes.',
      publisherOrOwner: 'Free Kicks Digital Ltd',
      candidateWebsite: 'https://free-kicks-promo.net',
      description: 'Official Nike Air Max 90 Day Rewards. Download now for free pair giveaway.',
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: 'AM',
      lookalike: {
        official: 'com.nike.omega',
        candidate: 'com.nike.airmax.free.shoes',
        differenceType: 'unauthorized_subdomain',
        highlightedParts: [
          { text: 'com.nike.', isDifferent: false },
          { text: 'airmax.free.shoes', isDifferent: true, differenceLabel: 'Rogue package suffix' },
        ],
        explanation: 'Prefixes package identifier with com.nike to bypass Android permission safety warnings.',
      },
      signals: [
        { id: 'sig-nk-3a', title: 'Spyware permissions', explanation: 'Requests READ_SMS and READ_CONTACTS permissions.', strength: 'Critical', iconName: 'permission' },
        { id: 'sig-nk-3b', title: 'Unsigned publisher', explanation: 'Not signed by official Nike developer certificate.', strength: 'Critical', iconName: 'package' },
      ],
    },
    {
      id: 'find-nk-4',
      title: 'Nike Global Customer Support Helpdesk',
      type: 'social',
      platform: 'X',
      usernameOrPackage: '@nike_helpdesk_care',
      candidateUrl: 'https://x.com/nike_helpdesk_care',
      riskSeverity: 'high',
      riskScore: 82,
      confidence: 'High',
      status: 'New',
      mainReason: 'Impersonating Nike support agents replying to distressed buyers asking for order payment details',
      detailedReason: 'Monitors @NikeService mentions on X and intercepts customers whose orders are delayed, sending phishing refund forms.',
      publisherOrOwner: 'Helpdesk Global Services',
      candidateWebsite: 'https://nike-order-refunds.cc',
      description: 'Official 24/7 Nike Customer Escalation & Refund Care team.',
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: 'NH',
      lookalike: {
        official: '@nike',
        candidate: '@nike_helpdesk_care',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@nike', isDifferent: false },
          { text: '_helpdesk_care', isDifferent: true, differenceLabel: 'Fake support label' },
        ],
        explanation: 'Fakes official customer care handle to intercept consumer inquiries.',
      },
      signals: [
        { id: 'sig-nk-4a', title: 'Credential phishing', explanation: 'Sends direct messages with credit card refund forms.', strength: 'High', iconName: 'desc' },
      ],
    },
    {
      id: 'find-nk-5',
      title: 'Nike Reps Wholesale Factory Direct',
      type: 'social',
      platform: 'Facebook',
      usernameOrPackage: '@nike_factory_reps_direct',
      candidateUrl: 'https://facebook.com/nike_factory_reps_direct',
      riskSeverity: 'high',
      riskScore: 86,
      confidence: 'High',
      status: 'Likely impersonation',
      mainReason: 'Counterfeit footwear distribution syndicate using Nike trademarks',
      detailedReason: 'Large Facebook page with 45K followers advertising 1:1 replica Air Jordan and Kobe basketball shoes.',
      publisherOrOwner: 'Putian Shoes Trading Co.',
      candidateWebsite: 'https://reps-sneaker-vault.com',
      description: 'Wholesale direct Nike manufacturer supplier.',
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: 'NR',
      lookalike: {
        official: 'Nike',
        candidate: 'Nike Reps Wholesale Factory Direct',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'Nike', isDifferent: false },
          { text: ' Reps Wholesale Factory Direct', isDifferent: true, differenceLabel: 'Counterfeit keyword' },
        ],
        explanation: 'Publicly markets counterfeit shoes using Nike registered trademarks.',
      },
      signals: [
        { id: 'sig-nk-5a', title: 'Counterfeit sales', explanation: 'Direct commercial catalog of replica footwear.', strength: 'High', iconName: 'name' },
      ],
    },
    {
      id: 'find-nk-6',
      title: 'com.nike.snkrs.botpass',
      type: 'app',
      platform: 'Third-party APK',
      usernameOrPackage: 'com.nike.snkrs.botpass',
      candidateUrl: 'https://snkrs-pass-mod.org/app.apk',
      riskSeverity: 'high',
      riskScore: 84,
      confidence: 'High',
      status: 'Investigating',
      mainReason: 'Rogue utility claiming automated checkout for SNKRS app, logs user payment cards',
      detailedReason: 'Promoted on Discord servers as a sneaker bot. Captures Nike account passwords and CVV numbers.',
      publisherOrOwner: 'CookGroup Tech',
      candidateWebsite: 'https://snkrs-pass-mod.org',
      description: 'SNKRS Pass Bypass & Auto-Reserve Bot tool.',
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: 'SB',
      lookalike: {
        official: 'com.nike.snkrs',
        candidate: 'com.nike.snkrs.botpass',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'com.nike.snkrs', isDifferent: false },
          { text: '.botpass', isDifferent: true, differenceLabel: 'Malicious extension' },
        ],
        explanation: 'Appends .botpass to genuine SNKRS package identifier.',
      },
      signals: [
        { id: 'sig-nk-6a', title: 'Account hijacking', explanation: 'Intercepts Nike Member OAuth tokens.', strength: 'Critical', iconName: 'package' },
      ],
    },
    {
      id: 'find-nk-7',
      title: 'Nike Running Community Rewards',
      type: 'social',
      platform: 'Telegram',
      usernameOrPackage: '@nike_run_rewards_club',
      candidateUrl: 'https://t.me/nike_run_rewards_club',
      riskSeverity: 'medium',
      riskScore: 68,
      confidence: 'Medium',
      status: 'New',
      mainReason: 'Phishing campaign distributing survey links requesting personal identification for free Pegasus shoes',
      detailedReason: 'Uses Nike Run Club branding to bait users into completing paid subscription surveys.',
      publisherOrOwner: 'Affiliate Marketing Ops',
      candidateWebsite: 'https://running-rewards-claim.net',
      description: 'Official Nike Running challenge rewards and free member giveaways.',
      avatarColor: 'bg-amber-500/20 text-amber-400',
      avatarInitials: 'NRC',
      lookalike: {
        official: 'Nike Run Club',
        candidate: 'Nike Running Community Rewards',
        differenceType: 'character_variation',
        highlightedParts: [
          { text: 'Nike Run', isDifferent: false },
          { text: 'ning Community Rewards', isDifferent: true, differenceLabel: 'Misleading variation' },
        ],
        explanation: 'Mimics Nike Run Club program to capture survey leads.',
      },
      signals: [
        { id: 'sig-nk-7a', title: 'Survey scam', explanation: 'Routes users to malicious subscription paywalls.', strength: 'Medium', iconName: 'desc' },
      ],
    },
    {
      id: 'find-nk-8',
      title: 'Nike Golf Apparel Closeouts',
      type: 'social',
      platform: 'Instagram',
      usernameOrPackage: '@nike_golf_closeout_deals',
      candidateUrl: 'https://instagram.com/nike_golf_closeout_deals',
      riskSeverity: 'medium',
      riskScore: 64,
      confidence: 'Medium',
      status: 'New',
      mainReason: 'Unverified third-party dropshipper using Nike Swoosh and golf collection banners without authorization',
      detailedReason: 'Selling low quality unbranded golf shirts with counterfeit Nike embroidered logos.',
      publisherOrOwner: 'Golf Styles Online',
      candidateWebsite: 'https://golf-closeout-depot.com',
      description: 'Premium Nike Golf shirts, caps, and spikes at 70% discount.',
      avatarColor: 'bg-amber-500/20 text-amber-400',
      avatarInitials: 'NG',
      lookalike: {
        official: '@nike',
        candidate: '@nike_golf_closeout_deals',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@nike', isDifferent: false },
          { text: '_golf_closeout_deals', isDifferent: true, differenceLabel: 'Deceptive category suffix' },
        ],
        explanation: 'Combines Nike trademark with golf category and closeout deals.',
      },
      signals: [
        { id: 'sig-nk-8a', title: 'Trademark infringement', explanation: 'Uses copyright golf tournament imagery.', strength: 'Medium', iconName: 'logo' },
      ],
    },
    {
      id: 'find-nk-9',
      title: 'Nike Jordan Vintage Collectors Club',
      type: 'social',
      platform: 'Facebook',
      usernameOrPackage: '@nike_jordan_collectors_archive',
      candidateUrl: 'https://facebook.com/nike_jordan_collectors_archive',
      riskSeverity: 'low',
      riskScore: 38,
      confidence: 'Medium',
      status: 'Investigating',
      mainReason: 'Fan archive group using brand logo without official disclaimer. Low risk of direct fraud.',
      detailedReason: 'Community fan group discussing 1985 Jordan 1 retros. Displays Nike Jumpman logo without official partner disclaimer.',
      publisherOrOwner: 'Private Administrator',
      candidateWebsite: '',
      description: 'Archive of OG vintage Jordan sneakers and catalog shoots.',
      avatarColor: 'bg-slate-500/20 text-slate-300',
      avatarInitials: 'JC',
      lookalike: {
        official: 'Nike',
        candidate: 'Nike Jordan Vintage Collectors Club',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'Nike Jordan', isDifferent: false },
          { text: ' Vintage Collectors Club', isDifferent: true, differenceLabel: 'Fan community label' },
        ],
        explanation: 'Fan page utilizing trademarked imagery without fraudulent transaction intent.',
      },
      signals: [
        { id: 'sig-nk-9a', title: 'Logo usage', explanation: 'Unofficial use of Jumpman logo in group banner.', strength: 'Low', iconName: 'logo' },
      ],
    },
    {
      id: 'find-nk-10',
      title: 'Nike SB Skateboarding Crew',
      type: 'social',
      platform: 'X',
      usernameOrPackage: '@nike_sb_regional_crew',
      candidateUrl: 'https://x.com/nike_sb_regional_crew',
      riskSeverity: 'low',
      riskScore: 32,
      confidence: 'Low',
      status: 'Dismissed',
      mainReason: 'Unofficial regional skate enthusiast account with benign fan content',
      detailedReason: 'Posts local skateboarding clips. Has clear disclaimer in bio: "Fan account not affiliated with Nike Inc."',
      publisherOrOwner: 'Skate Portland Crew',
      candidateWebsite: '',
      description: 'Portland street skate community. Celebrating Nike SB heritage. Unofficial fan page.',
      avatarColor: 'bg-slate-500/20 text-slate-300',
      avatarInitials: 'SB',
      lookalike: {
        official: '@nike',
        candidate: '@nike_sb_regional_crew',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@nike_sb', isDifferent: false },
          { text: '_regional_crew', isDifferent: true, differenceLabel: 'Enthusiast group' },
        ],
        explanation: 'Enthusiast account with explicit disclaimer.',
      },
      signals: [
        { id: 'sig-nk-10a', title: 'Benign fan content', explanation: 'Contains explicit non-affiliation disclaimer.', strength: 'Low', iconName: 'desc' },
      ],
    },
    {
      id: 'find-nk-11',
      title: 'com.nike.workout.timer.companion',
      type: 'app',
      platform: 'Google Play',
      usernameOrPackage: 'com.nike.workout.timer.companion',
      candidateUrl: 'https://play.google.com/store/apps/details?id=com.nike.workout.timer.companion',
      riskSeverity: 'medium',
      riskScore: 58,
      confidence: 'Medium',
      status: 'New',
      mainReason: 'Unapproved fitness timer app using Nike typography and Swoosh logo in app icon',
      detailedReason: 'Third party mobile utility confusing users into believing it is an official Nike Training Club companion app.',
      publisherOrOwner: 'QuickTimer Mobile Apps',
      candidateWebsite: 'https://quicktimer-apps.com',
      description: 'Interval timer designed for Nike Training workouts and HIIT routines.',
      avatarColor: 'bg-amber-500/20 text-amber-400',
      avatarInitials: 'WT',
      lookalike: {
        official: 'com.nike.omega',
        candidate: 'com.nike.workout.timer.companion',
        differenceType: 'unauthorized_subdomain',
        highlightedParts: [
          { text: 'com.nike.', isDifferent: false },
          { text: 'workout.timer.companion', isDifferent: true, differenceLabel: 'Unauthorized app category' },
        ],
        explanation: 'Falsely associates workout timer utility with official Nike brand ecosystem.',
      },
      signals: [
        { id: 'sig-nk-11a', title: 'Trademark icon', explanation: 'Includes stylized swoosh inside app icon.', strength: 'Medium', iconName: 'logo' },
      ],
    },
    {
      id: 'find-nk-12',
      title: 'Nike Tech Fleece Factory Direct',
      type: 'social',
      platform: 'Instagram',
      usernameOrPackage: '@nike_tech_fleece_outlet',
      candidateUrl: 'https://instagram.com/nike_tech_fleece_outlet',
      riskSeverity: 'high',
      riskScore: 81,
      confidence: 'High',
      status: 'New',
      mainReason: 'Counterfeit apparel distributor running sponsored reels using modified Nike branding',
      detailedReason: 'Directs teenagers to WhatsApp numbers to buy unauthorized counterfeit Nike Tech Fleece tracksuits.',
      publisherOrOwner: 'Streetwear Global Logistics',
      candidateWebsite: 'https://techfleece-wholesale.live',
      description: 'Factory direct Nike Tech suits, windrunners, and joggers.',
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: 'NT',
      lookalike: {
        official: '@nike',
        candidate: '@nike_tech_fleece_outlet',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@nike', isDifferent: false },
          { text: '_tech_fleece_outlet', isDifferent: true, differenceLabel: 'Apparel product scam' },
        ],
        explanation: 'Exploits high consumer demand for Tech Fleece suits.',
      },
      signals: [
        { id: 'sig-nk-12a', title: 'Counterfeit apparel', explanation: 'Solicits unregulated P2P wire transfers.', strength: 'High', iconName: 'desc' },
      ],
    },
  ];

  for (const f of nikeFindings) {
    insertFinding(db, companyId, f, now);
  }
}

export function seedTrekFixtures(db: Database, now: string) {
  const companyId = 'comp-trekbikes';
  const userId = 'user-trek-marcus';
  const passwordHash = bcrypt.hashSync('password123', 10);

  // 1. Company
  db.run(
    `INSERT INTO companies (id, name, website, industry, email_domain, setup_status, created_at)
     VALUES (?, ?, ?, ?, ?, 'active', ?)`,
    [companyId, 'Trek Bicycle Corp', 'https://trekbikes.com', 'Bicycles, E-Bikes & Cycling Gear', 'trekbikes.com', now]
  );

  // 2. User
  db.run(
    `INSERT INTO users (id, name, email, password_hash, company_id, role, created_at, last_login, status)
     VALUES (?, ?, ?, ?, ?, 'Director of Brand Security', ?, ?, 'active')`,
    [userId, 'Marcus Vance', 'marcus.vance@trekbikes.com', passwordHash, companyId, now, now]
  );

  // 3. Official Assets
  const assets = [
    { id: 'trek-ast-1', type: 'domain', name: 'Official Corporate Domain', url: 'https://trekbikes.com', platform: 'Web Domain', account_id: 'trekbikes.com', pub: 'Trek Bicycle Corporation' },
    { id: 'trek-ast-2', type: 'social', name: 'Trek Official Instagram', url: 'https://instagram.com/trekbikes', platform: 'Instagram', account_id: '@trekbikes', pub: 'Trek Bicycle Corporation' },
    { id: 'trek-ast-3', type: 'social', name: 'Trek Verified X Channel', url: 'https://x.com/trekbikes', platform: 'X', account_id: '@trekbikes', pub: 'Trek Bicycle Corporation' },
    { id: 'trek-ast-4', type: 'social', name: 'Trek LinkedIn Company Page', url: 'https://linkedin.com/company/trek-bicycle-corporation', platform: 'LinkedIn', account_id: 'trek-bicycle-corporation', pub: 'Trek Bicycle Corporation' },
    { id: 'trek-ast-5', type: 'app', name: 'Trek Central E-Bike App', url: 'https://play.google.com/store/apps/details?id=com.trekbikes.central', platform: 'Google Play', account_id: 'com.trekbikes.central', package_id: 'com.trekbikes.central', pub: 'Trek Bicycle Corporation' },
    { id: 'trek-ast-6', type: 'app', name: 'Trek Precision Fit & Rides (iOS)', url: 'https://apps.apple.com/app/trek-rides/id987654321', platform: 'Apple App Store', account_id: 'id987654321', package_id: 'com.trekbikes.rides', pub: 'Trek Bicycle Corporation' },
  ];

  for (const a of assets) {
    db.run(
      `INSERT INTO brand_assets (id, company_id, type, name, url, platform, account_id, package_id, publisher, verification_status, verification_method, archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified_official', 'cycling_industry_registry', 0, ?, ?)`,
      [a.id, companyId, a.type, a.name, a.url, a.platform, a.account_id, a.package_id || null, a.pub, now, now]
    );
  }

  // 4. Link Checks
  const linkChecks = [
    {
      id: 'chk-tk-1',
      url: 'https://trekbikes-warehouse-liquidation.shop/bikes',
      checked_domain: 'trekbikes-warehouse-liquidation.shop',
      official_domain: 'trekbikes.com',
      verdict: 'Likely phishing',
      risk_severity: 'critical',
      risk_score: 96,
      confidence: 'High',
      redirect_info: 'HTTP 302 -> /gateway/credit-card',
      page_title: 'Trek Bikes Official Factory Closeout - 90% Off Madone & Domane',
      screenshot_label: 'Fraudulent bicycle checkout claiming $8,000 carbon bikes for $349',
      why_flagged: 'Domain registered yesterday in Iceland. Cloned Trek corporate CSS and logos. Collects debit card numbers without order fulfillment.',
      recommended_action: 'Submit urgent registrar cease-and-desist and domain takedown.',
      checked_at: '20 mins ago',
    },
    {
      id: 'chk-tk-2',
      url: 'https://trekbikes.com/us/en_US/bikes/',
      checked_domain: 'trekbikes.com',
      official_domain: 'trekbikes.com',
      verdict: 'Approved',
      risk_severity: 'low',
      risk_score: 2,
      confidence: 'High',
      redirect_info: 'None (Direct SSL 200 OK)',
      page_title: 'Bikes | Trek Bikes (US)',
      screenshot_label: 'Official Trek Bicycle Model Directory',
      why_flagged: 'Verified genuine company domain. High reputation score.',
      recommended_action: 'Verified authentic corporate destination.',
      checked_at: '1 hour ago',
    },
    {
      id: 'chk-tk-3',
      url: 'https://trek-warranty-claim.online',
      checked_domain: 'trek-warranty-claim.online',
      official_domain: 'trekbikes.com',
      verdict: 'Suspicious',
      risk_severity: 'high',
      risk_score: 82,
      confidence: 'High',
      redirect_info: 'HTTP 200 -> Fake Frame Registration Form',
      page_title: 'Trek Carbon Care Warranty Claim Portal',
      screenshot_label: 'Phishing portal capturing frame serial numbers and owner addresses',
      why_flagged: 'Not hosted by Trek Bicycle Corp. Asks for frame IDs and personal driver licenses.',
      recommended_action: 'Publish dealer security advisory and block domain.',
      checked_at: '6 hours ago',
    },
  ];

  for (const lc of linkChecks) {
    db.run(
      `INSERT INTO link_checks (id, company_id, url, checked_domain, official_domain, verdict, risk_severity, risk_score, confidence, redirect_info, page_title, screenshot_label, why_flagged, recommended_action, checked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lc.id, companyId, lc.url, lc.checked_domain, lc.official_domain, lc.verdict, lc.risk_severity, lc.risk_score, lc.confidence, lc.redirect_info, lc.page_title, lc.screenshot_label, lc.why_flagged, lc.recommended_action, lc.checked_at]
    );
  }

  // 5. Findings (14 tailored Trek Bicycle findings)
  const trekFindings = [
    {
      id: 'find-tk-1',
      title: 'Trek Bikes Warehouse Liquidation Sale',
      type: 'social',
      platform: 'Instagram',
      usernameOrPackage: '@trek_bikes_warehouse_liquidation',
      candidateUrl: 'https://instagram.com/trek_bikes_warehouse_liquidation',
      riskSeverity: 'critical',
      riskScore: 95,
      confidence: 'High',
      status: 'New',
      mainReason: 'Fake liquidation profile advertising $9,000 Trek Madone SLR road bikes for $399 with fraudulent checkout links',
      detailedReason: 'Sponsored Instagram carousel claiming official factory surplus clearance. Sends buyers to an offshore credit card skimmer.',
      publisherOrOwner: 'Global Bike Liquidators',
      candidateWebsite: 'https://trek-factory-clearance.store',
      description: 'Official Trek Bicycle Surplus & Overstock Clearance Center. Worldwide free shipping.',
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: 'TB',
      lookalike: {
        official: '@trekbikes',
        candidate: '@trek_bikes_warehouse_liquidation',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@trek_bikes', isDifferent: false },
          { text: '_warehouse_liquidation', isDifferent: true, differenceLabel: 'Bait keyword' },
        ],
        explanation: 'Fakes corporate affiliation using warehouse liquidation terms to explain impossible 95% price discounts.',
      },
      signals: [
        { id: 'sig-tk-1a', title: 'Extreme price anomaly', explanation: 'Lists elite carbon race bikes 95% below MSRP.', strength: 'Critical', iconName: 'desc' },
        { id: 'sig-tk-1b', title: 'Stolen brand media', explanation: 'Uses official Trek Tour de France promotional clips.', strength: 'High', iconName: 'logo' },
      ],
      timeline: [
        { id: 'tm-tk-1', author: 'Brand Intelligence', role: 'Telemetry', action: 'Detected', note: 'Flagged via social impersonation crawler.', timestamp: '15 mins ago' },
      ],
    },
    {
      id: 'find-tk-2',
      title: 'Trek Central E-Bike Speed Unlocker',
      type: 'app',
      platform: 'Third-party APK',
      usernameOrPackage: 'com.trek.ebike.speed.unlocker',
      candidateUrl: 'https://apk-modded-bikes.net/app/com.trek.ebike.speed.unlocker',
      riskSeverity: 'critical',
      riskScore: 94,
      confidence: 'High',
      status: 'New',
      mainReason: 'Malicious APK claiming to bypass Trek e-bike motor speed limits, contains background spyware and steals banking sessions',
      detailedReason: 'Trojanized APK targeting Trek Fuel EXe and Allant+ riders. Contains banking overlay malware and battery bricking hazard.',
      publisherOrOwner: 'E-Bike Modded Labs',
      candidateWebsite: 'https://ebike-speed-tuner.biz',
      description: 'Unlock 45km/h motor speed limit on all Trek TQ and Bosch electric bikes.',
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: 'EB',
      lookalike: {
        official: 'com.trekbikes.central',
        candidate: 'com.trek.ebike.speed.unlocker',
        differenceType: 'unauthorized_subdomain',
        highlightedParts: [
          { text: 'com.trek.', isDifferent: false },
          { text: 'ebike.speed.unlocker', isDifferent: true, differenceLabel: 'Rogue firmware utility' },
        ],
        explanation: 'Uses Trek branding to induce users to install dangerous uncertified motor firmware.',
      },
      signals: [
        { id: 'sig-tk-2a', title: 'Dangerous malware', explanation: 'Contains banking credential overlay injects.', strength: 'Critical', iconName: 'permission' },
        { id: 'sig-tk-2b', title: 'Safety hazard', explanation: 'Voids motor warranty and exceeds EU/US speed regulations.', strength: 'Critical', iconName: 'package' },
      ],
    },
    {
      id: 'find-tk-3',
      title: 'Trek Bicycle Priority Support & Warranty',
      type: 'social',
      platform: 'X',
      usernameOrPackage: '@trek_warranty_care_help',
      candidateUrl: 'https://x.com/trek_warranty_care_help',
      riskSeverity: 'high',
      riskScore: 87,
      confidence: 'High',
      status: 'Investigating',
      mainReason: 'Phishing account impersonating Trek customer support, requesting cyclists payment details for replacement carbon forks',
      detailedReason: 'Interprets public queries on X directed at Trek regarding warranty replacements and sends phishing direct messages.',
      publisherOrOwner: 'Customer Resolutions Help',
      candidateWebsite: 'https://trek-replacement-care.online',
      description: 'Official 24/7 Trek Bicycle Warranty Replacement Escalations.',
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: 'TC',
      lookalike: {
        official: '@trekbikes',
        candidate: '@trek_warranty_care_help',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@trek', isDifferent: false },
          { text: '_warranty_care_help', isDifferent: true, differenceLabel: 'Fake support hook' },
        ],
        explanation: 'Lures cyclists seeking replacement parts into providing credit card numbers.',
      },
      signals: [
        { id: 'sig-tk-3a', title: 'Impersonation DM bot', explanation: 'Automated direct messaging requesting payment.', strength: 'High', iconName: 'desc' },
      ],
    },
    {
      id: 'find-tk-4',
      title: 'Trek Factory Direct Overstock Hub',
      type: 'social',
      platform: 'Facebook',
      usernameOrPackage: '@trek_overstock_factory_direct',
      candidateUrl: 'https://facebook.com/trek_overstock_factory_direct',
      riskSeverity: 'high',
      riskScore: 84,
      confidence: 'High',
      status: 'New',
      mainReason: 'Counterfeit bicycle reseller selling uncertified replica carbon frames using copyrighted Trek logos and graphics',
      detailedReason: 'Large Facebook storefront selling counterfeit carbon fiber road framesets that fail ISO bicycle safety crash tests.',
      publisherOrOwner: 'Carbon Direct Factory Ltd',
      candidateWebsite: 'https://carbon-frames-wholesale.cc',
      description: 'Factory direct Trek frames, wheelsets, and handlebars at wholesale cost.',
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: 'TF',
      lookalike: {
        official: 'Trek',
        candidate: 'Trek Factory Direct Overstock Hub',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'Trek', isDifferent: false },
          { text: ' Factory Direct Overstock Hub', isDifferent: true, differenceLabel: 'Replica seller label' },
        ],
        explanation: 'Falsely promises genuine OCLV carbon fiber at impossible counterfeit prices.',
      },
      signals: [
        { id: 'sig-tk-4a', title: 'Physical safety risk', explanation: 'Counterfeit carbon frames present structural failure risk.', strength: 'Critical', iconName: 'name' },
      ],
    },
    {
      id: 'find-tk-5',
      title: 'Trek Gravel & MTB VIP Giveaway Bot',
      type: 'social',
      platform: 'Telegram',
      usernameOrPackage: '@trek_mtb_giveaway_bot',
      candidateUrl: 'https://t.me/trek_mtb_giveaway_bot',
      riskSeverity: 'high',
      riskScore: 89,
      confidence: 'High',
      status: 'New',
      mainReason: 'Deceptive bot promising free Trek Slash mountain bikes in exchange for cryptocurrency shipping fee deposits',
      detailedReason: 'Solicits $120 USDT transfer for guaranteed delivery of 2026 Trek mountain bikes.',
      publisherOrOwner: 'Telegram Giveaways Network',
      candidateWebsite: 'https://crypto-bike-claim.io',
      description: 'Official 50th Anniversary Trek Mountain Bike Global Giveaway bot.',
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: 'TG',
      lookalike: {
        official: 'Trek Bikes',
        candidate: 'Trek Gravel & MTB VIP Giveaway Bot',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'Trek', isDifferent: false },
          { text: ' Gravel & MTB VIP Giveaway Bot', isDifferent: true, differenceLabel: 'Scam giveaway lure' },
        ],
        explanation: 'Fabricates brand anniversary promotion to steal cryptocurrency transfers.',
      },
      signals: [
        { id: 'sig-tk-5a', title: 'Advance fee fraud', explanation: 'Requires irreversible crypto transfer.', strength: 'High', iconName: 'domain' },
      ],
    },
    {
      id: 'find-tk-6',
      title: 'com.trek.powerfly.battery.booster',
      type: 'app',
      platform: 'Third-party APK',
      usernameOrPackage: 'com.trek.powerfly.battery.booster',
      candidateUrl: 'https://apk-mirror-cycling.org/app.apk',
      riskSeverity: 'high',
      riskScore: 83,
      confidence: 'High',
      status: 'Investigating',
      mainReason: 'Rogue APK disguised as battery tuning utility, requesting device contact and location tracking access',
      detailedReason: 'Promoted as battery capacity extender for Trek Powerfly electric mountain bikes. Collects device geolocation continuously.',
      publisherOrOwner: 'Battery Optimizers Group',
      candidateWebsite: 'https://battery-tuner-bikes.com',
      description: 'Extend Trek Powerfly battery range up to 40% with smart motor calibration.',
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: 'PB',
      lookalike: {
        official: 'com.trekbikes.central',
        candidate: 'com.trek.powerfly.battery.booster',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'com.trek.', isDifferent: false },
          { text: 'powerfly.battery.booster', isDifferent: true, differenceLabel: 'Unauthorized utility' },
        ],
        explanation: 'Exploits Powerfly model brand name to establish false legitimacy.',
      },
      signals: [
        { id: 'sig-tk-6a', title: 'Location surveillance', explanation: 'Runs background GPS tracking service.', strength: 'High', iconName: 'permission' },
      ],
    },
    {
      id: 'find-tk-7',
      title: 'Trek Bontrager Helmet Closeouts',
      type: 'social',
      platform: 'Instagram',
      usernameOrPackage: '@trek_bontrager_closeouts',
      candidateUrl: 'https://instagram.com/trek_bontrager_closeouts',
      riskSeverity: 'medium',
      riskScore: 66,
      confidence: 'Medium',
      status: 'New',
      mainReason: 'Unverified seller distributing non-safety-certified replica Bontrager WaveCel helmets',
      detailedReason: 'Selling uncertified replica cycling helmets online without CPSC or EN 1078 safety testing certificates.',
      publisherOrOwner: 'Aero Helmets Warehouse',
      candidateWebsite: 'https://helmets-closeouts-direct.net',
      description: 'Discount Bontrager WaveCel aero road and MTB helmets. 60% off liquidation.',
      avatarColor: 'bg-amber-500/20 text-amber-400',
      avatarInitials: 'BH',
      lookalike: {
        official: '@trekbikes',
        candidate: '@trek_bontrager_closeouts',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@trek_bontrager', isDifferent: false },
          { text: '_closeouts', isDifferent: true, differenceLabel: 'Discount closeout tag' },
        ],
        explanation: 'Pairs Trek subsidiary brand Bontrager with closeouts descriptor.',
      },
      signals: [
        { id: 'sig-tk-7a', title: 'Safety certification risk', explanation: 'Counterfeit protective equipment.', strength: 'High', iconName: 'desc' },
      ],
    },
    {
      id: 'find-tk-8',
      title: 'Trek Certified Pre-Owned Exchange',
      type: 'social',
      platform: 'Facebook',
      usernameOrPackage: '@trek_certified_used_bikes',
      candidateUrl: 'https://facebook.com/trek_certified_used_bikes',
      riskSeverity: 'medium',
      riskScore: 62,
      confidence: 'Medium',
      status: 'New',
      mainReason: 'Third-party marketplace claiming official certification without Trek authorized dealer status',
      detailedReason: 'Uses official Trek Red Shield trademark to build credibility for an unauthorized secondhand bike broker.',
      publisherOrOwner: 'Pre-Owned Wheels LLC',
      candidateWebsite: 'https://used-trek-marketplace.com',
      description: 'Certified pre-owned Trek bikes inspected by certified master mechanics.',
      avatarColor: 'bg-amber-500/20 text-amber-400',
      avatarInitials: 'CP',
      lookalike: {
        official: 'Trek',
        candidate: 'Trek Certified Pre-Owned Exchange',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'Trek', isDifferent: false },
          { text: ' Certified Pre-Owned Exchange', isDifferent: true, differenceLabel: 'False certification' },
        ],
        explanation: 'Falsely claims authorized dealer certification.',
      },
      signals: [
        { id: 'sig-tk-8a', title: 'False certification claim', explanation: 'Not part of Trek Certified Retailer network.', strength: 'Medium', iconName: 'logo' },
      ],
    },
    {
      id: 'find-tk-9',
      title: 'Trek Century Riders Club',
      type: 'social',
      platform: 'X',
      usernameOrPackage: '@trek_century_cyclists_club',
      candidateUrl: 'https://x.com/trek_century_cyclists_club',
      riskSeverity: 'low',
      riskScore: 35,
      confidence: 'Medium',
      status: 'Investigating',
      mainReason: 'Unofficial community fan page using Trek shield badge; no fraudulent links detected',
      detailedReason: 'Cycling enthusiast club celebrating 100-mile gran fondo rides on Trek bikes. Uses logo in header.',
      publisherOrOwner: 'Amateur Cycling Group',
      candidateWebsite: '',
      description: 'Long distance endurance cycling group for Trek bicycle riders worldwide.',
      avatarColor: 'bg-slate-500/20 text-slate-300',
      avatarInitials: 'CC',
      lookalike: {
        official: '@trekbikes',
        candidate: '@trek_century_cyclists_club',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@trek', isDifferent: false },
          { text: '_century_cyclists_club', isDifferent: true, differenceLabel: 'Enthusiast club' },
        ],
        explanation: 'Benign community group with trademark in profile artwork.',
      },
      signals: [
        { id: 'sig-tk-9a', title: 'Unlicensed logo in banner', explanation: 'Amateur club using corporate logo.', strength: 'Low', iconName: 'logo' },
      ],
    },
    {
      id: 'find-tk-10',
      title: 'Trek Bicycle Enthusiasts Forum',
      type: 'social',
      platform: 'Telegram',
      usernameOrPackage: '@trek_owners_group',
      candidateUrl: 'https://t.me/trek_owners_group',
      riskSeverity: 'low',
      riskScore: 28,
      confidence: 'Low',
      status: 'Dismissed',
      mainReason: 'Benign peer-to-peer discussion group for bicycle maintenance tips',
      detailedReason: 'Active group sharing gear tuning and bike packing photos. Explicitly mentions not affiliated with Trek Corp.',
      publisherOrOwner: 'Bikepacking Community',
      candidateWebsite: '',
      description: 'Community chat for Trek bike owners, route tips, and maintenance advice.',
      avatarColor: 'bg-slate-500/20 text-slate-300',
      avatarInitials: 'TG',
      lookalike: {
        official: 'Trek',
        candidate: 'Trek Bicycle Enthusiasts Forum',
        differenceType: 'added_words',
        highlightedParts: [
          { text: 'Trek', isDifferent: false },
          { text: ' Bicycle Enthusiasts Forum', isDifferent: true, differenceLabel: 'Discussion forum' },
        ],
        explanation: 'Clear non-commercial discussion group.',
      },
      signals: [
        { id: 'sig-tk-10a', title: 'Peer community', explanation: 'No commercial activity or deceptive links.', strength: 'Low', iconName: 'desc' },
      ],
    },
    {
      id: 'find-tk-11',
      title: 'com.trek.cadence.sensor.tracker',
      type: 'app',
      platform: 'Google Play',
      usernameOrPackage: 'com.trek.cadence.sensor.tracker',
      candidateUrl: 'https://play.google.com/store/apps/details?id=com.trek.cadence.sensor.tracker',
      riskSeverity: 'medium',
      riskScore: 56,
      confidence: 'Medium',
      status: 'New',
      mainReason: 'Generic third-party Bluetooth sensor utility using Trek product trademarks in store title and description',
      detailedReason: 'Publishes generic Bluetooth pedaling sensor utility that misleadingly implies partnership with Trek DuoTrap sensors.',
      publisherOrOwner: 'SensorLab Tech',
      candidateWebsite: 'https://sensorlab-cycling.com',
      description: 'Wireless cycling cadence tracker compatible with Trek DuoTrap S bike sensors.',
      avatarColor: 'bg-amber-500/20 text-amber-400',
      avatarInitials: 'ST',
      lookalike: {
        official: 'com.trekbikes.central',
        candidate: 'com.trek.cadence.sensor.tracker',
        differenceType: 'unauthorized_subdomain',
        highlightedParts: [
          { text: 'com.trek.', isDifferent: false },
          { text: 'cadence.sensor.tracker', isDifferent: true, differenceLabel: 'Sensor app identifier' },
        ],
        explanation: 'Uses Trek DuoTrap naming to drive Play Store app downloads.',
      },
      signals: [
        { id: 'sig-tk-11a', title: 'Trademark keywords', explanation: 'Misleading store title and keywords.', strength: 'Medium', iconName: 'name' },
      ],
    },
    {
      id: 'find-tk-12',
      title: 'Trek Fuel EXe E-Bike Owners Club',
      type: 'social',
      platform: 'Instagram',
      usernameOrPackage: '@trek_fuel_exe_riders',
      candidateUrl: 'https://instagram.com/trek_fuel_exe_riders',
      riskSeverity: 'medium',
      riskScore: 52,
      confidence: 'Medium',
      status: 'New',
      mainReason: 'Account posing as regional brand ambassador promoting unverified aftermarket battery packs',
      detailedReason: 'Promotes non-UL-listed aftermarket range extenders which may cause thermal runaway fires in carbon frames.',
      publisherOrOwner: 'Range Boost Batteries',
      candidateWebsite: 'https://range-boost-ebike.shop',
      description: 'Trek Fuel EXe mountain bike riders. Trail ride photos and custom range extenders.',
      avatarColor: 'bg-amber-500/20 text-amber-400',
      avatarInitials: 'FE',
      lookalike: {
        official: '@trekbikes',
        candidate: '@trek_fuel_exe_riders',
        differenceType: 'added_words',
        highlightedParts: [
          { text: '@trek_fuel_exe', isDifferent: false },
          { text: '_riders', isDifferent: true, differenceLabel: 'Model community affix' },
        ],
        explanation: 'Uses model name to sell dangerous uncertified aftermarket battery packs.',
      },
      signals: [
        { id: 'sig-tk-12a', title: 'Unapproved battery gear', explanation: 'Sells batteries posing fire risk.', strength: 'Medium', iconName: 'desc' },
      ],
    },
  ];

  for (const f of trekFindings) {
    insertFinding(db, companyId, f, now);
  }
}

export function generateDynamicCompanyDemo(db: Database, companyId: string, companyName: string, website: string, industry: string, now: string) {
  const cleanBrand = companyName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'brand';
  const cleanDomain = website ? website.replace(/^https?:\/\//, '').split('/')[0] : `${cleanBrand}.com`;
  const initials = companyName.substring(0, 2).toUpperCase() || 'BG';

  // 1. Official Assets
  const assets = [
    { id: `ast-${cleanBrand}-1`, type: 'domain', name: 'Official Corporate Domain', url: `https://${cleanDomain}`, platform: 'Web Domain', account_id: cleanDomain, pub: companyName },
    { id: `ast-${cleanBrand}-2`, type: 'social', name: `${companyName} Official Instagram`, url: `https://instagram.com/${cleanBrand}`, platform: 'Instagram', account_id: `@${cleanBrand}`, pub: companyName },
    { id: `ast-${cleanBrand}-3`, type: 'social', name: `${companyName} Verified X Channel`, url: `https://x.com/${cleanBrand}`, platform: 'X', account_id: `@${cleanBrand}`, pub: companyName },
    { id: `ast-${cleanBrand}-4`, type: 'social', name: `${companyName} Official LinkedIn`, url: `https://linkedin.com/company/${cleanBrand}`, platform: 'LinkedIn', account_id: cleanBrand, pub: companyName },
    { id: `ast-${cleanBrand}-5`, type: 'app', name: `${companyName} Mobile App`, url: `https://play.google.com/store/apps/details?id=com.${cleanBrand}.app`, platform: 'Google Play', account_id: `com.${cleanBrand}.app`, package_id: `com.${cleanBrand}.app`, pub: companyName },
    { id: `ast-${cleanBrand}-6`, type: 'app', name: `${companyName} iOS Application`, url: `https://apps.apple.com/app/${cleanBrand}/id11223344`, platform: 'Apple App Store', account_id: 'id11223344', package_id: `com.${cleanBrand}.ios`, pub: companyName },
  ];

  for (const a of assets) {
    db.run(
      `INSERT INTO brand_assets (id, company_id, type, name, url, platform, account_id, package_id, publisher, verification_status, verification_method, archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified_official', 'company_confirmation', 0, ?, ?)`,
      [a.id, companyId, a.type, a.name, a.url, a.platform, a.account_id, a.package_id || null, a.pub, now, now]
    );
  }

  // 2. Link Checks
  const linkChecks = [
    {
      id: `chk-${cleanBrand}-1`,
      url: `https://${cleanBrand}-security-update.live/login`,
      checked_domain: `${cleanBrand}-security-update.live`,
      official_domain: cleanDomain,
      verdict: 'Likely phishing',
      risk_severity: 'critical',
      risk_score: 93,
      confidence: 'High',
      redirect_info: 'HTTP 302 -> /auth/harvest',
      page_title: `${companyName} Customer Verification Portal`,
      screenshot_label: 'Phishing login form with fake security verification prompt',
      why_flagged: `Domain registered 3 days ago. Mimics verified brand ${companyName} and prompts for customer account credentials.`,
      recommended_action: 'Submit immediate domain suspension notice to hosting registrar.',
      checked_at: '25 mins ago',
    },
    {
      id: `chk-${cleanBrand}-2`,
      url: `https://${cleanDomain}/support`,
      checked_domain: cleanDomain,
      official_domain: cleanDomain,
      verdict: 'Approved',
      risk_severity: 'low',
      risk_score: 2,
      confidence: 'High',
      redirect_info: 'None (Direct SSL 200 OK)',
      page_title: `${companyName} Customer Support & Help Center`,
      screenshot_label: `Official customer support portal for ${companyName}`,
      why_flagged: `Matches registered corporate domain ${cleanDomain} with valid HTTPS TLS certificate.`,
      recommended_action: 'No action needed. Verified official company destination.',
      checked_at: '1 hour ago',
    },
  ];

  for (const lc of linkChecks) {
    db.run(
      `INSERT INTO link_checks (id, company_id, url, checked_domain, official_domain, verdict, risk_severity, risk_score, confidence, redirect_info, page_title, screenshot_label, why_flagged, recommended_action, checked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lc.id, companyId, lc.url, lc.checked_domain, lc.official_domain, lc.verdict, lc.risk_severity, lc.risk_score, lc.confidence, lc.redirect_info, lc.page_title, lc.screenshot_label, lc.why_flagged, lc.recommended_action, lc.checked_at]
    );
  }

  // 3. Tailored Findings
  const customFindings = [
    {
      id: `find-${cleanBrand}-1`,
      title: `${companyName} VIP Customer Escalation Bot`,
      type: 'social',
      platform: 'Telegram',
      usernameOrPackage: `@${cleanBrand}_vip_support`,
      candidateUrl: `https://t.me/${cleanBrand}_vip_support`,
      riskSeverity: 'critical',
      riskScore: 94,
      confidence: 'High',
      status: 'New',
      mainReason: `Deceptive Telegram bot impersonating ${companyName} customer support to harvest customer payment details`,
      detailedReason: `Prompts distress customer inquiries to provide account verification OTPs and card information under the guise of expedited support for ${companyName}.`,
      publisherOrOwner: 'Unverified Operator',
      candidateWebsite: `https://${cleanBrand}-claim-recovery.net`,
      description: `Official 24/7 priority helpdesk channel for ${companyName}.`,
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: initials,
      lookalike: {
        official: companyName,
        candidate: `${companyName} VIP Customer Escalation Bot`,
        differenceType: 'added_words',
        highlightedParts: [
          { text: companyName, isDifferent: false },
          { text: ' VIP Customer Escalation Bot', isDifferent: true, differenceLabel: 'Support lure' },
        ],
        explanation: `Uses "${companyName}" with "VIP Customer Escalation" to deceive customers.`,
      },
      signals: [
        { id: `sig-${cleanBrand}-1a`, title: 'Credential harvesting', explanation: 'Collects sensitive user login tokens.', strength: 'Critical', iconName: 'domain' },
        { id: `sig-${cleanBrand}-1b`, title: 'Brand impersonation', explanation: `Uses stolen ${companyName} logo graphics.`, strength: 'High', iconName: 'logo' },
      ],
    },
    {
      id: `find-${cleanBrand}-2`,
      title: `${companyName} Factory Direct Outlet`,
      type: 'social',
      platform: 'Instagram',
      usernameOrPackage: `@${cleanBrand}_factory_outlet_direct`,
      candidateUrl: `https://instagram.com/${cleanBrand}_factory_outlet_direct`,
      riskSeverity: 'high',
      riskScore: 87,
      confidence: 'High',
      status: 'Investigating',
      mainReason: `Unverified Instagram storefront claiming 80% liquidation clearance on ${companyName} inventory`,
      detailedReason: `Sponsored posts linking to an unverified checkout shop targeting customers of ${companyName}.`,
      publisherOrOwner: 'Global Overstock Hub',
      candidateWebsite: `https://${cleanBrand}-factory-clearance.store`,
      description: `Official overstock liquidation outlet for ${companyName}.`,
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: initials,
      lookalike: {
        official: `@${cleanBrand}`,
        candidate: `@${cleanBrand}_factory_outlet_direct`,
        differenceType: 'added_words',
        highlightedParts: [
          { text: `@${cleanBrand}`, isDifferent: false },
          { text: '_factory_outlet_direct', isDifferent: true, differenceLabel: 'Discount outlet affix' },
        ],
        explanation: 'Fakes brand liquidation credentials.',
      },
      signals: [
        { id: `sig-${cleanBrand}-2a`, title: 'Suspicious store', explanation: 'Directs to newly registered domain.', strength: 'High', iconName: 'desc' },
      ],
    },
    {
      id: `find-${cleanBrand}-3`,
      title: `com.${cleanBrand}.fastpass.mod`,
      type: 'app',
      platform: 'Third-party APK',
      usernameOrPackage: `com.${cleanBrand}.fastpass.mod`,
      candidateUrl: `https://apk-mirror-hub.org/app/com.${cleanBrand}.fastpass.mod`,
      riskSeverity: 'critical',
      riskScore: 92,
      confidence: 'High',
      status: 'New',
      mainReason: `Rogue Android application soliciting contact and storage permissions under the brand name of ${companyName}`,
      detailedReason: `Trojanized APK requesting dangerous device permissions without security authorization.`,
      publisherOrOwner: 'Apex Modded Apps Ltd',
      candidateWebsite: `https://${cleanBrand}-apk-mod.biz`,
      description: `Fastpass loyalty rewards utility for ${companyName} users.`,
      avatarColor: 'bg-red-500/20 text-red-400',
      avatarInitials: initials,
      lookalike: {
        official: `com.${cleanBrand}.app`,
        candidate: `com.${cleanBrand}.fastpass.mod`,
        differenceType: 'unauthorized_subdomain',
        highlightedParts: [
          { text: `com.${cleanBrand}.`, isDifferent: false },
          { text: 'fastpass.mod', isDifferent: true, differenceLabel: 'Rogue package suffix' },
        ],
        explanation: 'Prefixes package identifier with genuine brand name.',
      },
      signals: [
        { id: `sig-${cleanBrand}-3a`, title: 'Exfiltration permissions', explanation: 'Requests READ_CONTACTS and READ_STORAGE.', strength: 'Critical', iconName: 'permission' },
      ],
    },
    {
      id: `find-${cleanBrand}-4`,
      title: `${companyName} Customer Care Hub`,
      type: 'social',
      platform: 'X',
      usernameOrPackage: `@${cleanBrand}_support_care`,
      candidateUrl: `https://x.com/${cleanBrand}_support_care`,
      riskSeverity: 'high',
      riskScore: 84,
      confidence: 'High',
      status: 'New',
      mainReason: `Phishing account impersonating ${companyName} support agents to solicit consumer billing credentials`,
      detailedReason: `Monitors public queries mentioning ${companyName} and attempts to intercept user tickets.`,
      publisherOrOwner: 'Direct Care Solutions',
      candidateWebsite: `https://${cleanBrand}-support-desk.online`,
      description: `Official priority customer support desk for ${companyName}.`,
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: initials,
      lookalike: {
        official: `@${cleanBrand}`,
        candidate: `@${cleanBrand}_support_care`,
        differenceType: 'added_words',
        highlightedParts: [
          { text: `@${cleanBrand}`, isDifferent: false },
          { text: '_support_care', isDifferent: true, differenceLabel: 'Fake support label' },
        ],
        explanation: 'Fakes official customer assistance handle.',
      },
      signals: [
        { id: `sig-${cleanBrand}-4a`, title: 'Impersonation account', explanation: 'Replicates official profile header.', strength: 'High', iconName: 'desc' },
      ],
    },
    {
      id: `find-${cleanBrand}-5`,
      title: `${companyName} Regional Collectors Network`,
      type: 'social',
      platform: 'Facebook',
      usernameOrPackage: `@${cleanBrand}_enthusiasts_network`,
      candidateUrl: `https://facebook.com/${cleanBrand}_enthusiasts_network`,
      riskSeverity: 'low',
      riskScore: 34,
      confidence: 'Medium',
      status: 'Dismissed',
      mainReason: `Community enthusiast group sharing product appreciation and discussion for ${companyName}`,
      detailedReason: `Benign user group with explicit disclaimer stating unofficial fan community status.`,
      publisherOrOwner: 'Community Admins',
      candidateWebsite: '',
      description: `Unofficial fan community celebrating ${companyName} products and heritage.`,
      avatarColor: 'bg-slate-500/20 text-slate-300',
      avatarInitials: initials,
      lookalike: {
        official: companyName,
        candidate: `${companyName} Regional Collectors Network`,
        differenceType: 'added_words',
        highlightedParts: [
          { text: companyName, isDifferent: false },
          { text: ' Regional Collectors Network', isDifferent: true, differenceLabel: 'Enthusiast network' },
        ],
        explanation: 'Benign community group.',
      },
      signals: [
        { id: `sig-${cleanBrand}-5a`, title: 'Benign fan content', explanation: 'Includes non-affiliation disclaimer.', strength: 'Low', iconName: 'desc' },
      ],
    },
    {
      id: `find-${cleanBrand}-6`,
      title: `${companyName} Rewards Club Giveaway`,
      type: 'social',
      platform: 'Telegram',
      usernameOrPackage: `@${cleanBrand}_rewards_giveaway`,
      candidateUrl: `https://t.me/${cleanBrand}_rewards_giveaway`,
      riskSeverity: 'high',
      riskScore: 86,
      confidence: 'High',
      status: 'New',
      mainReason: `Survey phishing campaign promising free vouchers from ${companyName}`,
      detailedReason: `Promotes unverified referral contest requesting personal identification documents.`,
      publisherOrOwner: 'Promo Giveaways Network',
      candidateWebsite: `https://${cleanBrand}-promotions.club`,
      description: `Official member rewards challenge and gift giveaway for ${companyName}.`,
      avatarColor: 'bg-orange-500/20 text-orange-400',
      avatarInitials: initials,
      lookalike: {
        official: companyName,
        candidate: `${companyName} Rewards Club Giveaway`,
        differenceType: 'added_words',
        highlightedParts: [
          { text: companyName, isDifferent: false },
          { text: ' Rewards Club Giveaway', isDifferent: true, differenceLabel: 'Giveaway lure' },
        ],
        explanation: 'Uses rewards bait to collect user credentials.',
      },
      signals: [
        { id: `sig-${cleanBrand}-6a`, title: 'Survey scam', explanation: 'Collects sensitive customer phone numbers.', strength: 'High', iconName: 'domain' },
      ],
    },
  ];

  for (const f of customFindings) {
    insertFinding(db, companyId, f, now);
  }
}
