import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/LocationService';
import { Location } from '../models/Location';
import { NotFoundError } from '../middleware/errorHandler/errorTypes';

export class LocationController {
    private locationService = new LocationService();

    // public
    getAll = async (req: Request, res: Response): Promise<void> => {
        const includeRefString = req.query.includeRef; //from route /locations?includeRef=true|false
        const includeRefBoolean = includeRefString === undefined ? true : includeRefString === 'true';
        const locations = await this.locationService.getAll(includeRefBoolean);
        res.json(locations.map(lg => lg.toJSON()));
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const includeRefString = req.query.includeRef; //from route /locations?includeRef=true|false
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';

        const id = Number(req.params.id);
        const locationGroup = await this.locationService.getById(id, isIncludeRef);

        if(!locationGroup){
            throw new NotFoundError(`Location group with id: ${id} not found`);
        }
        res.status(200).json(locationGroup);
    };

    // admin
    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Location.modelFor.createRequest = req.body;
        const createdLocation = await this.locationService.create(requestData);
        res.status(201).json(createdLocation);
    };


    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isLocationExist = await this.locationService.getById(id);
        if(!isLocationExist){
            throw new NotFoundError(`Location with id: ${id} not found`);
        }

        const updateData: typeof Location.modelFor.updateRequest = req.body;
        const updatedLocation = await this.locationService.update(id, updateData);
            
        res.status(200).json(updatedLocation.toJSON());
    };
    
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = Number(req.params.id);
        const isLocationExist = await this.locationService.getById(id);
        if(!isLocationExist){
            throw new NotFoundError(`Location group with id: ${id} not found`);
        }

        const isDeleted = await this.locationService.delete(id);
        if (isDeleted) {
            res.status(200).json('Location group deleted successfully');
        }
    };
}