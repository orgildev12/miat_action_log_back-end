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


    startAnalysis = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardService.getById(id);

        const isAppected = await this.hazardService.startAnalysis(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('hazard analysis started successfully')
    };


    approveRequest = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id);

        if(hazard.isStarted !== 1){
            throw new ConflictError(`hazard analysis not started yet`);
        }
        const isAppected = await this.hazardService.approveRequest(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('hazard request approved successfully')
    };


    denyRequest = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id);
        if(!hazard){
            throw new NotFoundError(`hazard not found`);
        }
        if(hazard.isStarted !== 1){
            throw new ConflictError(`hazard analysis not started yet`);
        }
        const isAppected = await this.hazardService.denyRequest(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('hazard request denied successfully')
    };


    startChecking = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id);
        if(hazard.isApproved === null){
            throw new ConflictError(`request not approved or denied yet`);
        }
        const isAppected = await this.hazardService.startChecking(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('hazard checking started successfully')
    };


    confirmResponse = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id);
        if(hazard.isChecking === 0){
            throw new ConflictError(`you can't confirm response without checking response`);
        }
        const isAppected = await this.hazardService.confirmResponse(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('hazard response confirmed successfully')
    };


    denyResponse = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id);
        if(hazard.isChecking === 0){
            throw new ForbiddenError(`you can't deny response without checking response`);
        }
        const isAppected = await this.hazardService.approveRequest(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('hazard response denied successfully')
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