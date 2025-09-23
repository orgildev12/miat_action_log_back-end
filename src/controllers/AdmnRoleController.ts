import { Request, Response, NextFunction } from 'express';
import { AdminRoleService } from '../services/AdminRoleService';
import { AdminRole } from '../models/AdminRole';
import { NotFoundError, ValidationError } from '../middleware/errorHandler/errorTypes';

export class AdminRoleController {
    private adminRoleService = new AdminRoleService();

    // public
    getAll = async (req: Request, res: Response): Promise<void> => {
        const adminRoles = await this.adminRoleService.getAll();
        res.json(adminRoles.map(lg => lg.toJSON()));
    };

    // admin
    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof AdminRole.modelFor.createRequest = req.body;
        const createdAdminRole = await this.adminRoleService.create(requestData);
        res.status(201).json(createdAdminRole);
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const adminRole = await this.adminRoleService.getById(id);

        if(!adminRole){
            throw new NotFoundError(`Admin role with id: ${id} not found`);
        }
        res.status(200).json(adminRole);
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isGroupExist = await this.adminRoleService.getById(id);
        if(!isGroupExist){
            throw new NotFoundError(`Admin role with id: ${id} not found`);
        }

        const updateData: typeof AdminRole.modelFor.updateRequest = req.body;
        const updatedAdminRole = await this.adminRoleService.updateRole(id, updateData);
            
        res.status(200).json(updatedAdminRole.toJSON());
    };
    
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isGroupExist = await this.adminRoleService.getById(id);
        if(!isGroupExist){
            throw new NotFoundError(`Admin role with id: ${id} not found`);
        }

        const isDeleted = await this.adminRoleService.delete(id);
        if (isDeleted) {
            res.status(200).json('Admin role deleted successfully');
        }
    };
}