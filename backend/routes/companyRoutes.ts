import { Router, Response } from 'express';
import { getDb, saveDb } from '../db';
import { generateToken, authMiddleware, optionalAuthMiddleware, AuthenticatedRequest } from '../auth';

const router = Router();

function getCompanyMetadata(company: any) {
  const name = company.name || 'Company';
  const id = company.id || '';

  if (id === 'comp-nike' || name.toLowerCase().includes('nike')) {
    return {
      aliases: ['Nike', 'Nike Sportswear', 'Nike Air', 'SNKRS'],
      productNames: ['Nike SNKRS', 'Nike Training Club', 'Nike Run Club', 'Air Jordan'],
      slogans: ['Just Do It', 'Innovation and Inspiration for Every Athlete'],
      logoText: 'NK',
    };
  }

  if (id === 'comp-trekbikes' || name.toLowerCase().includes('trek')) {
    return {
      aliases: ['Trek Bikes', 'Trek Cycling', 'Bontrager', 'Electra Bicycle'],
      productNames: ['Trek Central App', 'Madone SLR', 'Fuel EXe', 'Bontrager WaveCel'],
      slogans: ['Better with Bikes', 'Ride Bicycles. Have Fun. Feel Good.'],
      logoText: 'TB',
    };
  }

  if (id === 'comp-acmepay' || name.toLowerCase().includes('acmepay')) {
    return {
      aliases: ['Acme Pay', 'Acme Payments', 'Acme Global'],
      productNames: ['Acme Wallet', 'AcmePay Mobile', 'Acme Checkout'],
      slogans: ['Frictionless Global Payments', 'Trusted by Millions Worldwide'],
      logoText: 'AP',
    };
  }

  // Dynamic derivation for any custom brand
  return {
    aliases: [name, `${name} Official`, `${name} Direct`, `${name} Global`],
    productNames: [`${name} Mobile`, `${name} Portal`, `${name} Secure`],
    slogans: [`Official brand presence for ${name}`, 'Verified Digital Excellence'],
    logoText: name.substring(0, 2).toUpperCase(),
  };
}

// GET /api/company/list - Returns all available companies (supports both public landing and authenticated clients)
router.get('/list', optionalAuthMiddleware, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();

    // Batch fetch findings count in single pass
    const countMap = new Map<string, number>();
    try {
      const groupStmt = db.prepare('SELECT company_id, COUNT(*) as cnt FROM findings GROUP BY company_id');
      while (groupStmt.step()) {
        const row = groupStmt.getAsObject() as any;
        countMap.set(row.company_id, row.cnt || 0);
      }
      groupStmt.free();
    } catch {}

    const stmt = db.prepare('SELECT id, name, website, industry, email_domain, setup_status, created_at FROM companies ORDER BY rowid ASC');
    const companies = [];

    while (stmt.step()) {
      const c = stmt.getAsObject() as any;
      const findingsCount = countMap.get(c.id) || 0;
      const meta = getCompanyMetadata(c);

      companies.push({
        ...c,
        findingsCount,
        ...meta,
        isDemo: c.id.startsWith('comp-') || true,
      });
    }
    stmt.free();

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Server error listing companies' });
  }
});

// GET /api/company - Supports ?companyId=...
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = (req.query.companyId as string) || req.user!.companyId;

    const stmt = db.prepare('SELECT id, name, website, industry, email_domain, setup_status, created_at FROM companies WHERE id = ?');
    stmt.bind([companyId]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    const company = stmt.getAsObject() as any;
    stmt.free();

    // Get asset count
    const assetStmt = db.prepare('SELECT COUNT(*) as count FROM brand_assets WHERE company_id = ? AND archived = 0');
    assetStmt.bind([companyId]);
    assetStmt.step();
    const assetCount = (assetStmt.getAsObject() as any).count || 0;
    assetStmt.free();

    const meta = getCompanyMetadata(company);

    res.json({
      ...company,
      assetCount,
      ...meta,
      isDemo: companyId.startsWith('comp-') || true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching company' });
  }
});

