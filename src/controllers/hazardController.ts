import { Request, Response, NextFunction } from 'express';
import { HazardService } from '../services/HazardService';
import { Hazard } from '../models/Hazard';
import { ConflictError, DatabaseUnavailableError, ForbiddenError, NotFoundError } from '../middleware/errorHandler/errorTypes';

export class HazardController {
    private hazardService = new HazardService();

    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Hazard.modelFor.createRequest = req.body;
        const createdHazard = await this.hazardService.create(requestData);
        res.status(201).json(createdHazard);
    };


    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id);

        if(!hazard){
            throw new NotFoundError(`hazard not found`);
        }
        res.status(200).json(hazard);
    };


    getAll = async (req: Request, res: Response): Promise<void> => {
        const hazards = await this.hazardService.getAll();
        res.json(hazards.map(lg => lg.toJSON()));
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const isTypeExist = await this.hazardService.getById(id);
        if(!isTypeExist){
            throw new NotFoundError(`hazard not found`);
        }

        const isDeleted = await this.hazardService.delete(id);
        if (isDeleted) {
            res.status(200).json('hazard deleted successfully');
        }
    };
}