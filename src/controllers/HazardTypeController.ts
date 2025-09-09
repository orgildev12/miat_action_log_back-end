import { Request, Response, NextFunction } from 'express';
import { HazardTypeService } from '../services/HazardTypeService';
import { HazardType } from '../models/HazardType';
import { NotFoundError } from '../middleware/errorHandler/errorTypes';

export class HazardTypeController {
    private hazardTypeService = new HazardTypeService();

    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof HazardType.modelFor.createRequest = req.body;
        const createdHazardType = await this.hazardTypeService.create(requestData);
        res.status(201).json(createdHazardType);
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazardType = await this.hazardTypeService.getById(id);

        if(!hazardType){
            throw new NotFoundError(`Hazard type with id: ${id} not found`);
        }
        res.status(200).json(hazardType);
    };

    getAll = async (req: Request, res: Response): Promise<void> => {
        const hazardTypes = await this.hazardTypeService.getAll();
        res.json(hazardTypes.map(lg => lg.toJSON()));
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isTypeExist = await this.hazardTypeService.getById(id);
        if(!isTypeExist){
            throw new NotFoundError(`Hazard type with id: ${id} not found`);
        }

        const updateData: typeof HazardType.modelFor.updateRequest = req.body;
        const updatedHazardType = await this.hazardTypeService.update(id, updateData);
            
        res.status(200).json(updatedHazardType.toJSON());
    };
    
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isTypeExist = await this.hazardTypeService.getById(id);
        if(!isTypeExist){
            throw new NotFoundError(`Hazard type with id: ${id} not found`);
        }

        const isDeleted = await this.hazardTypeService.delete(id);
        if (isDeleted) {
            res.status(200).json('Hazard type deleted successfully');
        }
    };
}