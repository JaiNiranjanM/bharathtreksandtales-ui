import { Router, type Request, type Response, type NextFunction } from 'express';
import db from '../db';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string | undefined)?.trim().toLowerCase();
    if (!q) return res.json({ success: true, data: { packages: [], blog: [] } });
    const like = `%${q}%`;
    const packages: any[] = db.prepare('SELECT * FROM packages WHERE LOWER(title) LIKE ? OR LOWER(location) LIKE ? OR LOWER(state) LIKE ? LIMIT 10').all(like, like, like) as any;
    const blogs: any[] = db.prepare('SELECT slug,title,excerpt,category,image,date FROM blog_posts WHERE published=1 AND (LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ?) LIMIT 10').all(like, like) as any;
    // simple mapper
    function mapPkg(r: any) {
      try { return { id: r.id, slug: r.slug, title: r.title, state: r.state, location: r.location, image: r.image, discountPrice: r.discount_price }; } catch { return r; }
    }
    res.json({ success: true, data: { packages: packages.map(mapPkg), blog: blogs } });
  } catch (err) { next(err); }
});

export default router;
