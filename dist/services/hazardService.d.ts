import { Hazard } from '../models/Hazard';
export declare class HazardService {
    create(requestData: typeof Hazard.modelFor.createRequest): Promise<Hazard>;
    getById(id: number): Promise<Hazard>;
    getAll(): Promise<Hazard[]>;
    update(id: number, updateData: typeof Hazard.modelFor.updateRequest): Promise<Hazard>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=hazardService.d.ts.map