import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, role, password, status } = req.body;

        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                role,
                status: status || 'active',
                password: hashedPassword,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, role, password, status } = req.body;

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const dataToUpdate: any = {
            firstName,
            lastName,
            email,
            role,
            status,
        };

        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

export const inviteUser = async (req: Request, res: Response) => {
    try {
        const { email, role, desc } = req.body;

        if (!email || !role) {
            return res.status(400).json({ error: 'Email and role are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Generate a random password for invited users (or handle password setup later)
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const user = await prisma.user.create({
            data: {
                email,
                firstName: 'Invited',
                lastName: 'User',
                role,
                status: 'invited',
                password: hashedPassword,
            },
        });

        // In a real app, send email here with invite link
        console.log(`Invitation sent to ${email} with temp password: ${tempPassword}`);

        res.status(201).json({ message: 'Invitation sent', user });
    } catch (error) {
        console.error('Error inviting user:', error);
        res.status(500).json({ error: 'Failed to invite user' });
    }
};
