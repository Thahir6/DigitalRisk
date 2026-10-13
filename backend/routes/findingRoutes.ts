import { Router, Response } from 'express';
import { getDb, saveDb } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../auth';

const router = Router();

// Helper to hydrate finding with signals, evidence, notes
function hydrateFinding(db: any, rawFinding: any) {
  const findingId = rawFinding.id;

  // Signals
  const sigStmt = db.prepare('SELECT id, signal_type, title, explanation, strength, icon_name FROM finding_signals WHERE finding_id = ?');
  sigStmt.bind([findingId]);
  const signals = [];
  while (sigStmt.step()) {
    const s = sigStmt.getAsObject() as any;
    signals.push({
      id: s.id,
      title: s.title,
      explanation: s.explanation,
      strength: s.strength,
      iconName: s.icon_name,
    });
  }
  sigStmt.free();

  // Evidence
  const evStmt = db.prepare('SELECT id, type, url_or_path, timestamp, description, source, sha256_hash FROM evidence WHERE finding_id = ?');
  evStmt.bind([findingId]);
  const evidenceList = [];
  while (evStmt.step()) {
    const e = evStmt.getAsObject() as any;
    evidenceList.push({
      id: e.id,
      type: e.type,
      urlOrPath: e.url_or_path,
      timestamp: e.timestamp,
      description: e.description,
      source: e.source,
      sha256Hash: e.sha256_hash,
    });
  }
  evStmt.free();

  // Notes / Timeline
  const noteStmt = db.prepare('SELECT id, user_name, role, action, text, created_at FROM notes WHERE finding_id = ? ORDER BY rowid ASC');
  noteStmt.bind([findingId]);
  const timeline = [];
  while (noteStmt.step()) {
    const n = noteStmt.getAsObject() as any;
    timeline.push({
      id: n.id,
      author: n.user_name,
      role: n.role,
      action: n.action,
      note: n.text,
      timestamp: n.created_at,
    });
  }
  noteStmt.free();

  let lookalike = null;
  if (rawFinding.lookalike_data) {
    try {
      lookalike = JSON.parse(rawFinding.lookalike_data);
    } catch {
      lookalike = null;
    }
  }

  let connectedCampaign = null;
  if (rawFinding.connected_campaign) {
    try {
      connectedCampaign = JSON.parse(rawFinding.connected_campaign);
    } catch {
      connectedCampaign = null;
    }
  }

  return {
    id: rawFinding.id,
    companyId: rawFinding.company_id,
    isDemo: Boolean(rawFinding.is_demo !== 0),
    type: rawFinding.type,
    title: rawFinding.title,
    platform: rawFinding.platform,
    usernameOrPackage: rawFinding.username_or_package,
    candidateUrl: rawFinding.candidate_url,
    riskSeverity: rawFinding.risk_severity,
    riskScore: rawFinding.risk_score,
    confidence: rawFinding.confidence,
    status: rawFinding.status,
    mainReason: rawFinding.main_reason,
    detailedReason: rawFinding.detailed_reason,
    detectedTime: rawFinding.detected_time,
    firstSeen: rawFinding.first_seen,
    lastSeen: rawFinding.last_seen,
    publisherOrOwner: rawFinding.publisher_or_owner,
    candidateWebsite: rawFinding.candidate_website,
    description: rawFinding.description,
    avatarColor: rawFinding.avatar_color,
    avatarInitials: rawFinding.avatar_initials,
    lookalike,
    connectedCampaign,
    signals,
    evidence: evidenceList[0] || {
      evidenceCount: evidenceList.length,
      source: 'Security Crawler',
      rawUrl: rawFinding.candidate_url,
      detectedAt: rawFinding.detected_time,
      firstSeen: rawFinding.first_seen,
      lastSeen: rawFinding.last_seen,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      screenshotLabel: 'Telemetry capture',
    },
    allEvidence: evidenceList,
    timeline,
  };
}

