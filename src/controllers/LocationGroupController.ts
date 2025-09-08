import { Request, Response, NextFunction } from 'express';
import { LocationGroupService } from '../services/LocationGroupService';
import { LocationGroup } from '../models/LocationGroup';
import { NotFoundError, ValidationError } from '../middleware/errorHandler/errorTypes';

export class LocationGroupController {
    private locationGroupService = new LocationGroupService();

    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof LocationGroup.modelFor.createRequest = req.body;
        const createdLocationGroup = await this.locationGroupService.create(requestData);
        res.status(201).json(createdLocationGroup);
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const locationGroup = await this.locationGroupService.getById(id);

        if(!locationGroup){
            throw new NotFoundError(`Location group with id: ${id} not found`);
        }
        res.status(200).json(locationGroup);
    };

    getAll = async (req: Request, res: Response): Promise<void> => {
        const locationGroups = await this.locationGroupService.getAll();
        res.json(locationGroups.map(lg => lg.toJSON()));
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isGroupExist = await this.locationGroupService.getById(id);
        if(!isGroupExist){
            throw new NotFoundError(`Location group with id: ${id} not found`);
        }

        const updateData: typeof LocationGroup.modelFor.updateRequest = req.body;
        const updatedLocationGroup = await this.locationGroupService.update(id, updateData);
            
        res.status(200).json(updatedLocationGroup.toJSON());
    };
    
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isGroupExist = await this.locationGroupService.getById(id);
        if(!isGroupExist){
            throw new NotFoundError(`Location group with id: ${id} not found`);
        }

        const isDeleted = await this.locationGroupService.delete(id);
        if (isDeleted) {
            res.status(200).json('Location group deleted successfully');
        }
    };
}