// POST /api/company/switch - Switch user's active company
router.post('/switch', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const { companyId } = req.body;

    if (!companyId) {
      res.status(400).json({ error: 'companyId is required' });
      return;
    }

    const stmt = db.prepare('SELECT * FROM companies WHERE id = ?');
    stmt.bind([companyId]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    const company = stmt.getAsObject() as any;
    stmt.free();

    // Update user's active company in DB
    db.run('UPDATE users SET company_id = ? WHERE id = ?', [companyId, req.user!.id]);
    saveDb();

    const updatedUser = {
      ...req.user!,
      companyId,
    };
    const token = generateToken(updatedUser);
    const meta = getCompanyMetadata(company);

    res.json({
      message: `Switched active company to ${company.name}`,
      token,
      company: {
        ...company,
        ...meta,
      },
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error switching company' });
  }
});

// PUT /api/company
router.put('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = (req.body.companyId as string) || req.user!.companyId;
    const { name, website, industry } = req.body;

    db.run(
      'UPDATE companies SET name = COALESCE(?, name), website = COALESCE(?, website), industry = COALESCE(?, industry) WHERE id = ?',
      [name || null, website || null, industry || null, companyId]
    );
    saveDb();

    res.json({ message: 'Company updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating company' });
  }
});

// GET /api/company/completeness
router.get('/completeness', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = (req.query.companyId as string) || req.user!.companyId;

    const stmt = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'domain' AND verification_status = 'verified_official' THEN 1 ELSE 0 END) as verified_domains,
        SUM(CASE WHEN type = 'social' AND verification_status = 'verified_official' THEN 1 ELSE 0 END) as verified_socials,
        SUM(CASE WHEN type = 'app' AND verification_status = 'verified_official' THEN 1 ELSE 0 END) as verified_apps
      FROM brand_assets
      WHERE company_id = ? AND archived = 0
    `);
    stmt.bind([companyId]);
    stmt.step();
    const counts = stmt.getAsObject() as any;
    stmt.free();

    let score = 20; // base company details
    if (counts.verified_domains > 0) score += 30;
    if (counts.verified_socials > 0) score += 25;
    if (counts.verified_apps > 0) score += 25;

    res.json({
      completenessPercent: Math.min(score, 100),
      verifiedDomains: counts.verified_domains || 0,
      verifiedSocials: counts.verified_socials || 0,
      verifiedApps: counts.verified_apps || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error computing completeness' });
  }
});

// Helper to fetch live public Instagram telemetry
async function getLiveInstagramProfileMetadata(username: string) {
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const titleMatch = html.match(/property="og:title" content="([^"]+)"/) || html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/property="og:description" content="([^"]+)"/);

    const titleStr = titleMatch ? titleMatch[1].replace(/&#064;/g, '@').replace(/&#x2022;/g, '•').trim() : '';
    const descStr = descMatch ? descMatch[1].replace(/&#064;/g, '@').trim() : '';

    let fullName = username;
    if (titleStr.includes('(@')) {
      fullName = titleStr.split('(@')[0].trim();
    }

    return {
      fullName: fullName || username,
      stats: descStr,
      liveTitle: titleStr,
      isLiveActive: true
    };
  } catch {
    return null;
  }
}

// POST /api/company/instagram/connect - Connects and verifies live Instagram account via Meta Graph API
router.post('/instagram/connect', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token || !token.trim()) {
      res.status(400).json({ 
        error: 'No Instagram Access Token configured', 
        message: 'Set INSTAGRAM_ACCESS_TOKEN in backend environment.' 
      });
      return;
    }

    const companyId = (req.body.companyId as string) || (req.query.companyId as string) || req.user!.companyId;
    const db = await getDb();

    // Query Meta Graph API for authenticated user profile
    const metaRes = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${token.trim()}`);
    const metaData = await metaRes.json() as any;

    if (metaData.error) {
      res.status(400).json({
        error: 'Meta Graph API Error',
        message: metaData.error.message || 'Failed to authenticate Instagram token'
      });
      return;
    }

    const igId = metaData.id;
    const igUsername = metaData.username;
    const accountType = metaData.account_type || 'MEDIA_CREATOR';
    const now = new Date().toISOString();

    // Live public telemetry
    const liveProfile = await getLiveInstagramProfileMetadata(igUsername);
    const fullName = liveProfile?.fullName || igUsername;
    const stats = liveProfile?.stats || 'Active creator profile on Instagram';

    // Fetch company name
    const cStmt = db.prepare('SELECT name FROM companies WHERE id = ?');
    cStmt.bind([companyId]);
    let companyName = 'Protected Brand';
    if (cStmt.step()) {
      companyName = (cStmt.getAsObject() as any).name || 'Protected Brand';
    }
    cStmt.free();

    // Check if asset already exists
    const checkStmt = db.prepare('SELECT id FROM brand_assets WHERE company_id = ? AND (account_id = ? OR account_id = ?)');
    checkStmt.bind([companyId, `@${igUsername}`, igUsername]);
    let existingId: string | null = null;
    if (checkStmt.step()) {
      existingId = (checkStmt.getAsObject() as any).id;
    }
    checkStmt.free();

    const assetId = existingId || ('asset-ig-' + Math.random().toString(36).substring(2, 9));
    const assetTitle = `Official Instagram - ${fullName} (@${igUsername})`;

    if (existingId) {
      db.run(
        `UPDATE brand_assets SET
          name = ?,
          url = ?,
          platform = 'Instagram',
          account_id = ?,
          publisher = ?,
          verification_status = 'verified_official',
          verification_method = 'meta_graph_api_oauth',
          archived = 0,
          updated_at = ?
         WHERE id = ?`,
        [
          assetTitle,
          `https://instagram.com/${igUsername}`,
          `@${igUsername}`,
          companyName,
          now,
          assetId
        ]
      );
    } else {
      db.run(
        `INSERT INTO brand_assets (
          id, company_id, type, name, url, platform, account_id, package_id, publisher,
          verification_status, verification_method, archived, created_at, updated_at
        ) VALUES (?, ?, 'social', ?, ?, 'Instagram', ?, NULL, ?, 'verified_official', 'meta_graph_api_oauth', 0, ?, ?)`,
        [
          assetId,
          companyId,
          assetTitle,
          `https://instagram.com/${igUsername}`,
          `@${igUsername}`,
          companyName,
          now,
          now
        ]
      );
    }

    saveDb();

    res.json({
      success: true,
      message: `Successfully connected and verified Instagram account ${fullName} (@${igUsername}) via Meta Graph API`,
      account: {
        id: igId,
        username: igUsername,
        handle: `@${igUsername}`,
        fullName,
        stats,
        url: `https://instagram.com/${igUsername}`,
        accountType,
        verificationStatus: 'verified_official',
        verificationMethod: 'meta_graph_api_oauth',
        syncedAt: now
      },
      assetId
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error connecting Instagram account', details: error.message });
  }
});

