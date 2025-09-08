import { NextFunction, Request, Response } from 'express';
import { HazardService } from '../services/hazardService';
import { Hazard } from '../models/Hazard';

export class HazardController {
  private hazardService = new HazardService();

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestData: typeof Hazard.modelFor.createRequest = req.body;
      const createdHazard = await this.hazardService.create(requestData);

      res.status(201).json({
        success: true,
        data: createdHazard.toJSON()
      });
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const hazard = await this.hazardService.getById(id);
      if(!hazard){
        throw new Error(`Hazard with id: ${id} not found`);
      }
      res.json({
        success: true,
        data: hazard.toJSON()
      });
    } catch (error) {
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: (error as Error).message
        });
      } else {
        res.status(500).json({
          success: false,
          message: (error as Error).message
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const hazards = await this.hazardService.getAll();
      
      res.json({
        success: true,
        data: hazards.map(h => h.toJSON())
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: typeof Hazard.modelFor.updateRequest = req.body;
      
      const updatedHazard = await this.hazardService.update(id, updateData);
      
      res.json({
        success: true,
        data: updatedHazard.toJSON()
      });
    } catch (error) {
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: (error as Error).message
        });
      } else {
        res.status(400).json({
          success: false,
          message: (error as Error).message
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.hazardService.delete(id);
      
      if (deleted) {
        res.json({
          success: true,
          message: 'Hazard deleted'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Hazard not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  }
}