function batchHydrateFindings(db: any, rawFindings: any[]) {
  if (!rawFindings || !rawFindings.length) return [];

  const findingIds = rawFindings.map((f) => f.id);
  const signalsMap = new Map<string, any[]>();
  const evidenceMap = new Map<string, any[]>();
  const timelineMap = new Map<string, any[]>();

  for (const id of findingIds) {
    signalsMap.set(id, []);
    evidenceMap.set(id, []);
    timelineMap.set(id, []);
  }

  const placeholders = findingIds.map(() => '?').join(',');

  try {
    const sigStmt = db.prepare(`SELECT finding_id, id, signal_type, title, explanation, strength, icon_name FROM finding_signals WHERE finding_id IN (${placeholders})`);
    sigStmt.bind(findingIds);
    while (sigStmt.step()) {
      const s = sigStmt.getAsObject() as any;
      const list = signalsMap.get(s.finding_id);
      if (list) {
        list.push({
          id: s.id,
          title: s.title,
          explanation: s.explanation,
          strength: s.strength,
          iconName: s.icon_name,
        });
      }
    }
    sigStmt.free();
  } catch (err) {
    console.error('Error batch loading signals:', err);
  }

  try {
    const evStmt = db.prepare(`SELECT finding_id, id, type, url_or_path, timestamp, description, source, sha256_hash FROM evidence WHERE finding_id IN (${placeholders})`);
    evStmt.bind(findingIds);
    while (evStmt.step()) {
      const e = evStmt.getAsObject() as any;
      const list = evidenceMap.get(e.finding_id);
      if (list) {
        list.push({
          id: e.id,
          type: e.type,
          urlOrPath: e.url_or_path,
          timestamp: e.timestamp,
          description: e.description,
          source: e.source,
          sha256Hash: e.sha256_hash,
        });
      }
    }
    evStmt.free();
  } catch (err) {
    console.error('Error batch loading evidence:', err);
  }

  try {
    const noteStmt = db.prepare(`SELECT finding_id, id, user_name, role, action, text, created_at FROM notes WHERE finding_id IN (${placeholders}) ORDER BY rowid ASC`);
    noteStmt.bind(findingIds);
    while (noteStmt.step()) {
      const n = noteStmt.getAsObject() as any;
      const list = timelineMap.get(n.finding_id);
      if (list) {
        list.push({
          id: n.id,
          author: n.user_name,
          role: n.role,
          action: n.action,
          note: n.text,
          timestamp: n.created_at,
        });
      }
    }
    noteStmt.free();
  } catch (err) {
    console.error('Error batch loading notes:', err);
  }

  return rawFindings.map((rawFinding) => {
    const signals = signalsMap.get(rawFinding.id) || [];
    const evidenceList = evidenceMap.get(rawFinding.id) || [];
    const timeline = timelineMap.get(rawFinding.id) || [];

    let lookalike = null;
    if (rawFinding.lookalike_data) {
      try {
        lookalike = JSON.parse(rawFinding.lookalike_data);
      } catch {
        lookalike = null;
      }
    }

    let connectedCampaign = null;
    if (rawFinding.connected_campaign) {
      try {
        connectedCampaign = JSON.parse(rawFinding.connected_campaign);
      } catch {
        connectedCampaign = null;
      }
    }

    return {
      id: rawFinding.id,
      companyId: rawFinding.company_id,
      isDemo: Boolean(rawFinding.is_demo !== 0),
      type: rawFinding.type,
      title: rawFinding.title,
      platform: rawFinding.platform,
      usernameOrPackage: rawFinding.username_or_package,
      candidateUrl: rawFinding.candidate_url,
      riskSeverity: rawFinding.risk_severity,
      riskScore: rawFinding.risk_score,
      confidence: rawFinding.confidence,
      status: rawFinding.status,
      mainReason: rawFinding.main_reason,
      detailedReason: rawFinding.detailed_reason,
      detectedTime: rawFinding.detected_time,
      firstSeen: rawFinding.first_seen,
      lastSeen: rawFinding.last_seen,
      publisherOrOwner: rawFinding.publisher_or_owner,
      candidateWebsite: rawFinding.candidate_website,
      description: rawFinding.description,
      avatarColor: rawFinding.avatar_color,
      avatarInitials: rawFinding.avatar_initials,
      lookalike,
      connectedCampaign,
      signals,
      evidence: evidenceList[0] || {
        evidenceCount: evidenceList.length,
        source: 'Security Crawler',
        rawUrl: rawFinding.candidate_url,
        detectedAt: rawFinding.detected_time,
        firstSeen: rawFinding.first_seen,
        lastSeen: rawFinding.last_seen,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        screenshotLabel: 'Telemetry capture',
      },
      allEvidence: evidenceList,
      timeline,
    };
  });
}

