import { Request, Response, NextFunction } from 'express';
import { HazardService } from '../services/HazardService';
import { Hazard } from '../models/Hazard';
import { AuthError, ConflictError, DatabaseUnavailableError, ForbiddenError, NotFoundError } from '../middleware/errorHandler/errorTypes';
import { map } from 'zod';
import is from 'zod/v4/locales/is.cjs';
import { TaskOwnerService } from '../services/TaskOwnerService';

export class HazardController {
    private hazardService = new HazardService();
    private taskOwnerService = new TaskOwnerService();
    // public
    createWithoutLogin = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Hazard.modelFor.createRequest = req.body;
        if(requestData.user_id){
            delete requestData.user_id
        }
        const createdHazard = await this.hazardService.create(requestData, false);
        res.status(201).json(createdHazard);
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Hazard.modelFor.createRequest = req.body;
        if(requestData.user_id === undefined){
            throw new AuthError('Access denied');
        }
        // Ensure joined fields are null when user_id is present
        delete requestData.user_name;
        delete requestData.email;
        delete requestData.phone_number;

        const userIdFromToken = req.user?.id;

        console.log('requestData.user_id', requestData.user_id);
        console.log('userIdFromToken', userIdFromToken);
        
        if(requestData.user_id !== userIdFromToken){
            throw new ForbiddenError('Access denied');
        }

        const createdHazard = await this.hazardService.create(requestData, true);
        res.status(201).json(createdHazard);
    };

    // for users
    getByUserId = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.userId);
        const userIdFromToken = req.user?.id;

        if (userIdFromToken !== userId) {
            throw new ForbiddenError('Access denied');
        }
        const hazards = await this.hazardService.getByUserId(userId);
        const mappedHazards = hazards.map(h => h.toJSON());
        res.json(mappedHazards);
    };

    // for admins
    getById = async (req: Request, res: Response): Promise<void> => {
        // for super-admin
        const includeRefString = req.query.includeRef; // from route /hazard/:id?includeRef=true?includePrivate=true
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';
        const inludePrivateString = req.query.includePrivate;
        const isIncludePrivate = inludePrivateString === undefined ? true : inludePrivateString === 'true';

        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id, isIncludeRef, isIncludePrivate);

        const isPrivate = hazard.is_private !== 0
        if(isPrivate){
            const adminRoleId = req.body.adminRoleId;
            if(adminRoleId < 5){
                const admin_id = req.body.admin_id;
                const taskOwners = await this.taskOwnerService.getOwnersByHazardId(id);
                const isOwner = taskOwners.find(owner => owner.admin_id === admin_id);
                if(!isOwner){
                    throw new ForbiddenError('Access denied')
                }
                // need to erase user's info from hazard object before sending response
                const { user_id, user_name, email, phone_number, ...rest } = hazard;
                res.status(200).json(rest);
                return;
            }
        }

        res.status(200).json(hazard);
    };


    getAll = async (req: Request, res: Response): Promise<void> => {
        // for super-admin
        const includeRefString = req.query.includeRef; // from route /hazard/?includeRef=true?includePrivate=true
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';
        const inludePrivateString = req.query.includeRef;
        const isIncludePrivate = inludePrivateString === undefined ? true : inludePrivateString === 'true';

        const hazards = await this.hazardService.getAll(isIncludeRef, isIncludePrivate);
        res.json(hazards.map(lg => lg.toJSON()));
    };


    getAllPublic = async (req: Request, res: Response): Promise<void> => {
        // for response-admin & audit-admin
        const includeRefString = req.query.includeRef;
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';

        const hazards = await this.hazardService.getAll(isIncludeRef, false);

        const admin_id = req.body.admin_id;
        const privateHazards = await this.hazardService.getAllPrivateByAdminId(admin_id);

        // Combine public hazards and private hazards (avoid duplicates)
        const hazardIds = new Set(hazards.map(h => h.id));
        const combinedHazards = [
            ...hazards,
            ...privateHazards.filter(ph => !hazardIds.has(ph.id))
        ];

        res.json(combinedHazards.map(lg => lg.toJSON()));
    };

    getAllPrivate = async (req: Request, res: Response): Promise<void> => {
        // for special-admin
        const includeRefString = req.query.includeRef;
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';

        const hazards = await this.hazardService.getAll(isIncludeRef, false);
        res.json(hazards.map(lg => lg.toJSON()));
    };


    // for super-admin
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