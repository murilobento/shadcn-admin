import { Router } from 'express';
import { prisma } from './lib/prisma';
import { register, login } from './controllers/authController';
import { authenticateToken } from './middleware/authMiddleware';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        // For now, we can return mock data if the DB is empty or just return what's there
        // In a real app, you'd fetch this from the DB
        // const stats = await prisma.dashboardStats.findFirst();

        // Mocking for initial setup to ensure frontend works even without DB populated
        const stats = {
            totalRevenue: 45231.89,
            activeUsers: 2350,
            salesCount: 12234,
            activeNow: 573
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

router.get('/dashboard/activity', authenticateToken, async (req, res) => {
    try {
        // const activities = await prisma.recentActivity.findMany({
        //   take: 5,
        //   orderBy: { time: 'desc' }
        // });

        const activities = [
            {
                id: 1,
                user: "Olivia Martin",
                email: "olivia.martin@email.com",
                amount: "+$1,999.00",
                status: "success"
            },
            {
                id: 2,
                user: "Jackson Lee",
                email: "jackson.lee@email.com",
                amount: "+$39.00",
                status: "success"
            },
            {
                id: 3,
                user: "Isabella Nguyen",
                email: "isabella.nguyen@email.com",
                amount: "+$299.00",
                status: "processing"
            },
            {
                id: 4,
                user: "William Kim",
                email: "will@email.com",
                amount: "+$99.00",
                status: "success"
            },
            {
                id: 5,
                user: "Sofia Davis",
                email: "sofia.davis@email.com",
                amount: "+$39.00",
                status: "success"
            }
        ];

        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

export default router;