// GET /api/findings
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = (req.query.companyId as string) || req.user!.companyId;
    const { type, severity, status, search } = req.query;

    let query = 'SELECT * FROM findings WHERE company_id = ?';
    const params: any[] = [companyId];

    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }
    if (severity && severity !== 'all') {
      query += ' AND risk_severity = ?';
      params.push(severity);
    }
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search && typeof search === 'string') {
      query += ' AND (title LIKE ? OR username_or_package LIKE ? OR main_reason LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY rowid DESC';

    const stmt = db.prepare(query);
    stmt.bind(params);

    const rawFindings = [];
    while (stmt.step()) {
      rawFindings.push(stmt.getAsObject() as any);
    }
    stmt.free();

    const findings = batchHydrateFindings(db, rawFindings);
    res.json(findings);
  } catch (error) {
    console.error('Error fetching findings:', error);
    res.status(500).json({ error: 'Server error fetching findings' });
  }
});

// GET /api/findings/:id
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const id = req.params.id as string;

    const stmt = db.prepare('SELECT * FROM findings WHERE id = ?');
    stmt.bind([id]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ error: 'Finding not found' });
      return;
    }

    const raw = stmt.getAsObject() as any;
    stmt.free();

    res.json(hydrateFinding(db, raw));
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching finding details' });
  }
});

// PATCH /api/findings/:id/status
router.patch('/:id/status', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = req.user!.companyId;
    const id = req.params.id as string;
    const { status, note } = req.body;

    const allowed = ['New', 'Investigating', 'Likely impersonation', 'Confirmed fake', 'Dismissed', 'Resolved'];
    if (!allowed.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    const now = new Date().toISOString();

    db.run(
      'UPDATE findings SET status = ?, updated_at = ? WHERE id = ? AND company_id = ?',
      [status, now, id, companyId]
    );

    // Record timeline audit note
    const noteId = 'not-' + Math.random().toString(36).substring(2, 9);
    const actionText = `Status updated to ${status}`;
    const userNote = note || `Analyst marked finding as "${status}".`;

    db.run(
      `INSERT INTO notes (id, finding_id, user_id, user_name, role, action, text, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Just now')`,
      [noteId, id, req.user!.id, req.user!.name, req.user!.role, actionText, userNote]
    );

    // Audit Event
    db.run(
      `INSERT INTO audit_events (id, company_id, user_id, action, entity_type, entity_id, timestamp)
       VALUES (?, ?, ?, ?, 'finding', ?, ?)`,
      ['aud-' + Math.random().toString(36).substring(2, 9), companyId, req.user!.id, `status_change:${status}`, id, now]
    );

    saveDb();

    res.json({ message: `Finding status updated to ${status}`, status });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating finding status' });
  }
});

// POST /api/findings/:id/notes
router.post('/:id/notes', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = req.user!.companyId;
    const id = req.params.id as string;
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Note text cannot be empty' });
      return;
    }

    // Verify finding belongs to company
    const checkStmt = db.prepare('SELECT id FROM findings WHERE id = ? AND company_id = ?');
    checkStmt.bind([id, companyId]);
    if (!checkStmt.step()) {
      checkStmt.free();
      res.status(404).json({ error: 'Finding not found' });
      return;
    }
    checkStmt.free();

    const noteId = 'not-' + Math.random().toString(36).substring(2, 9);

    db.run(
      `INSERT INTO notes (id, finding_id, user_id, user_name, role, action, text, created_at)
       VALUES (?, ?, ?, ?, ?, 'Analyst Note', ?, 'Just now')`,
      [noteId, id, req.user!.id, req.user!.name, req.user!.role, text.trim()]
    );

    saveDb();

    res.status(201).json({
      message: 'Note added to activity timeline',
      note: {
        id: noteId,
        author: req.user!.name,
        role: req.user!.role,
        action: 'Analyst Note',
        note: text.trim(),
        timestamp: 'Just now',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error adding note' });
  }
});

// GET /api/findings/:id/evidence
router.get('/:id/evidence', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const companyId = req.user!.companyId;
    const id = req.params.id as string;

    const stmt = db.prepare(`
      SELECT e.* FROM evidence e
      JOIN findings f ON e.finding_id = f.id
      WHERE f.id = ? AND f.company_id = ?
    `);
    stmt.bind([id, companyId]);

    const evidence = [];
    while (stmt.step()) {
      evidence.push(stmt.getAsObject());
    }
    stmt.free();

    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching evidence' });
  }
});

export default router;