// GET /api/company/instagram/connected - Returns connected Instagram live account details
router.get('/instagram/connected', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token || !token.trim()) {
      res.json({ connected: false, message: 'No Instagram token configured.' });
      return;
    }

    const companyId = (req.query.companyId as string) || req.user!.companyId;
    const db = await getDb();

    // Query Meta Graph API for authenticated user
    const metaRes = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${token.trim()}`);
    const metaData = await metaRes.json() as any;

    if (metaData.error) {
      res.json({ connected: false, error: metaData.error.message });
      return;
    }

    const igUsername = metaData.username;
    const liveProfile = await getLiveInstagramProfileMetadata(igUsername);

    const checkStmt = db.prepare('SELECT id, verification_status, created_at, updated_at FROM brand_assets WHERE company_id = ? AND (account_id = ? OR account_id = ?)');
    checkStmt.bind([companyId, `@${igUsername}`, igUsername]);
    let assetInfo: any = null;
    if (checkStmt.step()) {
      assetInfo = checkStmt.getAsObject();
    }
    checkStmt.free();

    res.json({
      connected: true,
      username: metaData.username,
      handle: `@${metaData.username}`,
      fullName: liveProfile?.fullName || metaData.username,
      stats: liveProfile?.stats || '',
      id: metaData.id,
      accountType: metaData.account_type || 'MEDIA_CREATOR',
      profileUrl: `https://instagram.com/${metaData.username}`,
      verificationStatus: 'verified_official',
      verificationMethod: 'meta_graph_api_oauth',
      isLiveSynced: Boolean(assetInfo),
      assetId: assetInfo?.id,
      lastSync: assetInfo?.updated_at || new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error checking connected Instagram account', details: error.message });
  }
});

// POST /api/company/instagram/disconnect - Disconnects and removes any connected Instagram account
router.post('/instagram/disconnect', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const companyId = (req.body.companyId as string) || (req.query.companyId as string) || req.user!.companyId;
    const db = await getDb();

    // Archive or remove any OAuth-verified Instagram assets
    db.run(
      "UPDATE brand_assets SET archived = 1 WHERE company_id = ? AND platform = 'Instagram' AND verification_method = 'meta_graph_api_oauth'",
      [companyId]
    );
    saveDb();

    res.json({
      success: true,
      message: 'Instagram account successfully disconnected and removed from official brand assets.'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error disconnecting Instagram account', details: error.message });
  }
});

export default router;
