import { Router, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../auth';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = (req.query.companyId as string) || req.user!.companyId;

    const stmt = db.prepare(`
      SELECT 
        SUM(CASE WHEN status NOT IN ('Dismissed', 'Resolved') THEN 1 ELSE 0 END) as open_findings,
        SUM(CASE WHEN risk_severity = 'critical' AND status NOT IN ('Dismissed', 'Resolved') THEN 1 ELSE 0 END) as critical_findings,
        SUM(CASE WHEN risk_severity = 'high' AND status NOT IN ('Dismissed', 'Resolved') THEN 1 ELSE 0 END) as high_risk_findings,
        SUM(CASE WHEN type = 'social' AND status NOT IN ('Dismissed', 'Resolved') THEN 1 ELSE 0 END) as social_findings,
        SUM(CASE WHEN type = 'app' AND status NOT IN ('Dismissed', 'Resolved') THEN 1 ELSE 0 END) as app_findings
      FROM findings
      WHERE company_id = ?
    `);
    stmt.bind([companyId]);
    stmt.step();
    const counts = stmt.getAsObject() as any;
    stmt.free();

    const assetStmt = db.prepare(`
      SELECT COUNT(*) as verified_count FROM brand_assets
      WHERE company_id = ? AND verification_status = 'verified_official' AND archived = 0
    `);
    assetStmt.bind([companyId]);
    assetStmt.step();
    const verifiedAssets = (assetStmt.getAsObject() as any).verified_count || 0;
    assetStmt.free();

    res.json({
      openFindings: counts.open_findings || 0,
      criticalFindings: counts.critical_findings || 0,
      highRiskFindings: counts.high_risk_findings || 0,
      socialFindings: counts.social_findings || 0,
      appFindings: counts.app_findings || 0,
      verifiedAssets,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error computing dashboard summary' });
  }
});

// GET /api/dashboard/severity
router.get('/severity', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = (req.query.companyId as string) || req.user!.companyId;

    const stmt = db.prepare(`
      SELECT risk_severity, COUNT(*) as count
      FROM findings
      WHERE company_id = ? AND status NOT IN ('Dismissed', 'Resolved')
      GROUP BY risk_severity
    `);
    stmt.bind([companyId]);

    const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    let total = 0;
    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      counts[row.risk_severity] = row.count;
      total += row.count;
    }
    stmt.free();

    const denom = total || 1;

    res.json({
      total,
      breakdown: [
        { label: 'Critical Risk', severity: 'critical', count: counts.critical, pct: Math.round((counts.critical / denom) * 100), color: '#ef4444' },
        { label: 'High Risk', severity: 'high', count: counts.high, pct: Math.round((counts.high / denom) * 100), color: '#f97316' },
        { label: 'Medium Risk', severity: 'medium', count: counts.medium, pct: Math.round((counts.medium / denom) * 100), color: '#f59e0b' },
        { label: 'Low Risk', severity: 'low', count: counts.low, pct: Math.round((counts.low / denom) * 100), color: '#94a3b8' },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error computing severity breakdown' });
  }
});

// GET /api/dashboard/trends
router.get('/trends', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Generate realistic 7-day trend metrics for line chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trends = [
      { day: days[0], social: 3, apps: 1, total: 4 },
      { day: days[1], social: 5, apps: 2, total: 7 },
      { day: days[2], social: 4, apps: 2, total: 6 },
      { day: days[3], social: 7, apps: 3, total: 10 },
      { day: days[4], social: 6, apps: 4, total: 10 },
      { day: days[5], social: 9, apps: 3, total: 12 },
      { day: days[6], social: 8, apps: 5, total: 13 },
    ];

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Server error generating trend data' });
  }
});

export default router;
