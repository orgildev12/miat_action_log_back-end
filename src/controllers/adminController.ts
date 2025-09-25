import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/AdminService';
import { Admin } from '../models/Admin';
import { NotFoundError, ValidationError } from '../middleware/errorHandler/errorTypes';

export class AdminController {
    private adminService = new AdminService();

    getAll = async (req: Request, res: Response): Promise<void> => {
        const admins = await this.adminService.getAll();
        res.json(admins.map(lg => lg.toJSON()));
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Admin.modelFor.createRequest = req.body;
        const createdAdmin = await this.adminService.create(requestData);
        res.status(201).json(createdAdmin);
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const admin = await this.adminService.getById(id);

        if(!admin){
            throw new NotFoundError(`admin with id: ${id} not found`);
        }
        res.status(200).json(admin);
    };

    getByUserId = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const admin = await this.adminService.getByUserId(id);

        if(!admin){
            throw new NotFoundError(`admin with user_id: ${id} not found`);
        }
        res.status(200).json(admin);
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        await this.adminService.getById(id);

        const updateData: typeof Admin.modelFor.updateRequest = req.body;
        const updatedAdmin = await this.adminService.updateRole(id, updateData);
            
        res.status(200).json(updatedAdmin.toJSON());
    };
    
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isGroupExist = await this.adminService.getById(id);
        if(!isGroupExist){
            throw new NotFoundError(`admin with id: ${id} not found`);
        }

        const isDeleted = await this.adminService.delete(id);
        if (isDeleted) {
            res.status(200).json('admin deleted successfully');
        }
    };
}