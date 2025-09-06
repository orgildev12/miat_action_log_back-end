import { Request, Responce } from 'express';
import { LocationGroupService } from '../services/LocationGroupService';
import { LocationGroup } from '../models/LocationGroup';

export class LocationGroupController {
    private locationGroupService = new LocationGroupService();

    async create(req: Request, res: Responce): Promise<void>{
        try {
            const location_group = new LocationGroup({
                name_en: req.body.name_en,
                name_mn: req.body.name_mn
            });

            const createdLocationGroup = await this.locationGroupService.create(location_group);

            res.status(200).json(createdLocationGroup.toJSON());
        } catch (error){
            res.status(400).json(error);
        }
    }

    async getById(req: Request, res: Responce): Promise<void> {
        try {
            const id = req.params.id;
            const location_group = await this.locationGroupService.getById(id);

            res.status(200).json(location_group.toJSON());
        } catch(error){
            res.status(400).json(error);
        }
    }

    async getAll(req: Request, res: Responce): Promise<void> {
        try {
            const location_groups = await this.locationGroupService.getAll();

            res.status(200).json(location_groups.map(location_group => location_group.toJSON()));
        } catch(error){
            res.status(400).json(error);
        }
    }

    async update(req: Request, res: Responce): Promise<void> {
        const id = req.params.id;
        const location_group = new LocationGroup;
        try {
            const updatedGroup = await this.locationGroupService.update(id, location_group);
            res.status(200).json(updatedGroup.toJSON());
        } catch(error){
            res.status(400).json(error);
        }
    }
    
    async delete(req: Request, res: Responce): Promise<void>{
        const id = req.params.id;
        try{
            const isDeleted = await this.locationGroupService.delete(id);
            res.status(200).json(isDeleted)
        }catch(error){
            res.status(400).json(error);
        }
    }
}