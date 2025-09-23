import { Request, Response, NextFunction } from 'express';
import { ResponseService } from '../services/ResponseService';
import { ConflictError, DatabaseUnavailableError, ForbiddenError } from '../middleware/errorHandler/errorTypes';
import { HazardService } from '../services/HazardService';
import { HazardPermissionChecker } from '../utils/hazardPermisionChecker';


export class ResponseController {
    private responseService = new ResponseService();
    private hazardService = new HazardService();
    private hazardPermissionChecker = new HazardPermissionChecker();


    // for users
    getByIdForUser = async (req: Request, res: Response): Promise<void> => {
        const hazardId = Number(req.params.hazardId);
        const userIdFromToken = req.user?.id;
        const hazard = await this.hazardService.getById(hazardId);
        if(hazard.user_id !== userIdFromToken){
            throw new ForbiddenError('Access denied');
        }

        const response = await this.responseService.getByIdForUser(hazardId)
        if(response.isResponseConfirmed === 0){
            // Хэрэв response баталгаажаагүй бол response_body-ийг явуулах шаардлагагүй.
            res.status(200).json({...response, response_body: null});
        }

        res.status(200).json(response);
    }


    // for admins
    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const response = await this.responseService.getById(id);
        res.status(200).json(response);
    };

    getAll = async (req: Request, res: Response): Promise<void> => {
        const responses = await this.responseService.getAll();
        res.json(responses.map(lg => lg.toJSON()));
    };


    // for response admin
    startAnalysis = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardPermissionChecker.checkPermissionForAccess(id, req, 2)
        await this.responseService.getById(id);

        const isAppected = await this.responseService.startAnalysis(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('analysis started successfully')
    };

    updateResponseBody = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardPermissionChecker.checkPermissionForAccess(id, req, 2)
        const responseBody = req.body.response_body
        const response = await this.responseService.getById(id);
        if(response.isStarted !== 1){
            throw new ConflictError(`response analysis not started yet`);
        }
        const isAppected = await this.responseService.updateResponseBody(id, responseBody);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response body updated successfully')
    }

    approveRequest = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardPermissionChecker.checkPermissionForAccess(id, req, 2)
        const response = await this.responseService.getById(id);
        const responseBody = req.body.response_body
        if(response.isStarted !== 1){
            throw new ConflictError(`request analysis not started yet`);
        }
        const isAppected = await this.responseService.approveRequest(id, responseBody);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('request approved successfully')
    };


    denyRequest = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardPermissionChecker.checkPermissionForAccess(id, req, 2)
        const response = await this.responseService.getById(id);
        const responseBody = req.body.response_body
        if(response.isStarted !== 1){
            throw new ConflictError(`request analysis not started yet`);
        }
        const isAppected = await this.responseService.denyRequest(id, responseBody);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('request denied successfully')
    };


    finishAnalysis = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardPermissionChecker.checkPermissionForAccess(id, req, 2)
        const response = await this.responseService.getById(id);
        if(response.isRequestApproved === 0){
            throw new ConflictError(`request not approved or denied yet`);
        }

        const bodyLength = response.responseBody?.trim().length || 0
        if(bodyLength < 20){
            throw new ConflictError(`response body too short`);
        }

        const isAppected = await this.responseService.finishAnalysis(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response checking started successfully')
    };

    // for audit admin
    confirmResponse = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardPermissionChecker.checkPermissionForAccess(id, req, 3)
        const response = await this.responseService.getById(id);
        if(response.isResponseFinished === 0){
            throw new ConflictError(`request not finished yet`);
        }
        const isAppected = await this.responseService.confirmResponse(id);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response confirmed successfully')
    };


    denyResponse = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.hazardPermissionChecker.checkPermissionForAccess(id, req, 3)
        const response = await this.responseService.getById(id);
        const reasonToDeny = req.body.reason_to_deny
        if(response.isResponseFinished === 0){
            throw new ConflictError(`request not finished yet`);
        }
        const isAppected = await this.responseService.denyResponse(id, reasonToDeny);
        if(!isAppected){
            throw new DatabaseUnavailableError();
        }
        res.status(200).json('response denied successfully')
    };
}