import { Router, Response } from 'express';
import { getDb, saveDb } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../auth';

const router = Router();

// GET /api/assets
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = (req.query.companyId as string) || req.user!.companyId;

    const stmt = db.prepare(`
      SELECT id, company_id, type, name, url, platform, account_id, package_id, publisher,
             verification_status, verification_method, created_at, updated_at
      FROM brand_assets
      WHERE company_id = ? AND archived = 0
      ORDER BY created_at ASC
    `);
    stmt.bind([companyId]);

    const assets = [];
    while (stmt.step()) {
      assets.push(stmt.getAsObject());
    }
    stmt.free();

    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching brand assets' });
  }
});

// POST /api/assets
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = req.user!.companyId;
    const { type, name, url, platform, accountId, packageId, publisher, verificationMethod } = req.body;

    if (!type || !name) {
      res.status(400).json({ error: 'Type and name are required' });
      return;
    }

    const id = 'asset-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO brand_assets (
        id, company_id, type, name, url, platform, account_id, package_id, publisher,
        verification_status, verification_method, archived, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified_official', ?, 0, ?, ?)`,
      [
        id,
        companyId,
        type,
        name,
        url || null,
        platform || 'Web Domain',
        accountId || null,
        packageId || null,
        publisher || 'AcmePay Technologies',
        verificationMethod || 'company_confirmation',
        now,
        now,
      ]
    );

    saveDb();

    res.status(201).json({
      message: 'Official brand asset registered',
      asset: {
        id,
        companyId,
        type,
        name,
        url,
        platform,
        accountId,
        packageId,
        publisher,
        verificationStatus: 'verified_official',
        verificationMethod: verificationMethod || 'company_confirmation',
        createdAt: now,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating asset' });
  }
});

// PUT /api/assets/:id
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = req.user!.companyId;
    const { id } = req.params;
    const { name, url, platform, accountId, packageId, publisher } = req.body;
    const now = new Date().toISOString();

    db.run(
      `UPDATE brand_assets SET
        name = COALESCE(?, name),
        url = COALESCE(?, url),
        platform = COALESCE(?, platform),
        account_id = COALESCE(?, account_id),
        package_id = COALESCE(?, package_id),
        publisher = COALESCE(?, publisher),
        updated_at = ?
       WHERE id = ? AND company_id = ?`,
      [name || null, url || null, platform || null, accountId || null, packageId || null, publisher || null, now, id, companyId]
    );

    saveDb();
    res.json({ message: 'Asset updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating asset' });
  }
});

// DELETE /api/assets/:id
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = req.user!.companyId;
    const id = req.params.id as string;

    db.run('UPDATE brand_assets SET archived = 1 WHERE id = ? AND company_id = ?', [id, companyId]);
    saveDb();

    res.json({ message: 'Asset archived successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting asset' });
  }
});

// POST /api/assets/:id/verify
router.post('/:id/verify', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = req.user!.companyId;
    const { id } = req.params;
    const { verificationMethod } = req.body;
    const now = new Date().toISOString();

    db.run(
      `UPDATE brand_assets SET
        verification_status = 'verified_official',
        verification_method = COALESCE(?, verification_method),
        updated_at = ?
       WHERE id = ? AND company_id = ?`,
      [verificationMethod || 'administrator_approval', now, id, companyId]
    );

    saveDb();
    res.json({ message: 'Asset successfully verified as official' });
  } catch (error) {
    res.status(500).json({ error: 'Server error verifying asset' });
  }
});

export default router;
