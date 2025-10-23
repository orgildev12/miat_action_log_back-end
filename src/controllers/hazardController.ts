import { Request, Response, NextFunction } from 'express';
import { HazardService } from '../services/HazardService'
import { Hazard } from '../models/Hazard';
import { AuthError, ConflictError, DatabaseUnavailableError, ForbiddenError, NotFoundError, ValidationError } from '../middleware/errorHandler/errorTypes';
import { TaskOwnerService } from '../services/TaskOwnerService';
import { UserService } from '../services/UserService';
import { AdminService } from '../services/AdminService';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth';

// const upload = multer({ storage: multer.memoryStorage() });

export class HazardController {
    private hazardService = new HazardService();
    private taskOwnerService = new TaskOwnerService();
    private userService = new UserService();
    private adminService = new AdminService();
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

    createWithoutLogin = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Hazard.modelFor.createRequest = req.body;
        if(requestData.user_id){
            delete requestData.user_id
        }
        
        const hazard = Hazard.fromRequestData(requestData);
        hazard.validate();
        const validation = hazard.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors.join(', '));
        }

        console.log(requestData);
        const createdHazard = await this.hazardService.create(requestData, false);
        res.status(201).json(createdHazard);
    };


    create = async (req: Request, res: Response): Promise<void> => {
        const requestData: typeof Hazard.modelFor.createRequest = req.body;

        const hazard = Hazard.fromRequestData(requestData);
        hazard.validate();
        const validation = hazard.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors.join(', '));
        }

        if(requestData.user_id === undefined){
            throw new AuthError('Access denied');
        }
        // user_id байсан мөртлөө доорх мөрүүд яагаад ч юм бөглөгдөж ирвэл усгагдана.
        delete requestData.user_name;
        delete requestData.email;
        delete requestData.phone_number;

        const userIdFromToken = req.user?.id;
        if(requestData.user_id !== userIdFromToken){
            throw new ForbiddenError('Access denied');
        }

        const createdHazard = await this.hazardService.create(requestData, true);
        res.status(201).json(createdHazard);
    };


    getAllForNormalAdmins = async (req: Request, res: Response): Promise<void> => {
        // for admin, response-admin, audit-admin, task-admin
        const includeRefString = req.query.includeRef;
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';

        const hazards = await this.hazardService.getAll(isIncludeRef, false, true);

        // Зөвхөн өөрт нь хамаарах private hazard-уудыг нэмэх
        const user_id = req.user?.id;
        if(user_id === undefined){
            throw new AuthError('Access denied')
        }
        const admin = await this.adminService.getByUserId(user_id);
        const privateHazards = await this.hazardService.getAllPrivateByAdminId(admin.id!);

        const hazardIds = new Set(hazards.map(h => h.id));
        const combinedHazards = [
            ...hazards,
            ...privateHazards.filter(ph => !hazardIds.has(ph.id))
        ];

        res.json(combinedHazards.map(lg => lg.toJSON(isIncludeRef)));
    };


    getAllForSuperiorAdmins = async (req: Request, res: Response): Promise<void> => {
        // for special-admin, super-admin: Энэ шалгалт router дээр хийгдсэн.
        const includeRefString = req.query.includeRef; // from route /hazard/?includeRef=true&?includePrivate=true
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';
        const inludePrivateString = req.query.includePrivate;
        const isIncludePrivate = inludePrivateString === undefined ? true : inludePrivateString === 'true';

        const hazards = await this.hazardService.getAll(isIncludeRef, isIncludePrivate, true);

        res.json(hazards.map(lg => lg.toJSON(isIncludeRef)));
    };

    
    getById = async (req: Request, res: Response): Promise<void> => {
        // for all admins
        const includeRefString = req.query.includeRef; // from route /hazard/:id?includeRef=true&?includePrivate=true
        const isIncludeRef = includeRefString === undefined ? true : includeRefString === 'true';
        const inludePrivateString = req.query.includePrivate;
        const isIncludePrivate = inludePrivateString === undefined ? true : inludePrivateString === 'true';

        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id, isIncludeRef, isIncludePrivate, true);

        const isPrivate = hazard.is_private !== 0
        if(isPrivate){
            const adminRoleId = req.user?.role_id;
            if(adminRoleId === undefined){
                throw new AuthError('Access denied')
            }
            if(adminRoleId < 5){
                const admin_id = req.body.admin_id;
                const taskOwners = await this.taskOwnerService.getOwnersByHazardId(id);
                const isOwner = taskOwners.find(owner => owner.admin_id === admin_id);
                if(!isOwner){
                    throw new ForbiddenError('Access denied')
                }
                // 5-с доош эрхтэй admin private hazard-ийн хэрэглэгчийн мэдээлэл харагдахгүй.
                const { user_id, user_name, email, phone_number, ...rest } = hazard;
                res.status(200).json(rest);
                return;
            }
        }

        res.status(200).json(hazard);
    };


    // Энэ controller нь зөвхөн хэрэглэгчид зориулсан учир is_private-аар шүүх болон
    // user_name, email, phone_number-аар баяжлуулах шаардлагагүй
    getByUserId = async (req: Request, res: Response): Promise<void> => {
        // for users
        const userId = Number(req.params.userId);
        const userIdFromToken = req.user?.id;

        if (userIdFromToken !== userId) {
            throw new ForbiddenError('Access denied');
        }
        const hazards = await this.hazardService.getByUserId(userId, true);
        const mappedHazards = hazards.map(h => h.toJSON(true));
        res.json(mappedHazards);
    };


    delete = async (req: Request, res: Response): Promise<void> => {
        // for only super-admin
        const id = Number(req.params.id);
        const isHazardExist = await this.hazardService.getById(id, false, true, false);
        if(!isHazardExist){
            throw new NotFoundError(`hazard not found`);
        }

        const isDeleted = await this.hazardService.delete(id);
        if (isDeleted) {
            res.status(200).json('hazard deleted successfully');
        }
    };


    uploadImages = async (req: Request, res: Response): Promise<void> => {
    // хэн ч хэний ч hazard- луу зураг upload хийх боломжтой болсон байна. тэгэхээр 
    // 1. hazard-үүссэнээс 1 минутын дотор л энэ function ажиллах боломжтой болгосон. done
    // 2. token байвал userId-г нь шалгана. done
    // 3. hazard-үүссэн ч зураг upload хийх хэсэг fail-двэл үүссэн hazard-ыг эргүүлж устгах logic нэмэх хэрэгтэй. todo

    // 1
        const hazardId = Number(req.params.hazardId);
        const hazard = await this.hazardService.getById(hazardId, false, true, false);

        const hazardCreatedDate = new Date(hazard.date_created!); // ensure Date
        const now = Date.now();
        const oneMinuteInMs = 60 * 1000;

        if (now - hazardCreatedDate.getTime() > oneMinuteInMs) {
            console.log(now - hazardCreatedDate.getTime())
            console.log(oneMinuteInMs)
            throw new ConflictError('Hazard was already created');
        }

    // 2
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new AuthError('invalid call')
        }
        // token эсвэл headers.authorization өөрөө байхгүй бол "Bearer null" гэж авдаг.
        const token = authHeader.substring(7); // "Bearer "-ийг хасах
        if (token == 'null') {
            const files = req.files as Express.Multer.File[];
            if (isNaN(hazardId)) {
                throw new ValidationError('Invalid hazard id');
            }
            if (!files || files.length === 0) {
                throw new ValidationError('No images uploaded');
            }
            if (files.length > 3) {
                throw new ValidationError('You can upload up to 3 images only');
            }

            const uploaded = await this.hazardService.uploadImages(hazardId, files);
            res.status(201).json({ message: `${uploaded} image(s) uploaded successfully` });
            return;
        }
        
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as any;
            req.user = {
                id: decoded.id,
                user_name: decoded.user_name
            };
        } catch (jwtError) {
            throw new AuthError('Invalid or expired token');
        }

        const userIdFromToken = req.user?.id;
        const userId = hazard.user_id
        if (userIdFromToken !== userId) {
            throw new AuthError('Access deniedaaa');
        }
        const files = req.files as Express.Multer.File[];
        if (isNaN(hazardId)) {
            throw new ValidationError('Invalid hazard id');
        }
        if (!files || files.length === 0) {
            throw new ValidationError('No images uploaded');
        }
        if (files.length > 3) {
            throw new ValidationError('You can upload up to 3 images only');
        }

        const uploaded = await this.hazardService.uploadImages(hazardId, files);
        res.status(201).json({ message: `${uploaded} image(s) uploaded successfully` });
    };


    getImagesForUsers = async (req: Request, res: Response): Promise<void> => {
        const userIdFromToken = req.user?.id;
        const hazardId = Number(req.params.hazardId);
        const hazard = await this.hazardService.getById(hazardId, false, true, false);
        const userIdFromHazardOwner = hazard.user_id;
        if(userIdFromHazardOwner !== userIdFromToken){
            throw new ForbiddenError('Access denied');
        }

        const images = await this.hazardService.getImages(hazardId);
        const imagesJson = images.map(img => ({
            id: img.id,
            hazard_id: img.hazard_id,
            image_data: img.image_data.toString('base64')
        }));

        res.status(200).json(imagesJson);
    }


    getImagesForAdmins = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const hazard = await this.hazardService.getById(id, false, true, true);

        const isPrivate = hazard.is_private !== 0
        if(isPrivate){
            const adminRoleId = req.user?.role_id;
            if(adminRoleId === undefined){
                throw new AuthError('Access denied')
            }
            if(adminRoleId < 5){
                const admin_id = req.body.admin_id;
                const taskOwners = await this.taskOwnerService.getOwnersByHazardId(id);
                const isOwner = taskOwners.find(owner => owner.admin_id === admin_id);
                if(!isOwner){
                    throw new ForbiddenError('Access denied')
                }

                const images = await this.hazardService.getImages(hazard.id!);
                const imagesJson = images.map(img => ({
                    id: img.id,
                    hazard_id: img.hazard_id,
                    image_data: img.image_data.toString('base64')
                }));

                res.status(200).json(imagesJson);
                return;
            }
        }

        const images = await this.hazardService.getImages(hazard.id!);
        const imagesJson = images.map(img => ({
            id: img.id,
            hazard_id: img.hazard_id,
            image_data: img.image_data.toString('base64')
        }));

        res.status(200).json(imagesJson);
    }

}