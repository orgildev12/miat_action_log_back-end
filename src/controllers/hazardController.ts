import { Request, Response, NextFunction } from 'express';
import { HazardService } from '../services/HazardService';
import { Hazard } from '../models/Hazard';
import { ConflictError, DatabaseUnavailableError, ForbiddenError, NotFoundError } from '../middleware/errorHandler/errorTypes';
import { map } from 'zod';
import is from 'zod/v4/locales/is.cjs';

export class HazardController {
    private hazardService = new HazardService();

    // for user
    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Hazard.modelFor.createRequest = req.body;
        if(requestData.user_id === undefined){
            // Хэрэв user_id байхгүй гадны хэрэглэгч гэсэг үг.
            // Гадны хэрэглэгч хүсэлт явуулж болно.
            // Гэхдээ ингэхийн тулд hazard.user_name, hazard.email, hazard.phone_number байх ёстой.
            // Энэ шалгалтыг Hazard model.validate() дотор хийсэн байгаа.

            const createdHazard = await this.hazardService.create(requestData);
            res.status(201).json(createdHazard);
        }

        const userIdFromToken = req.user?.id;
        if(requestData.user_id !== userIdFromToken){
            throw new ForbiddenError('Access denied');
        }

        const createdHazard = await this.hazardService.create(requestData);
        res.status(201).json(createdHazard);
    };

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

    // for admin
    getById = async (req: Request, res: Response): Promise<void> => {
        const includeRefString = req.query.includeRef; //from route /hazard/:id?includeRef=true|false
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';
        const inludePrivateString = req.query.includeRef; //from route /hazard/:id?includeRef=true|false
        const isIncludePrivate = inludePrivateString === undefined ? true : inludePrivateString === 'true';

        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id, isIncludeRef, isIncludePrivate);

        if(!hazard){
            throw new NotFoundError(`hazard not found`);
        }
        res.status(200).json(hazard);
    };

    getAll = async (req: Request, res: Response): Promise<void> => {
        const includeRefString = req.query.includeRef; //from route /hazard?includeRef=true|false
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';
        const inludePrivateString = req.query.includeRef; //from route /hazard?includeRef=true|false
        const isIncludePrivate = inludePrivateString === undefined ? true : inludePrivateString === 'true';

        const hazards = await this.hazardService.getAll(isIncludeRef, isIncludePrivate);
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