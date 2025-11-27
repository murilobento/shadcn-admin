import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, email, phoneNumber, status, address, city } = req.body;
        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                phoneNumber,
                status,
                address,
                city
            }
        });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber, status, address, city } = req.body;
        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name,
                email,
                phoneNumber,
                status,
                address,
                city
            }
        });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update customer' });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.customer.delete({
            where: { id }
        });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
};
