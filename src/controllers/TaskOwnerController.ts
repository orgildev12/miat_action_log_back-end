import { Request, Response, NextFunction } from 'express';
import { ConflictError, DatabaseUnavailableError, ForbiddenError, NotFoundError, ValidationError } from '../middleware/errorHandler/errorTypes';
import { TaskOwnerService } from '../services/TaskOwnerService';
import { HazardService } from '../services/HazardService';
import { HazardTypeService } from '../services/HazardTypeService';
import { TaskOwner } from '../models/TaskOwner';
import { HazardPermissionChecker } from '../utils/hazardPermisionChecker';

export class TaskOwnerController {
    private taskOwnerService = new TaskOwnerService();
    private hazardService = new HazardService();
    private hazardTypeService = new HazardTypeService();
    private hazardPermissionChecker = new HazardPermissionChecker();

    private async getAdminRoleId(req: Request): Promise<number> {
        const adminRoleId = req.user?.role_id;
        return adminRoleId!;
    }

    getOwnersByHazardId = async (req: Request, res: Response): Promise<void> => {
        const hazardId = Number(req.params.hazardId);
        const userIdFromToken = req.user?.id;

        const adminRoleId = await this.getAdminRoleId(req)
        const hazard = await this.hazardService.getById(hazardId, false, true);
        const hazardType = await this.hazardTypeService.getById(hazard.type_id);
        if(hazardType.isPrivate === 1 && adminRoleId < 5){
            const isOwner = await this.taskOwnerService.checkOwner(hazardId, adminRoleId);
            if(!isOwner){
                throw new ForbiddenError('Access denied');
            }
        }
        const ownerList = await this.taskOwnerService.getOwnersByHazardId(hazardId);

        res.status(200).json(ownerList);
    }


    delete = async (req: Request, res: Response): Promise<void> => {
        const { hazard_id, admin_id } = req.body;
        if (typeof hazard_id !== 'number' || typeof admin_id !== 'number') {
            throw new ValidationError('hazard_id and admin_id must be provided');
        }
        await this.hazardPermissionChecker.checkPermissionForAccess(hazard_id, req, 4);

        const isDeleted = await this.taskOwnerService.delete(hazard_id, admin_id);
        if (!isDeleted) {
            throw new DatabaseUnavailableError("Couldn't delete the task owner, please try again later");
        }
        res.status(200).json('Task owner deleted successfully');
    };


    getAll = async (req: Request, res: Response): Promise<void> => {
        const responses = await this.taskOwnerService.getAll();
        res.json(responses.map(lg => lg.toJSON()));
    };


    addOwner = async (req: Request, res: Response): Promise<void> => {
        const requestData = TaskOwner.modelFor.createRequest = req.body;
        
        await this.hazardPermissionChecker.checkPermissionForAccess(requestData.hazard_id, req, 4)

        // owner байгаа эсэхийг үзээд байхгүй бол owner, байвал collaborator болгож нэмэх
        const ownersOfHazard = await this.taskOwnerService.getOwnersByHazardId(requestData.hazard_id);
        if(requestData.is_collaborator === 0 || ownersOfHazard.length === 0){
            const isOwnerAlreadyExist = ownersOfHazard.find(
                owner => owner.admin_id === requestData.admin_id && 
                owner.is_collaborator === 0
            );
            if(requestData.is_collaborator === 0 && !isOwnerAlreadyExist){
                const createdOwner = await this.taskOwnerService.addOwner(requestData);
                res.status(201).json(createdOwner.toJSON());
            }
        }else{
            const isCollabExist = ownersOfHazard.find(owner => owner.admin_id === requestData.admin_id && owner.is_collaborator === 1);
            if(!isCollabExist){
                const createdCollab = await this.taskOwnerService.addOwner(requestData);
                res.status(201).json(createdCollab.toJSON());
            } else {
                throw new ConflictError('This collaborator already exists for the hazard');
            }
        }
    };


    switchOwnerWithCollab = async (req: Request, res: Response): Promise<void> => {
        const requestData = TaskOwner.modelFor.createRequest = req.body;
        // special admin энэ функцийг хэрэглэхгүй

        const ownersOfHazard = await this.taskOwnerService.getOwnersByHazardId(requestData.hazard_id);
        const currentOwnerOfHazard = ownersOfHazard.find(owner => owner.admin_id === requestData.admin_id && owner.is_collaborator === 0);
        if(!currentOwnerOfHazard){
            throw new NotFoundError('Owner not found');
        }
        await this.taskOwnerService.updateOwnerType(requestData.hazard_id, currentOwnerOfHazard.admin_id, 0);
        const newOwner = await this.taskOwnerService.updateOwnerType(requestData.hazard_id, requestData.admin_id, 1);
        res.status(201).json(newOwner);
    };


    updateOwnerOrCollab = async (req: Request, res: Response): Promise<void> => {
        const requestData = TaskOwner.modelFor.updateRequest = req.body;

        await this.hazardPermissionChecker.checkPermissionForAccess(requestData.hazard_id, req, 4);
        const adminRoleId = await this.getAdminRoleId(req)
        if(requestData.is_collaborator === 0 && adminRoleId === 5){
            throw new ForbiddenError("You can't set owner to private hazard, but you change collaborators")
        }

        await this.taskOwnerService.getById(requestData.hazard_id!, requestData.admin_id!);
        const updatedOwner = await this.taskOwnerService.updateOwner(requestData);
        res.status(200).json(updatedOwner.toJSON());
    }
}