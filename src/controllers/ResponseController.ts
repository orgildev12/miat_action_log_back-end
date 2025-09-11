import { Request, Response, NextFunction } from 'express';
import { ResponseService } from '../services/ResponseService';
import { ResponseModel } from '../models/Response';
import { ConflictError, DatabaseUnavailableError, ForbiddenError, NotFoundError } from '../middleware/errorHandler/errorTypes';
import { HazardService } from '../services/HazardService';

export class ResponseController {
    private responseService = new ResponseService();

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);

        if(!response){
            throw new NotFoundError(`response not found`);
        }
        res.status(200).json(response);
    };


    getAll = async (req: Request, res: Response): Promise<void> => {
        const responses = await this.responseService.getAll();
        res.json(responses.map(lg => lg.toJSON()));
    };

    startAnalysis = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.responseService.getById(id);

        const isAppected = await this.responseService.startAnalysis(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response analysis started successfully')
    };


    approveRequest = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);
        const responseBody = req.body.response_body
        if(response.isStarted !== 1){
            throw new ConflictError(`response analysis not started yet`);
        }
        const isAppected = await this.responseService.approveRequest(id, responseBody);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response request approved successfully')
    };


    denyRequest = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);
        const responseBody = req.body.response_body
        if(response.isStarted !== 1){
            throw new ConflictError(`response analysis not started yet`);
        }
        const isAppected = await this.responseService.denyRequest(id, responseBody);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response request denied successfully')
    };

    finishAnalysis = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);
        if(response.isRequestApproved === 0){
            throw new ConflictError(`request not approved or denied yet`);
        }
        const isAppected = await this.responseService.finishAnalysis(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response checking started successfully')
    };

    startChecking = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);
        if(response.isResponseFinished === 0){
            throw new ConflictError(`request not finished yet`);
        }
        const isAppected = await this.responseService.startChecking(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response checking started successfully')
    };


    confirmResponse = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);
        if(response.isCheckingResponse === 0){
            throw new ConflictError(`you can't confirm response without checking response`);
        }
        const isAppected = await this.responseService.confirmResponse(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response confirmed successfully')
    };


    denyResponse = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);
        const responseBody = req.body.response_body
        if(response.isCheckingResponse === 0){
            throw new ForbiddenError(`you can't deny response without checking response`);
        }
        const isAppected = await this.responseService.denyResponse(id, responseBody);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response denied successfully')
    };
    
}