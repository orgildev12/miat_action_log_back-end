import { LocationGroup } from '../models/LocationGroup';
export declare class LocationGroupService {
    create(requestData: typeof LocationGroup.modelFor.createRequest): Promise<LocationGroup>;
    getById(id: number): Promise<LocationGroup>;
    getAll(): Promise<LocationGroup[]>;
    update(id: number, updateData: typeof LocationGroup.modelFor.updateRequest): Promise<LocationGroup>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=LocationGroupService.d.ts.map